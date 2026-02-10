const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_EMAIL_APP_PASSWORD,
  },
});

transporter.verify()
  .then(() => console.log("✅ SMTP ready"))
  .catch(err => console.error("❌ SMTP error:", err.message));

const sendEmail = async ({ to, subject, text }) => {
  const info = await transporter.sendMail({
    from: `"Store App" <${process.env.OWNER_EMAIL}>`,
    to,
    subject,
    text,
  });

  console.log("📨 Mail sent:", info.response);
};

module.exports = sendEmail;
