import { firestore } from "../firestore";
import { Model } from "./model";
import gen from "random-seed";
import { findOrCreateAuth } from "../controllers/auth";
import addMinutes from "date-fns/addMinutes";
import isAfter from "date-fns/isAfter";
import { sendEmail } from "lib/sendgrid";

// con esta secuencia el codigo es siempre igual
// var seed = "palabra";
//var random = gen.create(seed);

var random = gen.create();

const collection = firestore.collection("auth");

export class Auth extends Model {
  constructor(id) {
    super(id, collection);
  }

  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }
  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newauth = new Auth(newAuthSnap.id);
    newauth.data = data;
    return newauth;
  }
  static async verifyCode(email, code) {
    const auth = await Auth.findByEmail(email);
    const now = new Date();

    if (code == auth.data.code) {
      return auth.data;
    } else {
      return null;
    }
  }
  static codeExpired(expires) {
    const now = new Date();
    if (isAfter(now, expires)) {
      return true;
    } else {
      return false;
    }
  }
  static async invalidateCode(email) {
    const auth = await Auth.findByEmail(email);
    auth.data.code = 0;
    auth.push();
  }
}

export async function sendCode(email: string) {
  const auth = await findOrCreateAuth(email);
  const code = random.intBetween(10000, 99999);
  const now = new Date();
  const twentyMinutesFromNow = addMinutes(now, 20);
  auth.data.code = code;
  auth.data.expires = twentyMinutesFromNow;
  await auth.push();
  const msg = {
    to: auth.data.email,
    from: "strada.ale92@gmail.com",
    subject: "Codigo para ingresar",
    text:
      "Tu codigo de seguridad para iniciar sesion es: " +
      auth.data.code.toString(),
  };
  await sendEmail(msg);
  return auth;
}
