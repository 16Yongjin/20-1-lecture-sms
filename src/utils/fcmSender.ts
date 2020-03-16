import rp from "request-promise";

const uri = "https://fcm.googleapis.com/fcm/send";
const Authorization = `Bearer ${process.env.FCM_API_KEY}`;

export const sendFcm = (ids: string[], message: string) =>
  rp({
    method: "POST",
    uri,
    headers: { Authorization },
    body: {
      registration_ids: ids,
      notification: {
        title: message,
        icon: "noti-icon.png"
      }
    },
    json: true
  });
