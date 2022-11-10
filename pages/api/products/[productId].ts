import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "lib/models/product";
import { handlerCORS } from "lib/middlewares";

async function handlerProductId(req: NextApiRequest, res: NextApiResponse) {
  const product = await getProductById(req.query.productId);
  res.status(200).send({ res: product });
}

const handler = methods({
  get: handlerProductId,
});

export default handlerCORS(handler);
