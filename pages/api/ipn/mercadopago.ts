import { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import methods from "micro-method-router";
import { processOrder } from "lib/controllers/order controllers";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query;
    await processOrder(topic, id);
    res.send("ok");
  },
});
