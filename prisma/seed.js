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
      name: "Stetoskop Littmann Classic III",
      price: 3500000,
      stock: 25,
    },
    {
      name: "Tensimeter Digital Omron",
      price: 1200000,
      stock: 15,
    },
    {
      name: "Termometer Infrared",
      price: 850000,
      stock: 30,
    },
    {
      name: "Nebulizer Portable",
      price: 2500000,
      stock: 8,
    },
    {
      name: "Pulse Oximeter",
      price: 650000,
      stock: 20,
    },
    {
      name: "Sarung Tangan Latex (Box)",
      price: 120000,
      stock: 100,
    },
    {
      name: "Masker Medis N95 (Box)",
      price: 350000,
      stock: 50,
    },
    {
      name: "Jarum Suntik 5ml (Pack)",
      price: 85000,
      stock: 200,
    },
    {
      name: "Infus Set Disposable",
      price: 15000,
      stock: 150,
    },
    {
      name: "Wheelchair Standard",
      price: 2800000,
      stock: 12,
    },
    {
      name: "Bed Pan Stainless Steel",
      price: 450000,
      stock: 25,
    },
    {
      name: "Lampu Operasi LED",
      price: 8500000,
      stock: 2,
    },
    {
      name: "Defibrillator Portable",
      price: 9500000,
      stock: 3,
    },
    {
      name: "Ventilator Medis",
      price: 9999999,
      stock: 5,
    },
    {
      name: "Monitor Pasien 5 Parameter",
      price: 7500000,
      stock: 8,
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
