import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { handlerCORS } from "lib/middlewares";
import { getAllProducts } from "lib/models/product";

async function handlerProduct(req: NextApiRequest, res: NextApiResponse) {
  const product = await getAllProducts();
  res.status(200).send({ res: product });
}

const handler = methods({
  get: handlerProduct,
});

export default handlerCORS(handler);
