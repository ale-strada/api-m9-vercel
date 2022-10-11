import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const product = await getProductById(req.query.productId);
    res.status(200).send({ res: product });
  },
});
