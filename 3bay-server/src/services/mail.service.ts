import * as nodemailer from 'nodemailer'
import { mailConfig } from '../config/config.js'
import Mail from 'nodemailer/lib/mailer'

const transporter = nodemailer.createTransport({
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  secure: true,
  auth: {
    user: mailConfig.USER,
    pass: mailConfig.PWD,
  },
  tls: {
    ciphers: mailConfig.CYPHERS,
  },
})

const sendMail = async (to: string[], subject: string, html: string) => {
  if (!mailConfig.IS_ENABLED) return
  const options: Mail.Options = {
    from: `"3bay" <${mailConfig.USER}>`,
    to,
    subject,
    html,
  }
  return transporter.sendMail(options)
}

export const test = async (to: string) => {
  if (!mailConfig.IS_ENABLED) return

  return sendMail([to], '[3bay][Test] Test email', `<h2>Hello world</h2>`)
}

export default sendMail
