import moment from 'moment'
import Prisma from '@prisma/client'
import prisma from '../db/prisma.js'
import { AuthError } from '../error/error-exception.js'
import { AuthErrorCode } from '../error/error-code.js'

export function generateOtp(
  nDigit = 6,
  nMin: number = 3,
): { otp: string; expiryTime: Date } {
  const otp = Math.floor(
    Math.pow(10, nDigit - 1) + Math.random() * 9 * Math.pow(10, nDigit - 1),
  )
    .toString()
    .padStart(nDigit, '0')

  const expiryTime = moment(Date.now()).add(nMin, 'm').toDate()
  return { otp, expiryTime }
}

export async function sendVerifyOTP(user: Prisma.User, resend: boolean) {
  if (user.verified) return

  const hasOtp = await prisma.otp.findUnique({
    where: { id: user.uuid },
  })

  const { otp: otpCode, expiryTime } = generateOtp()

  if (hasOtp) {
    if (!resend) return

    if (moment(hasOtp.expiryTime).isAfter(moment.now())) {
      throw new AuthError({ code: AuthErrorCode.OTPNotExpired })
    }

    await prisma.otp.update({
      where: { id: user.uuid },
      data: {
        otp: otpCode,
        expiryTime: expiryTime,
      },
    })
  } else {
    await prisma.otp.create({
      data: {
        id: user.uuid,
        otp: otpCode,
        expiryTime: expiryTime,
      },
    })
  }
  // send the email
  // await sendMail([user.email], )
}

export async function verifyOTP(
  user: Prisma.User,
  otpCode: string,
): Promise<boolean> {
  if (user.verified) return true

  const otp = await prisma.otp.findFirst({
    where: { id: user.uuid },
  })

  if (!otp) return false

  if (moment(otp.expiryTime).isBefore(moment.now())) {
    // console.log(`Expired`)
    throw new AuthError({ code: AuthErrorCode.OTPExpired })
  }

  // console.log(`Verify user ${user.uuid} with OTP ${otpCode.trim()}; ${otp.otp}`)

  if (otpCode.trim() === otp.otp) {
    await prisma.otp.delete({
      where: { id: user.uuid },
    })
    return true
  }
  return false
}
