import { firestore } from "../firestore";
import { Model } from "./model";
const collection = firestore.collection("users");

export class User extends Model {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id: string) {
    super(id, collection);
    this.id = id;
    this.ref = collection.doc(id);
  }

  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }

  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newUser = new User(first.id);
      newUser.data = first.data();
      return newUser;
    } else {
      return null;
    }
  }
}
