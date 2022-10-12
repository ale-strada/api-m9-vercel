import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderById } from "lib/models/order";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const order = await getOrderById(req.query.orderId);
    res.status(200).send(order);
  },
});
