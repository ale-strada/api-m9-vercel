import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "lib/models/auth";
import methods from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.number().required(),
  })
  .noUnknown()
  .strict();

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await bodySchema.validate(req.body);
    } catch (error) {
      res.status(400).send({ field: "body", message: error });
    }

    const { email, code } = req.body;

    const auth = await Auth.verifyCode(email, code);
    if (!auth) {
      res.status(401).send({ message: "email or code incorrect" });
    }
    const expires = auth.expires.toDate();
    const expired = Auth.codeExpired(expires);
    if (expired) {
      res.send({ message: "code expired" });
    } else {
      var token = generate({ userId: auth.userId });
      Auth.invalidateCode(email);
      res.send(token);
    }
  },
});
