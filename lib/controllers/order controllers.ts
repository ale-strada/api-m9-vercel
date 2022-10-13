import { productsIndex } from "lib/algolia";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { sendEmail } from "lib/sendgrid";

export async function processOrder(topic, id) {
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalOrder = order;
      await myOrder.push();
      console.log({
        email: myOrder.data.externalOrder.payer.email,
        objectID: myOrder.data.productId,
      });

      //   sendEmailComprador(myOrder.data.externalOrder.payer.email);
      //   saveOrder(orderId, myOrder.data.productId);
      //send email (compra exitosa, procesando envio)
      //email interno (alguien compro algo)
    }
  }
}

function sendEmailComprador(email) {
  const msg = {
    to: email,
    from: "buscador.de.mascotas.app@gmail.com",
    subject: "informacion de compra",
    text: "Su pago fue realizado con éxito",
  };
  sendEmail(msg);
}

async function saveOrder(orderId, objectID) {
  await productsIndex.partialUpdateObject({
    Orders: [...orderId],
    objectID: objectID,
  });
}
