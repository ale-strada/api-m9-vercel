import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { userAddressUpdate } from "lib/controllers/userController";

async function patchAddress(req: NextApiRequest, res: NextApiResponse) {
  const user = await userAddressUpdate(req.body.email, req.body.address);
  res.status(200).send({ address: user });
}

const handler = methods({
  patch: patchAddress,
});

export default authMiddleware(handler);
