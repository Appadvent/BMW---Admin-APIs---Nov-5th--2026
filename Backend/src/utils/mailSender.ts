import nodemailer from "nodemailer";

export const getMailTransporter = () => {
  const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const replyEmail = async (
  email: string,
  subject: string,
  content: string
) => {
  const transporter = getMailTransporter();
  const fromAddress =
    process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || "ajay@appadvent.com";

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 32px 28px; font-size: 15px; color: #334155; }
        .message-body { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 18px 20px; border-radius: 6px; margin: 20px 0; font-size: 14px; line-height: 1.7; color: #1e293b; }
        .footer { padding: 20px 28px; background: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Streamline Support</h1>
        </div>
        <div class="content">
          <p style="margin-top: 0; font-weight: 600; color: #0f172a; font-size: 16px;">Hello,</p>
          <div class="message-body">
            ${content ? content.split("\n").join("<br>") : ""}
          </div>
          <p style="margin-bottom: 0; font-size: 14px; color: #475569;">
            Best regards,<br>
            <strong>Streamline Team</strong>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">This is a direct response to your inquiry with Streamline.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: `"Streamline Support" <${fromAddress}>`,
    to: email,
    subject: subject || "Response to your inquiry at Streamline",
    html: htmlContent,
    text: content,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent successfully: %s", info.messageId);
  return info;
};