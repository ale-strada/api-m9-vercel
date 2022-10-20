import { productsIndex } from "lib/algolia";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { sendEmail } from "lib/mailgun";
import { airtableBase } from "lib/airtable";

export async function processOrder(topic, id) {
  console.log({ INFOMP: { topic, id } });

  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    console.log({ order: order });

    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalOrder = order;
      await myOrder.push();
      console.log({ myOrderPID: myOrder.data.productId });
      console.log({ mailComp: myOrder.data.externalOrder.payer.email });

      saveOrder(orderId, myOrder.data.productId);
      sendEmailComprador(myOrder.data.externalOrder.payer.email);
    }
  }
}

export function sendEmailComprador(email) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  if (cleanEmail) {
    const subject = "informacion de compra";
    const content = "Su pago fue realizado con éxito";

    sendEmail(cleanEmail, content, subject);
  } else {
    const mail = "strada.ale92@gmail.com";
    const subject = "informacion de compra";
    const content = "Su pago fue realizado con éxito USER SIN EMAIL";

    sendEmail(mail, content, subject);
    console.log("no hay direccion de email");
  }
}

export async function saveOrder(orderId, objectID) {
  console.log(orderId, objectID);

  const product: any = await productsIndex.findObject(
    (hit) => hit.objectID == objectID
  );

  airtableBase("Order line items").create(
    [
      {
        fields: {
          "Furniture item": [objectID],
          "order MP Id": orderId,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
}
