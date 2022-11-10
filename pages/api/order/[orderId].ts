import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderById } from "lib/models/order";
import { handlerCORS } from "lib/middlewares";

async function handlerOrderID(req: NextApiRequest, res: NextApiResponse) {
  const order = await getOrderById(req.query.orderId);
  res.status(200).send(order);
}

const handler = methods({
  get: handlerOrderID,
});

export default handlerCORS(handler);
