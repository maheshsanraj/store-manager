import { transporter } from "../config/mailConfig";
import { SendEmailOptions } from "../types/email.types";

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Store Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent");
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};
