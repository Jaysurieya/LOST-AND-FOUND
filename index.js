const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const prisma = new PrismaClient();

async function main() {
  const password = "123"; // Original password

  // Encrypt the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new admin with the hashed password
  const newAdmin = await prisma.admin.create({
    data: {
      name: "ma",
      email: "ma@gmail.com",
      password: hashedPassword, // Store the hashed password
    },
  });

  console.log("Admin created:", newAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
