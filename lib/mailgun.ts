import formData from "form-data";
import Mailgun from "mailgun.js";

const API_KEY = process.env.MGUN_KEY;
const DOMAIN = "sandbox4f36637cf93a424ea029aec49bb5a93b.mailgun.org";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: API_KEY,
});
export function sendEmail(mail, content, subject) {
  mg.messages
    .create(DOMAIN, {
      from: "Mailgun Sandbox <postmaster@sandbox4f36637cf93a424ea029aec49bb5a93b.mailgun.org>",
      to: ["strada.ale92@gmail.com", mail],
      subject: subject,
      text: content,
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
}
