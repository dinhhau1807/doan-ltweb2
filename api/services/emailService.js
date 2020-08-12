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
      html: template,
    };

    // Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendBalanceChange(template, subject, sendTo) {
    // Define mail options
    const mailOptions = {
      from: this.from,
      to: sendTo,
      subject,
      html: template,
    };

    // Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendResetPasswordCode(verifyCode) {
    const template =
      `Your verify code is: ${verifyCode}.` +
      `Or you can use this link: <a href='${process.env.CLIENT_DOMAIN}/password-reset/${verifyCode}' target='_blank'> CLICK HERE </a>. Don't share it with anyone.`;
    await this.send(template, 'Reset your password!');
  }

  async sendOTPCode(otpCode) {
    const template = `Your OTP code is: ${otpCode}.`;
    await this.send(template, 'Verify OTP Code!');
  }

  async balanceChanges(
    accountId,
    transactionId,
    balance,
    time,
    accountBalance,
    description,
    mailTo
  ) {
    const template = `
		<h3>A2HL Banking Billing</h3>
		<p>Invoice ID: <strong>#${transactionId}</strong></p>
		<p>Account numbers: <strong>${accountId}</strong></p>
		<p>Deal: <strong>${balance}</strong> VND at <strong>${time}</strong></p>
		<p>Fees: <strong>0</strong> VND.</p>
		<p>Account balance: <strong>${accountBalance}</strong> VND.</p>								 
		<p>Description: <strong>${description}</strong>.</p>`;
    await this.sendBalanceChange(
      template,
      `Invoice #${transactionId}`,
      `${mailTo}`
    );
  }
}

module.exports = EmailService;
