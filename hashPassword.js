import bcrypt from "bcryptjs";

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

generateHash("1505");
