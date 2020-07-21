const accountSid = process.env.SMS_ACCOUNT_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

class OTPService {
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
    const template = `Your verify code is: ${verifyCode}.`;
    await this.send(template);
  }

  async sendOTPCode(otpCode) {
    const template = `Your OTP code is: ${otpCode}.`;
    await this.send(template);
  }
}

module.exports = OTPService;
