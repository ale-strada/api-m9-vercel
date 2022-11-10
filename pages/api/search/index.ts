import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { productsIndex } from "lib/algolia";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";
import methods from "micro-method-router";

let querySchema = yup
  .object()
  .shape({
    search: yup.string().required(),
    offset: yup.string().required(),
    limit: yup.string().required(),
  })
  .noUnknown()
  .strict();

//esta funcion devuelve un objeto con los resultados de busqueda en algolia
async function handlerSearch(req: NextApiRequest, res: NextApiResponse) {
  try {
    await querySchema.validate(req.query);
  } catch (error) {
    res.status(400).send({ field: "query", message: error });
  }
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

const handler = methods({
  get: handlerSearch,
});

export default handlerCORS(handler);
