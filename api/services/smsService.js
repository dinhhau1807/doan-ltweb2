const accountSid = process.env.SMS_ACCOUNT_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

class SmsService {
  constructor(user) {
    this.to = user.phoneNumber;
    this.from = process.env.SMS_FROM_PHONE;
  }

  async send(template) {
    // Define otp options
    const otpOptions = {
      from: this.from,
      to: this.to,
      body: template,
    };

    await client.messages.create(otpOptions);
  }

  async sendResetPasswordCode(verifyCode) {
    const template =
      `Your verify code is: ${verifyCode}.` +
      `Or you can use this link: ${process.env.CLIENT_DOMAIN}/password-reset/${verifyCode} .Don't share it with anyone.`;
    await this.send(template);
  }

  async sendOTPCode(otpCode) {
    const template = `Your OTP code is: ${otpCode}.`;
    await this.send(template);
  }
}

module.exports = SmsService;
