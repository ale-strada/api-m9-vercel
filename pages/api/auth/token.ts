import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "lib/models/auth";
import methods from "micro-method-router";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email;
    const code = req.body.code;
    const auth = await Auth.verifyCode(email, code);
    if (!auth) {
      res.status(401).send({ message: "email or code incorrect" });
    }
    const expires = auth.expires.toDate();
    const expired = Auth.codeExpired(expires);
    if (expired) {
      res.send({ message: "code expired" });
    } else {
      var token = generate({ userId: auth.userId });
      Auth.invalidateCode(email);
      res.send(token);
    }
  },
});
