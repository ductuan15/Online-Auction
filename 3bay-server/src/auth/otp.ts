import moment from 'moment'
import Prisma from '@prisma/client'
import prisma from '../db/prisma.js'
import { AuthError } from '../error/error-exception.js'
import { AuthErrorCode } from '../error/error-code.js'
import path, { dirname } from 'path'
import fs from 'fs-extra'
import Handlebars from 'handlebars'
import mjml from 'mjml'
import sendMail from '../services/mail.service.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const verifyMjmlFile = path.join(__dirname, '../../templates/verify.mjml')
const verifyMjmlContent = await fs.readFile(verifyMjmlFile)
const verifyTemplate = Handlebars.compile(
  mjml(verifyMjmlContent.toString()).html,
)

const sendVerifyEmail = async (otp: string, user: {
  email: string,
  name: string
}) => {
  const subject = `Please verify your 3bay account`
  await sendMail(
    [user.email],
    subject,
    verifyTemplate({ otp: otp, name: user.name }),
  )
}

const rpMjmlFile = path.join(__dirname, '../../templates/reset-password.mjml')
const rpMjmlContent = await fs.readFile(rpMjmlFile)
const rpTemplate = Handlebars.compile(mjml(rpMjmlContent.toString()).html)

const sendResetPasswordEmail = async (otp: string, user: Prisma.User) => {
  const subject = `Reset your 3bay account password`
  await sendMail(
    [user.email],
    subject,
    rpTemplate({ otp: otp, name: user.name }),
  )
}

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

async function sendOTP(
  user: Prisma.User,
  overrideExistedOtp: boolean,
  otpType: Prisma.OtpType,
  data: string | null | undefined,
  cb: (otpCode: Prisma.otp, user: Prisma.User) => void,
  ignoreExpiryTime?: boolean,
) {
  const hasOtp = await prisma.otp.findUnique({
    where: {
      id_type: {
        id: user.uuid,
        type: otpType,
      },
    },
  })

  const { otp: otpCode, expiryTime } = generateOtp()

  let otpData = {
    id: user.uuid,
    type: otpType,
    otp: otpCode,
    expiryTime: expiryTime,
    data: data,
  }
  if (data === undefined) {
    delete otpData.data
  }

  let otpResponse: Prisma.otp

  if (hasOtp) {
    if (!overrideExistedOtp) return

    if (moment(hasOtp.expiryTime).isAfter(moment.now()) && !ignoreExpiryTime) {
      throw new AuthError({ code: AuthErrorCode.OTPNotExpired })
    }

    otpResponse = await prisma.otp.update({
      where: {
        id_type: {
          id: user.uuid,
          type: otpType,
        },
      },
      data: {
        ...otpData,
      },
    })
  } else {
    otpResponse = await prisma.otp.create({
      data: {
        ...otpData,
      },
    })
  }
  cb(otpResponse, user)
}

export async function sendVerifyOTP(user: Prisma.User, resend: boolean) {
  if (user.verified) return

  await sendOTP(
    user,
    resend,
    Prisma.OtpType.VERIFY,
    null,
    async (otpCode: Prisma.otp, user: Prisma.User) => {
      await sendVerifyEmail(otpCode.otp, user)
    },
  )
}

export async function sendResetPasswordOTP(user: Prisma.User, resend: boolean) {
  await sendOTP(
    user,
    resend,
    Prisma.OtpType.CHANGE_PWD,
    null,
    async (otpCode: Prisma.otp, user: Prisma.User) => {
      // send the email
      await sendResetPasswordEmail(otpCode.otp, user)
    },
  )
}

export async function sendChangeEmailOTP(
  user: Prisma.User,
  resend: boolean,
  email?: string,
) {
  await sendOTP(
    user,
    true,
    Prisma.OtpType.CHANGE_EMAIL,
    !resend ? email : undefined,
    async (otpCode: Prisma.otp, user: Prisma.User) => {
      //
      await sendVerifyEmail(otpCode.otp, {
        ...user,
        email: otpCode.data!,
      })
    },
    resend,
  )
}

export async function verifyOTP(
  user: Prisma.User,
  otpCode: string,
  otpType: Prisma.OtpType,
  data?: string | null,
): Promise<boolean> {

  let whereClause = {
    id: user.uuid,
    type: otpType,
    data: data,
  }
  // When it is unnecessary to compare the data column at `otp` table
  if (data === undefined) {
    delete whereClause.data
  }

  const otp = await prisma.otp.findFirst({
    where: {
      id: user.uuid,
      type: otpType,
    },
  })

  if (!otp) return false

  if (moment(otp.expiryTime).isBefore(moment.now())) {
    // console.log(`Expired`)
    throw new AuthError({ code: AuthErrorCode.OTPExpired })
  }

  // console.log(`Verify user ${user.uuid} with OTP ${otpCode.trim()}; ${otp.otp}`)

  if (otpCode.trim() === otp.otp) {
    await prisma.otp.delete({
      where: {
        id_type: {
          id: user.uuid,
          type: otpType,
        },
      },
    })
    return true
  }
  return false
}
