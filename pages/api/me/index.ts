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
    email: yup.string().required(),
    updateData: yup.object().required(),
  })
  .noUnknown()
  .strict();

async function handlerMe(req: NextApiRequest, res: NextApiResponse, token) {
  const user = new User(token.userId);
  await user.pull();
  res.status(200).send({ updated: user.data });
}

async function handlerPatch(req: NextApiRequest, res: NextApiResponse) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }

  const user = await userUpdate(req.body.email, req.body.updateData);
  res.status(200).send(user);
}

const handler = methods({
  get: handlerMe,
  patch: handlerPatch,
});
const authMiddlewarePass = authMiddleware(handler);

export default handlerCORS(authMiddlewarePass);
