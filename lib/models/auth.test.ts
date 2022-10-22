import gen from "random-seed";
import test from "ava";
import { isAfter } from "date-fns";

test("create random code", (t) => {
  const random = gen.create();
  const code1 = random.intBetween(10000, 99999);
  const code2 = random.intBetween(10000, 99999);

  t.notDeepEqual(code1, code2);
});

test("date-fns", (t) => {
  const now = new Date();
  const testDate = new Date("2022-10-22T18:08:30.393Z");
  const salida = isAfter(now, testDate);
  t.true(salida);
});
