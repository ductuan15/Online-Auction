import * as nodemailer from 'nodemailer'
import { mailConfig } from '../config/config.js'
import Mail from 'nodemailer/lib/mailer'
import fs from 'fs-extra'
import mjml from 'mjml'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
    // from: `"3bay" <${mailConfig.USER}>`,
    to,
    subject,
    html,
  }
  return transporter.sendMail(options)
}

export const test = async (to: string) => {
  if (!mailConfig.IS_ENABLED) return

  const testFile = path.join(__dirname, '../templates/test.mjml')
  const mjmlContent = await fs.readFile(testFile)
  const html = mjml(mjmlContent.toString()).html

  return sendMail([to], '[3bay]　テスト', html)
}

export default sendMail
