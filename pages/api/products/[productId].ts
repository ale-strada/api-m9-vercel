import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).send("product data" + JSON.stringify(req.query));
  },
});
