import bcrypt from "bcrypt";

async function run() {
  const password = "c"; // le mot de passe en clair
  const hash = await bcrypt.hash(password, 10); // 10 = cost factor (très bien pour prod)
  console.log("Mot de passe:", password);
  console.log("Hash:", hash);
}

run();
