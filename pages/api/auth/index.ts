import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/models/auth";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";

// let bodySchema = yup
//   .object()
//   .shape({
//     email: yup.string().required(),
//   })
//   .noUnknown()
//   .strict();

async function handlerAuth(req: NextApiRequest, res: NextApiResponse) {
  try {
    //await bodySchema.validate(req.body);
    const authcode = await sendCode(req.body.email);
    res.send(authcode.data);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }
}

const handler = methods({
  post: handlerAuth,
});

export default handlerCORS(handler);
