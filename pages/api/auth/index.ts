import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import methods from "micro-method-router";
import * as yup from "yup";

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
    } catch (error) {
      res.status(400).send({ field: "body", message: error });
    }
    const authcode = await sendCode(req.body.email);

    res.send(authcode.data);
  },
});
