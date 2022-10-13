import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.AS_CLIENT, process.env.AS_KEY);
export const productsIndex = client.initIndex("products");
