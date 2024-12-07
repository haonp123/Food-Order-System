import { MailtrapClient } from "mailtrap";

import { MAILTRAP_TOKEN, MAILTRAP_TEMPLATE_OTP_MAIL } from "../config";

// OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let otp_expiry = new Date();
  otp_expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, otp_expiry };
};

export const onRequestOTP = async (otp: number, toEmail: string) => {
  console.log(otp, toEmail);

  const client = new MailtrapClient({ token: MAILTRAP_TOKEN });
  const sender = {
    email: "hello@demomailtrap.com",
    name: "Food Order - OTP Mail",
  };
  const recipients = [
    {
      email: toEmail,
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      template_uuid: MAILTRAP_TEMPLATE_OTP_MAIL,
      template_variables: {
        opt_value: otp,
      },
    })
    .then(console.log, console.error);
};
