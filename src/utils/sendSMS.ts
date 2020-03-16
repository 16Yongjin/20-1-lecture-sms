const rp = require("request-promise");
import "dotenv/config";

const accessKey = process.env.SMS_ACCESS_KEY;
const secretKey = process.env.SMS_SECRET_KEY;
const serviceKey = process.env.SMS_SERVICE_KEY;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
const url = `https://api-sens.ncloud.com/v1/sms/services/${serviceKey}/messages`;

export const sendSMS = (to: string[], content: string) =>
  rp.post({
    url: url,
    json: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-auth-key": accessKey,
      "x-ncp-service-secret": secretKey
    },
    body: {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: adminPhoneNumber,
      content,
      to
    }
  });
