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

  async sendBalanceChanges(template, subject, sendTo) {
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

  async balanceChangesDeposit(
    accountSourceId,
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
		<p>Account numbers: <strong>${accountSourceId}</strong></p>
		<p>Deal: <strong>${balance}</strong> VND at <strong>${time}</strong></p>
		<p>Fees: <strong>0</strong> VND.</p>
		<p>Description: <strong>${description}</strong>.</p>
		<p>Account balance: <strong>${accountBalance}</strong> VND.</p>`;
    await this.sendBalanceChanges(
      template,
      `Invoice #${transactionId}`,
      `${mailTo}`
    );
  }

  async balanceChangesInternal(
    nameAccountSource,
    accountSourceId,
    nameDestination,
    accountDestinationId,
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
		<p>Account numbers: <strong>${nameAccountSource}(${accountSourceId})</strong></p>
		<p>Deal: <strong>${balance}</strong> VND at <strong>${time}</strong></p>
		<p>Fees: <strong>0</strong> VND.</p>
		<p>To Account numbers: <strong>${nameDestination}(${accountDestinationId})</strong></p>
		<p>Description: <strong>${description}</strong>.</p>
		<p>Account balance: <strong>${accountBalance}</strong> VND.</p>`;
    await this.sendBalanceChanges(
      template,
      `Invoice #${transactionId}`,
      `${mailTo}`
    );
  }

  async balanceChangesExternal(
    transactionId,
    accountSourceId,
    balance,
    time,
    description,
    accountDestinationId,
    bankDestinationName,
    accountBalance,
    mailTo
  ) {
    const template = `
		<h3>A2HL Banking Billing</h3>
		<p>Invoice ID: <strong>#${transactionId}</strong></p>
		<p>Account numbers: <strong>${accountSourceId}</strong></p>
		<p>Deal: <strong>${balance}</strong> VND at <strong>${time}</strong></p>
		<p>Fees: <strong>0</strong> VND</p>
		<p>Description: <strong>${description}</strong></p>
		<p>To account numbers: ${accountDestinationId} at <strong>${bankDestinationName}</strong></p>
		<p>Account balance: <strong>${accountBalance}</strong> VND</p>`;

    await this.sendBalanceChanges(
      template,
      `Invoice #${transactionId}`,
      `${mailTo}`
    );
  }
}

module.exports = EmailService;
