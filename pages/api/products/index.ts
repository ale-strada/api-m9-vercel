import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { productsIndex } from "lib/algolia";

//esta funcion devuelve un objeto con los resultados de busqueda en algolia
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getOffsetAndLimitFromReq(req, 10, 10000);

  const results = await productsIndex.search(req.query.search as string, {
    offset: offset,
    length: limit,
  });

  //objeto con resultados
  res.send({
    results: results.hits,
    pagination: {
      limit,
      offset,
      total: results.nbHits,
    },
  });
}
