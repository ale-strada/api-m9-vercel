import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { Order } from "lib/models/order";
import { createPreference } from "lib/mercadopago";
import { getProductByIdToMerchantOrder } from "lib/models/product";

async function handlerPost(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;
  const product: any = await getProductByIdToMerchantOrder(productId);

  if (!product) {
    res.status(404).send({ message: "el producto no existe" });
  }

  const order = await Order.createNewOrder({
    aditionalInfo: req.body,
    productId,
    userId: token.userId,
    status: "pending",
  });

  const pref = await createPreference({
    external_reference: order.id,
    notification_url:
      "https://api-m9-vercel-ige5.vercel.app/api/ipn/mercadopago",
    items: [
      {
        title: product.title,
        description: product.description,
        picture_url: product.pictureURL,
        category_id: product.types,
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.price,
      },
    ],
    back_urls: {
      success: "https://apx.school",
    },
  });
  res.send({ url: pref.init_point });
}

const handler = methods({
  post: handlerPost,
});

export default authMiddleware(handler);
