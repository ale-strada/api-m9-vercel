import { productsIndex } from "lib/algolia";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { Product } from "lib/models/product";
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

function sendEmailComprador(email) {
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
    console.error("no hay direccion de email");
  }
}

async function saveOrder(orderId, objectID) {
  const product: any = await productsIndex.findObject(
    (hit) => hit.objectID == objectID
  );
  product.object.Orders.push(orderId);
  await productsIndex.partialUpdateObject({
    Orders: product.object.Orders,
    objectID: objectID,
  });

  console.log(product.object.Orders);
}

// {
//     productId: 'recjioEHvExJ261FB',
//     status: 'closed',
//     userId: 'VgVv4uqmb4YRH6ijSyY7',
//     aditionalInfo: { address: 'una direccion para envio', color: 'verde' },
//     externalOrder: {
//       id: 6134811307,
//       status: 'closed',
//       external_reference: 'FQMwUKAqM7oCFTBJ72ng',
//       preference_id: '1211601181-37312129-7acc-4d4a-834d-74182bb23776',
//       payments: [ [Object] ],
//       shipments: [],
//       payouts: [],
//       collector: { id: 1211601181, email: '', nickname: 'TETE1383884' },
//       marketplace: 'NONE',
//       notification_url: 'https://api-m9-vercel-ige5.vercel.app/api/ipn/mercadopago',
//       date_created: '2022-10-13T07:17:27.573-04:00',
//       last_updated: '2022-10-13T07:17:28.306-04:00',
//       sponsor_id: null,
//       shipping_cost: 0,
//       total_amount: 1190,
//       site_id: 'MLA',
//       paid_amount: 1190,
//       refunded_amount: 0,
//       payer: { id: 1211611438, email: '' },
//       items: [ [Object] ],
//       cancelled: false,
//       additional_info: '',
//       application_id: null,
//       order_status: 'paid'
//     }
//   }
