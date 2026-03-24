import nodemailer from 'nodemailer'

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// 发送验证码邮件
export const sendVerificationCode = async (email, code) => {
  const transporter = createTransporter()
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'OpenClaw Monitor <noreply@example.com>',
    to: email,
    subject: 'OpenClaw 监控系统 - 验证码',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28C78E;">OpenClaw 监控系统</h2>
        <p>您好!</p>
        <p>您的验证码是: <strong style="font-size: 24px; color: #28C78E;">${code}</strong></p>
        <p>验证码有效期为 5 分钟,请尽快使用。</p>
        <p>如果这不是您的操作,请忽略此邮件。</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">此邮件由系统自动发送,请勿回复。</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('邮件发送失败:', error)
    return { success: false, error: error.message }
  }
}

// 发送通知邮件
export const sendNotification = async (email, subject, content) => {
  const transporter = createTransporter()
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'OpenClaw Monitor <noreply@example.com>',
    to: email,
    subject: subject,
    html: content
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('邮件发送失败:', error)
    return { success: false, error: error.message }
  }
}
