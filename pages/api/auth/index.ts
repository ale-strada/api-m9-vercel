import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import { sendEmail } from "lib/sendgrid";
//import { sendEmail } from "lib/mailgun";
import methods from "micro-method-router";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const authcode = await sendCode(req.body.email);
    // para enviar el email con mailgun
    // const email = authcode.data.email;
    // const subject = "Codigo para ingresar";
    // const content =
    //   "Tu codigo de seguridad para iniciar sesion es: " +
    //   authcode.data.code.toString();

    // sendEmail(email, content, subject);

    // para enviar el email con sendgrid
    const msg = {
      to: authcode.data.email,
      from: "strada.ale92@gmail.com",
      subject: "Codigo para ingresar",
      text:
        "Tu codigo de seguridad para iniciar sesion es: " +
        authcode.data.code.toString(),
    };
    sendEmail(msg);

    res.send(authcode.data);
  },
});
