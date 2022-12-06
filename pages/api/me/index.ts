import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "lib/models/user";
import { authMiddleware } from "lib/middlewares";
import { userUpdate } from "lib/controllers/userController";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    name: yup.string(),
    email: yup.string(),
    address: yup.string(),
    phone: yup.number(),
  })
  .noUnknown()
  .strict(true);

async function handlerMe(req: NextApiRequest, res: NextApiResponse, token) {
  const user = new User(token.userId);
  await user.pull();
  res.status(200).send(user.data);
}

async function handlerPatch(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }

  const user = await userUpdate(token.userId, req.body);
  res.status(200).send(user);
}

const handler = methods({
  get: handlerMe,
  patch: handlerPatch,
});
const authMiddlewarePass = authMiddleware(handler);

export default handlerCORS(authMiddlewarePass);
