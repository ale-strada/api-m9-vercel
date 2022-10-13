import { NextApiRequest, NextApiResponse } from "next";
import { gerMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import methods from "micro-method-router";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
      const order = await gerMerchantOrder(id);
      if (order.order_status == "paid") {
        const orderId = order.external_reference;
        const myOrder = new Order(orderId);
        await myOrder.pull();
        myOrder.data.status = "closed";
        myOrder.data.externalOrder = order;
        await myOrder.push();
        //send email (compra exitosa, procesando envio)
        //email interno (alguien compro algo)
      }
    }

    res.send("ok");
  },
});
