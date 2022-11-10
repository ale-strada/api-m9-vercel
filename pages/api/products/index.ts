import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { handlerCORS } from "lib/middlewares";

async function handlerProduct(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({ m: "PRODUCTOS" });
}

const handler = methods({
  get: handlerProduct,
});

export default handlerCORS(handler);
