import { User } from "lib/models/user";

export async function userUpdate(userId, updateData?) {
  const email = await getEmailbyId(userId);
  const user = await User.findByEmail(email);
  console.log(userId, email, "data");

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
export async function getEmailbyId(userId) {
  const user = await new User(userId);
  await user.pull();
  return user.data.email;
}
