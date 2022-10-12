import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getOrdersByUserId } from "lib/models/order";

async function getOrders(req: NextApiRequest, res: NextApiResponse, token) {
  const orders = await getOrdersByUserId(token.userId);
  res.status(200).send(orders);
}

const handler = methods({
  get: getOrders,
});

export default authMiddleware(handler);
