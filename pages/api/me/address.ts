import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { userAddressUpdate } from "lib/controllers/userController";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    address: yup.string().required(),
  })
  .noUnknown()
  .strict();

async function patchAddress(req: NextApiRequest, res: NextApiResponse) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }
  const user = await userAddressUpdate(req.body.email, req.body.address);
  res.status(200).send({ address: user });
}

const handler = methods({
  patch: patchAddress,
});

const authMiddlewarePass = authMiddleware(handler);

export default handlerCORS(authMiddlewarePass);
