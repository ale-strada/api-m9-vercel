import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import { sendEmail } from "lib/mailgun";
import methods from "micro-method-router";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const authcode = await sendCode(req.body.email);

    const email = authcode.data.email;
    const subject = "Codigo para ingresar";
    const content =
      "Tu codigo de seguridad para iniciar sesion es: " +
      authcode.data.code.toString();

    sendEmail(email, content, subject);
    res.send(authcode.data);
  },
});
