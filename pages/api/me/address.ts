import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { userAddressUpdate } from "lib/controllers/userController";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    address: yup.string().required(),
  })
  .noUnknown()
  .strict();

async function patchAddress(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }
  const user = await userAddressUpdate(token.userId, req.body.address);
  res.status(200).send(user);
}

const handler = methods({
  patch: patchAddress,
});

const authMiddlewarePass = authMiddleware(handler);

export default handlerCORS(authMiddlewarePass);
