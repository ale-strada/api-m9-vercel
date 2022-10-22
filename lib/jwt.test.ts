import { generate, decode } from "lib/jwt";
import test from "ava";

test("JWT encode/decode", (t) => {
  const payload = { user: "test" };
  const token = generate(payload);
  const salida: any = decode(token);
  delete salida.iat;
  t.deepEqual(payload, salida);
});
