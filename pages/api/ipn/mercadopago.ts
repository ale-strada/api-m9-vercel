import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { processOrder } from "lib/controllers/order controllers";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares";

let querySchema = yup.object().shape({
  id: yup.string().required(),
  topic: yup.string().required(),
});

async function handlerIPN(req: NextApiRequest, res: NextApiResponse) {
  try {
    await querySchema.validate(req.query);
  } catch (error) {
    res.status(400).send({ field: "query", message: error });
  }
  const { id, topic } = req.query;
  await processOrder(topic, id);
  res.send("ok");
}

const handler = methods({
  post: handlerIPN,
});

export default handlerCORS(handler);
