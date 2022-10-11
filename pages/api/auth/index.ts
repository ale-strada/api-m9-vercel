import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import { sendEmailCode } from "lib/sendgrid";
import methods from "micro-method-router";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const authcode = await sendCode(req.body.email);
    const msg = {
      to: authcode.data.email,
      from: "buscador.de.mascotas.app@gmail.com",
      subject: "Codigo para ingresar",
      text:
        "Tu codigo de seguridad para iniciar sesion es: " +
        authcode.data.code.toString(),
    };
    sendEmailCode(msg);
    res.send(authcode.data);
  },
});
