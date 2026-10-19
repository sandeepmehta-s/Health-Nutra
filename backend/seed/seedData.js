import { Product } from "../models/Product.js";
import { Admin } from "../models/Admin.js";

export async function seedDatabase() {
  try {
    // 1. Seed Default Admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultUsername = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      const defaultAdmin = new Admin({
        username: defaultUsername,
        password: defaultPassword,
        name: "Health Nutra Administrator",
      });
      await defaultAdmin.save();
      console.log(`[Seed] Created default admin account: "${defaultUsername}"`);
    }

    // 2. Seed Starter Products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const starterProducts = [
        {
          name: "Health Nutra 9G",
          category: "Multivitamin",
          shortDescription: "Complete daily nutrition with vitamins & minerals.",
          fullDescription:
            "Multivitamin, multimineral & antioxidant tablets formulated with 9 essential vitality blends. 10 x 10 tablets. Take one tablet daily after meals or as advised by your healthcare professional.",
          price: 235,
          unit: "Strip",
          image: "/uploads/9g.png",
          status: "active",
        },
        {
          name: "Health Nutra 10Q Syrup",
          category: "Syrup",
          shortDescription: "Energy booster syrup with CoQ10 & antioxidants for daily vitality.",
          fullDescription:
            "200ml multivitamin, CoQ10 & antioxidant syrup. Helps combat fatigue, support cardiac health, and revitalize natural stamina. Shake well before use.",
          price: 210,
          unit: "200ml",
          image: "/uploads/10q.png",
          status: "active",
        },
        {
          name: "Omega-3 Capsules",
          category: "Omega-3",
          shortDescription: "Supports heart, brain, joint, and cardiovascular wellness.",
          fullDescription:
            "Ultra-strength molecularly distilled fish oil softgels providing 1000mg EPA/DHA. Supports clear focus, cardiovascular circulation, and joint flexibility.",
          price: 499,
          unit: "Strip",
          image: "/uploads/omega3.png",
          status: "active",
        },
        {
          name: "Green Tea Extract",
          category: "Green Tea",
          shortDescription: "Standardised 50% EGCG capsules for metabolism & antioxidant support.",
          fullDescription:
            "Standardised green tea botanical extract rich in natural polyphenols and 50% EGCG. Promotes healthy metabolic rate, gentle weight balance, and antioxidant protection.",
          price: 299,
          unit: "Box",
          image: "/uploads/greentea.png",
          status: "active",
        },
      ];

      await Product.insertMany(starterProducts);
      console.log(`[Seed] Seeded ${starterProducts.length} starter products into database.`);
    }
  } catch (err) {
    console.error(`[Seed] Error seeding database: ${err.message}`);
  }
}
