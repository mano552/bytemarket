import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCT_IMAGES: Record<string, string> = {
  "Wireless Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop&q=80",
  "Mechanical Keyboard": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&h=400&fit=crop&q=80",
  "4K Webcam": "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=400&fit=crop&q=80",
  "Bluetooth Speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=400&fit=crop&q=80",
  "Smartwatch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop&q=80",
  "Wireless Mouse": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop&q=80",
  "TypeScript Handbook": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=400&fit=crop&q=80",
  "Clean Code": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=400&fit=crop&q=80",
  "Atomic Habits": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=400&fit=crop&q=80",
  "The Pragmatic Programmer": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&h=400&fit=crop&q=80",
  "Classic Sneakers": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop&q=80",
  "Denim Jacket": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=400&fit=crop&q=80",
  "Aviator Sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop&q=80",
  "Canvas Backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop&q=80",
  "Espresso Machine": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=400&fit=crop&q=80",
  "Blender Pro": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=400&fit=crop&q=80",
  "Desk Lamp": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=400&fit=crop&q=80",
  "Yoga Mat": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=400&fit=crop&q=80",
  "Running Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop&q=80",
  "Insulated Water Bottle": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=400&fit=crop&q=80",
};

async function main(): Promise<void> {
  const categoryNames = ["Electronics", "Books", "Fashion", "Home & Kitchen", "Sports & Outdoors"];

  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = cat.id;
  }

  const products = [
    { name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones with 30hr battery life.", price: 89.99, stock: 25, category: "Electronics" },
    { name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard with hot-swappable switches.", price: 59.99, stock: 40, category: "Electronics" },
    { name: "4K Webcam", description: "Ultra-sharp webcam for streaming and video calls.", price: 74.5, stock: 18, category: "Electronics" },
    { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 12hr playtime.", price: 45.0, stock: 30, category: "Electronics" },
    { name: "Smartwatch", description: "Fitness tracking smartwatch with heart-rate monitor.", price: 129.99, stock: 15, category: "Electronics" },
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse with silent clicks.", price: 24.99, stock: 60, category: "Electronics" },
    { name: "TypeScript Handbook", description: "A deep dive into TypeScript fundamentals and advanced types.", price: 24.99, stock: 100, category: "Books" },
    { name: "Clean Code", description: "A handbook of agile software craftsmanship.", price: 32.5, stock: 45, category: "Books" },
    { name: "Atomic Habits", description: "An easy and proven way to build good habits.", price: 18.99, stock: 70, category: "Books" },
    { name: "The Pragmatic Programmer", description: "Your journey to mastery, classic edition.", price: 29.99, stock: 35, category: "Books" },
    { name: "Classic Sneakers", description: "Everyday comfort sneakers in white leather.", price: 64.99, stock: 50, category: "Fashion" },
    { name: "Denim Jacket", description: "Timeless washed denim jacket, unisex fit.", price: 55.0, stock: 22, category: "Fashion" },
    { name: "Aviator Sunglasses", description: "UV-protected polarized aviator sunglasses.", price: 19.99, stock: 65, category: "Fashion" },
    { name: "Canvas Backpack", description: "Durable canvas backpack with laptop compartment.", price: 42.0, stock: 28, category: "Fashion" },
    { name: "Espresso Machine", description: "Compact espresso machine with milk frother.", price: 149.99, stock: 12, category: "Home & Kitchen" },
    { name: "Blender Pro", description: "High-speed blender for smoothies and soups.", price: 69.99, stock: 20, category: "Home & Kitchen" },
    { name: "Desk Lamp", description: "Adjustable LED desk lamp with USB charging port.", price: 27.99, stock: 40, category: "Home & Kitchen" },
    { name: "Yoga Mat", description: "Non-slip eco-friendly yoga mat, 6mm thick.", price: 22.99, stock: 55, category: "Sports & Outdoors" },
    { name: "Running Shoes", description: "Lightweight breathable running shoes.", price: 79.99, stock: 33, category: "Sports & Outdoors" },
    { name: "Insulated Water Bottle", description: "Keeps drinks cold for 24 hours, 1L capacity.", price: 16.99, stock: 80, category: "Sports & Outdoors" },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    const imageUrl = PRODUCT_IMAGES[p.name];

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { imageUrl },
      });
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: categories[p.category],
        imageUrl,
      },
    });
  }

  const hashedPassword: string = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Seed complete: ${categoryNames.length} categories, ${products.length} products.`);
  console.log("Admin login: admin@shop.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
