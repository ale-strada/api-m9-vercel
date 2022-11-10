import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware, handlerCORS } from "lib/middlewares";
import { CreateOrderRes } from "lib/controllers/order controllers";
import * as yup from "yup";

let querySchema = yup.object().shape({
  productId: yup.string().required(),
});

let bodySchema = yup
  .object()
  .shape({
    address: yup.string(),
    color: yup.string(),
  })
  .noUnknown()
  .strict();

async function handlerPost(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await querySchema.validate(req.query);
  } catch (error) {
    res.status(400).send({ field: "query", message: error });
  }
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ field: "body", message: error });
  }
  const { productId } = req.query;
  try {
    const pref = await CreateOrderRes(productId, token.userId, req.body);
    res.send(pref);
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

const handler = methods({
  post: handlerPost,
});

const authMiddlewarePass = authMiddleware(handler);

export default handlerCORS(authMiddlewarePass);
