import * as nodemailer from 'nodemailer'
import { mailConfig } from '../config/config.js'
import Mail from 'nodemailer/lib/mailer'
import fs from 'fs-extra'
import mjml from 'mjml'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import Handlebars from 'handlebars'
import c from 'ansi-colors'
import MailType, { mailFileNames, mailTitles } from '../const/mail.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const mailTemplates = new Map<MailType, HandlebarsTemplateDelegate>()

function initMailTemplates() {
  console.log(c.yellow('Start loading email templates'))
  for (const [key, value] of mailFileNames) {
    console.log(c.yellow(value))
    const mjmlContent = fs.readFileSync(
      path.join(__dirname, `../../templates/${value}`),
    )
    const template = Handlebars.compile(mjml(mjmlContent.toString()).html)
    mailTemplates.set(key, template)
  }
}

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

  const filteredMails = to.filter((mail) => {
    return mail.indexOf('@example') === -1
  })

  if (filteredMails.length === 0) return

  const options: Mail.Options = {
    // from: `"3bay" <${mailConfig.USER}>`,
    to: filteredMails,
    subject,
    html,
  }
  return await transporter.sendMail(options)
}

const sendMailTemplate = async (
  to: string[],
  type: MailType,
  templateData?: unknown,
  titleData?: string[],
) => {
  let subject = ''
  const mailTitle = mailTitles.get(type)
  if (mailTitle) {
    if (typeof mailTitle === 'string') {
      subject = mailTitle
    } else {
      subject = mailTitle(titleData ?? [])
    }
  }

  let html = ''
  const template = mailTemplates.get(type)
  if (template) {
    html = template(templateData)
  }

  return await sendMail(to, subject, html)
}

export const test = async (to: string) => {
  if (!mailConfig.IS_ENABLED) return

  return await sendMailTemplate([to], MailType.TEST)
}

initMailTemplates()

export default sendMailTemplate
