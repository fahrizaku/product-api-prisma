// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.product.deleteMany();

  // Insert sample data
  const products = [
    {
      name: "Laptop ASUS ROG",
      price: 15000000.0,
      stock: 5,
    },
    {
      name: "Mouse Gaming Logitech",
      price: 850000.0,
      stock: 15,
    },
    {
      name: "Keyboard Mechanical",
      price: 1200000.0,
      stock: 8,
    },
    {
      name: "Monitor 27 inch 4K",
      price: 4500000.0,
      stock: 3,
    },
    {
      name: "Headset Gaming",
      price: 750000.0,
      stock: 12,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
