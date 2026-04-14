import type { IncomingMessage, ServerResponse } from 'node:http'
import process from 'node:process'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method Not Allowed')
    return
  }

  let body = ''
  for await (const chunk of req) body += chunk
  const { replyTo, subject, html } = JSON.parse(body)

  const { data, error } = await resend.emails.send({
    from: 'atlaxt.me <noreply@atlaxt.me>',
    to: process.env.CONTACT_EMAIL!,
    replyTo,
    subject,
    html,
  })

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = error ? 500 : 200
  res.end(JSON.stringify(error ?? { id: data?.id }))
}
