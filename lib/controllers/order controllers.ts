import { productsIndex } from "lib/algolia";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { sendEmail } from "lib/sendgrid";
import { airtableBase } from "lib/airtable";
import { getProductByIdToMerchantOrder } from "lib/models/product";

// toma la informacion que devuelve MP la guarda en algolia e invoca funciones de notificacion a comprador y vendedor
export async function processOrder(topic, id) {
  console.log({ INFOMP: { topic, id } });

  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalOrder = order;
      await myOrder.push();

      await saveOrder(orderId, myOrder.data.productId);
      await sendEmailComprador(myOrder.data.externalOrder.payer.email);
    }
  }
}
//notifica al comprador sobre su pago exitoso
export async function sendEmailComprador(email) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  if (cleanEmail) {
    // const subject = "informacion de compra";
    // const content = "Su pago fue realizado con éxito";
    // sendEmail(cleanEmail, content, subject);

    const msg = {
      to: cleanEmail,
      from: "strada.ale92@gmail.com",
      subject: "informacion de compra",
      text: "Su pago fue realizado con éxito",
    };

    await sendEmail(msg);
  } else {
    const msg = {
      to: "strada.ale92@gmail.com",
      from: "strada.ale92@gmail.com",
      subject: "informacion de compra",
      text: "Su pago fue realizado con éxito",
    };

    sendEmail(msg);
    console.log("no hay direccion de email");
  }
}
// utiliza el id de una order y el id de un producto para guardar esta order en la tabla de Airtable
export async function saveOrder(orderId, objectID) {
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

export async function CreateOrderRes(productId, userId, aditionalInfo) {
  const product: any = await getProductByIdToMerchantOrder(productId);
  if (!product) {
    throw "el producto no existe";
  }

  const order = await Order.createNewOrder({
    aditionalInfo,
    productId: product.objectID,
    userId: userId,
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

  return { url: pref.init_point };
}
