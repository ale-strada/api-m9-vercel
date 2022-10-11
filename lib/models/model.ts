export class Model {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string, collection: FirebaseFirestore.CollectionReference) {
    this.ref = collection.doc(id);
    this.id = id;
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    this.ref.update(this.data);
  }

  async create() {
    this.ref.create(this.data);
  }
}
