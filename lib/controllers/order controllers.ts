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

      saveOrder(orderId, myOrder.data.productId);
      sendEmailComprador(myOrder.data.externalOrder.payer.email);
    }
  }
}

export function sendEmailComprador(email) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  if (cleanEmail) {
    const msg = {
      to: cleanEmail,
      from: "buscador.de.mascotas.app@gmail.com",
      subject: "informacion de compra",
      text: "Su pago fue realizado con éxito",
    };
    sendEmail(msg);
  } else {
    const msg = {
      to: "strada.ale92@gmail.com",
      from: "buscador.de.mascotas.app@gmail.com",
      subject: "informacion de compra",
      text: "Su pago fue realizado con éxito USER SIN EMAIL",
    };
    sendEmail(msg);
    console.log("no hay direccion de email");
  }
}

export async function saveOrder(orderId, objectID) {
  const product: any = await productsIndex.findObject(
    (hit) => hit.objectID == objectID
  );
  const orders = [];
  orders.push(orderId);

  if (product.object.Orders) {
    console.log(product.object.Orders);
    product.object.Orders.map((o) => orders.push(o));
  }
  await productsIndex.partialUpdateObject({
    New_Order: orderId,
    objectID: objectID,
    Orders: orders,
  });
}
