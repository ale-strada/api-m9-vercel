import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { processOrder } from "lib/controllers/order controllers";
import * as yup from "yup";

let querySchema = yup.object().shape({
  id: yup.string().required(),
  topic: yup.string().required(),
});

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (error) {
      res.status(400).send({ field: "query", message: error });
    }
    const { id, topic } = req.query;
    await processOrder(topic, id);
    res.send("ok");
  },
});
