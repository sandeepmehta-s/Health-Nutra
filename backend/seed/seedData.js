import { Product } from "../models/Product.js";
import { Admin } from "../models/Admin.js";

export async function seedDatabase() {
  try {
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
          shortDescription: "Multivitamin and multimineral tablets with omega-3 from flaxseed oil, lycopene, botanical extracts, amino acids, vitamins, minerals and trace elements.",
          fullDescription:
            "Health Nutra 9G is a multivitamin, multimineral and antioxidant tablet formulation. The package lists omega-3 fatty acids from flaxseed oil, lycopene, L-carnitine L-tartrate, green tea and grape seed extracts, ginkgo biloba, ginseng, garlic and ginger extracts, green coffee bean, glycyrrhiza glabra, guggul, essential amino acids, cyanocobalamin, vitamins, minerals and trace elements. The packaging presents it for energy and stamina, immunity, brain and heart health, antioxidant support and overall wellness. Follow the directions on the pack.",
          price: 235,
          mrp: 235,
          unit: "Strip",
          image: "/uploads/9g.png",
          status: "active",
        },
        {
          name: "Health Nutra Q10+ Syrup",
          category: "Syrup",
          shortDescription: "200 ml sugar-free mango-flavoured multivitamin and multimineral syrup with lycopene and amino acids.",
          fullDescription:
            "Health Nutra Q10+ is a 200 ml sugar-free mango-flavoured multivitamin and multimineral syrup. The package lists Coenzyme Q10, L-lysine and cyanocobalamin with lycopene and amino acids. The packaging presents it for energy, growth, immunity, brain function and overall wellness. Shake well and follow the directions on the pack.",
          price: 210,
          mrp: 210,
          unit: "200ml",
          image: "/uploads/10q.png",
          status: "active",
        },
        {
          name: "Health Nutra Liv+ Syrup",
          category: "Liver Care",
          shortDescription: "200 ml sugar-free mixed-fruit liver, enzyme and appetizer syrup with natural herbs.",
          fullDescription:
            "Health Nutra Liv+ is a 200 ml sugar-free, mixed-fruit liver, enzyme and appetizer syrup. The packaging describes it as an advanced liver-care formula and presents it for supporting healthy liver function, appetite and digestion, enzyme activity, and general wellness. Enriched with natural herbs. Follow the directions on the pack.",
          price: 1,
          mrp: 1,
          unit: "200ml",
          image: "/images/livplus.jpeg",
          status: "hidden",
          pricePending: true,
        },
        {
          name: "Health Nutra NariA+ Syrup",
          category: "Women's Wellness",
          shortDescription: "200 ml sugar-free Ayurvedic women's wellness syrup with 1800 mg Ashoka root extract.",
          fullDescription:
            "Health Nutra NariA+ is a 200 ml sugar-free, mixed-fruit Ayurvedic wellness syrup featuring 1800 mg Ashoka root extract. The packaging presents it for women's wellness, hormonal balance, strength and energy, healthy menstruation, and overall wellbeing. Follow the directions on the pack.",
          price: 1,
          mrp: 1,
          unit: "200ml",
          image: "/images/naria-plus.jpeg",
          status: "hidden",
          pricePending: true,
        },
        {
          name: "Health Nutra Lipron+ Syrup",
          category: "Iron Supplement",
          shortDescription: "200 ml sugar-free mixed-fruit syrup with liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine.",
          fullDescription:
            "Health Nutra Lipron+ is a 200 ml sugar-free, mixed-fruit syrup containing liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine. The packaging highlights iron absorption using liposomal technology, red blood cell formation, fatigue and weakness, and overall wellbeing. Follow the directions on the pack.",
          price: 1,
          mrp: 1,
          unit: "200ml",
          image: "/images/lipron-plus.jpeg",
          status: "hidden",
          pricePending: true,
        },
      ];

      await Product.insertMany(starterProducts);
      console.log(`[Seed] Seeded ${starterProducts.length} starter products into database.`);
    }
  } catch (err) {
    console.error(`[Seed] Error seeding database: ${err.message}`);
  }
}

