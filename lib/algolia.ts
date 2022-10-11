import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.AS_CLIENT, process.env.AS_KEY);
export const productsIndex = client.initIndex("products");

export async function getProductById(productId) {
  const product = await productsIndex.findObject(
    (hit) => hit.objectID == productId
  );
  return product;
}
