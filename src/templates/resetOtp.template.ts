export const otpTemplate = (name: string, otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Hello ${name},</h2>
      <p>Your OTP for password reset is:</p>
      
      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        margin: 20px 0;
        color: #4CAF50;
      ">
        ${otp}
      </div>

      <p>This OTP is valid for <b>5 minutes</b>.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>

      <br/>
      <p>Thanks,<br/>Your Team</p>
    </div>
  `;
};