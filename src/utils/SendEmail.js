const nodemailer = require("nodemailer");
const brevoTransport = require("nodemailer-brevo-transport");

const transporter = nodemailer.createTransport(
  new brevoTransport({
    apiKey: process.env.BREVO_API_KEY
  })
);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.OWNER_EMAIL,   // must be verified in Brevo
      to,
      subject,
      text,
    });

    console.log("📨 Brevo mail sent:", info.messageId);
  } catch (err) {
    console.error("❌ Brevo mail error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
