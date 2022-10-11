import { User } from "lib/models/user";
import { Auth } from "lib/models/auth";

export async function userUpdate(email, updateData?) {
  const user = await User.findByEmail(email);
  user.data = updateData;
  await user.push();
  return user.data;
}

export async function userAddressUpdate(email, address) {
  const user = await User.findByEmail(email);
  user.data.address = address;
  await user.push();
  return user.data;
}
