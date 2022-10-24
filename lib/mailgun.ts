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
  console.log("envia mail");

  mg.messages
    .create(DOMAIN, {
      from: "strada.ale92@gmail.com",
      to: ["strada.ale92@gmail.com", mail],
      subject: subject,
      text: content,
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
}

// ejemplo para enviar el email con mailgun
// const email = authcode.data.email;
// const subject = "Codigo para ingresar";
// const content =
//   "Tu codigo de seguridad para iniciar sesion es: " +
//   authcode.data.code.toString();

// sendEmail(email, content, subject);
