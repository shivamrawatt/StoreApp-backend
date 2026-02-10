const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000
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
