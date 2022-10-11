import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "lib/models/user";
import { authMiddleware } from "lib/middlewares";
import { userUpdate } from "lib/controllers/userController";

async function handlerMe(req: NextApiRequest, res: NextApiResponse, token) {
  const user = new User(token.userId);
  await user.pull();
  res.status(200).send({ updated: user.data });
}

async function handlerPatch(req: NextApiRequest, res: NextApiResponse) {
  const user = await userUpdate(req.body.email, req.body.updateData);
  res.status(200).send(user);
}

const handler = methods({
  get: handlerMe,
  patch: handlerPatch,
});

export default authMiddleware(handler);
