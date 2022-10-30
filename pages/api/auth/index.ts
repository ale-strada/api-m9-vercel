import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import methods from "micro-method-router";
import * as yup from "yup";
import { sendEmail } from "lib/sendgrid";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
  })
  .noUnknown()
  .strict();

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await bodySchema.validate(req.body);
      const authcode = await sendCode(req.body.email);
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
    } catch (error) {
      res.status(400).send({ field: "body", message: error });
    }
  },
});
