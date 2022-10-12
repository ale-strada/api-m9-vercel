import { productsIndex } from "lib/algolia";
import { firestore } from "../firestore";
import { Model } from "./model";
const collection = firestore.collection("users");
type ProductType = {
  title: string;
  price: string;
  description: string;
  pictureURL: string;
  inStock: boolean;
  materials: [];
  objectID: string;
  userId?: string;
};
export class Product<ProductType> extends Model {
  ref: FirebaseFirestore.DocumentReference;

  constructor(id: string) {
    super(id, collection);
    this.id = id;
    this.ref = collection.doc(id);
  }
}

export async function getProductByIdToMerchantOrder(productId) {
  const product: any = await productsIndex.findObject(
    (hit) => hit.objectID == productId
  );

  const desCortada = product.object.Description.slice(
    0,
    -product.object.Description.length + 255
  );
  const productToOrder: ProductType = {
    title: product.object.Name,
    description: desCortada,
    price: product.object["Unit cost"],
    pictureURL: product.object.Images[0].url,
    inStock: product.object["In stock"],
    materials: product.Materials,
    objectID: product.objectID,
  };

  return productToOrder;
}

export async function getProductById(productId) {
  const product = await productsIndex.findObject(
    (hit) => hit.objectID == productId
  );
  return product.object;
}
