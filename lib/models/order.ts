import { firestore } from "../firestore";
import { Model } from "./model";
const collection = firestore.collection("orders");

export class Order extends Model {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id: string) {
    super(id, collection);
    this.id = id;
    this.ref = collection.doc(id);
  }
  static async createNewOrder(data) {
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;
    newOrder.data.createdAt = new Date();
    return newOrder;
  }
}
