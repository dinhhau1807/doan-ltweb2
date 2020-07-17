const nodemailer = require('nodemailer');

class EmailService {
  constructor(user, url) {
    this.to = user.email;
    this.displayName = user.name;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Define mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: template,
    };

    // Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendResetPasswordCode(verifyCode) {
    const template = `Your verify code is: ${verifyCode}.`;
    await this.send(template, 'Reset your password!');
  }

  async sendOTPCode(otpCode) {
    const template = `Your otp code is: ${otpCode}.`;
    await this.send(template, 'Verify OTP Code!');
  }
}

module.exports = EmailService;
