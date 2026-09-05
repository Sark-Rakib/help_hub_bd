import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import Provider from "../src/models/Provider";
import Category from "../src/models/Category";
import ServiceRequest from "../src/models/ServiceRequest";
import Review from "../src/models/Review";

function resolveMongoUri(): string {
  const uri =
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/help-hub-bd";
  try {
    const parsed = new URL(uri);
    if (parsed.pathname.replace(/^\/+|\/+$/g, "")) return uri;
    const query = parsed.search || "";
    const base = query ? uri.slice(0, uri.indexOf("?")) : uri;
    return `${base.replace(/\/+$/, "")}/help-hub-bd${query}`;
  } catch {
    return uri;
  }
}

const MONGODB_URI = resolveMongoUri();

const CATEGORIES = [
  { slug: "electrician", name: "Electrician", nameBn: "", popular: true, description: "Wiring, short circuit, board fixing", order: 1 },
  { slug: "plumber", name: "Plumber", nameBn: "", popular: true, description: "Pipe, leaking tap, washroom fittings", order: 2 },
  { slug: "ac-fridge-technician", name: "AC/Fridge Technician", nameBn: "", popular: true, description: "AC gas, fridge repair, deep cleaning", order: 3 },
  { slug: "computer-laptop", name: "Computer/Laptop Repair", nameBn: "", popular: true, description: "Hardware, OS, virus removal", order: 4 },
  { slug: "mobile-repair", name: "Mobile Repair", nameBn: "", popular: true, description: "Screen, battery, charging port", order: 5 },
  { slug: "car-bike-mechanic", name: "Car/Bike Mechanic", nameBn: "", popular: false, description: "Servicing, repair, puncture", order: 6 },
  { slug: "tutor", name: "Tutor", nameBn: "", popular: true, description: "Home tutor — HSC, SSC, primary", order: 7 },
  { slug: "painter", name: "Painter", nameBn: "", popular: false, description: "House painting, waterproofing", order: 8 },
  { slug: "cleaning-service", name: "Cleaning Service", nameBn: "", popular: false, description: "Home, office, move-out cleaning", order: 9 },
  { slug: "photographer", name: "Photographer", nameBn: "", popular: true, description: "Wedding, event, product photo", order: 10 },
  { slug: "veterinary", name: "Veterinary Doctor", nameBn: "", popular: false, description: "Cow, goat, pet treatment", order: 11 },
  { slug: "home-appliance-repair", name: "Home Appliance Repair", nameBn: "", popular: false, description: "Oven, geyser, washing machine", order: 12 },
];

const AREAS = [
  "Sherpur Sadar",
  "Nakla",
  "Nalitabari",
  "Sreebardi",
  "Jhinaigati",
  "Baksiganj",
];

const NAMES = [
  "Rashed Mechanics",
  "Alam Electric House",
  "Shiplu AC & Fridge",
  "Bipul Mobile Repair",
  "Jack Computer Store",
  "Karim Plumbing Works",
  "Tania Tutorial",
  "Hasan Painters",
  "Nijhum Photography",
  "Tofazzel Vet Care",
  "Simu Cleaning Service",
  "Rafiq Bike Point",
];

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug).reverse();

type SeedProvider = {
  businessName: string;
  category: string;
  area: string;
  experience: number;
  price: number;
  services: Array<{
    name: string;
    price: number;
    priceType: "fixed" | "hourly" | "negotiable";
  }>;
};

function seededProviders(): SeedProvider[] {
  return NAMES.map((businessName, i) => {
    const category = CATEGORY_SLUGS[i % CATEGORY_SLUGS.length];
    const area = AREAS[i % AREAS.length];
    const numbers = ["100", "150", "200", "250", "300", "350", "400", "500"];
    return {
      businessName,
      category,
      area,
      experience: (i % 10) + 2,
      price: Number(numbers[i % numbers.length]),
      services: [
        {
          name: "Basic service",
          price: Number(numbers[i % numbers.length]),
          priceType: "fixed",
        },
        {
          name: "Standard service",
          price: Number(numbers[i % numbers.length]) + 250,
          priceType: "fixed",
        },
        {
          name: "Premium service",
          price: Number(numbers[i % numbers.length]) + 500,
          priceType: "negotiable",
        },
      ],
    };
  });
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await User.countDocuments();
  if (existing > 0) {
    console.log("Data already exists. Skipping seed. (Delete DB to re-seed)");
    await mongoose.disconnect();
    return;
  }

  // Users
  const password = await bcrypt.hash("password", 10);
  const [adminUser, providerUser, customer] = await User.create([
    {
      name: "Admin",
      phone: "01700000001",
      password,
      role: "admin",
      phoneVerified: true,
    },
    {
      name: "Rashed Chowdhury",
      phone: "01700000002",
      password,
      role: "provider",
      phoneVerified: true,
    },
    {
      name: "Khadiza Akter",
      phone: "01700000003",
      password,
      role: "user",
      phoneVerified: true,
    },
  ]);
  console.log(`Created users: admin(${adminUser._id}) provider(${providerUser._id}) customer(${customer._id})`);

  // Categories
  await Category.create(CATEGORIES);
  console.log(`Created ${CATEGORIES.length} categories`);

  // Providers
  const suppliers = [];
  for (const [i, p] of seededProviders().entries()) {
    const userObj = i === 0 ? providerUser : await User.create({
      name: p.businessName,
      phone: `0171${String(1000000 + i * 137).padStart(7, "0")}`,
      password,
      role: "provider",
      phoneVerified: true,
    });
    const rating = Number((4 + (i % 5) / 5).toFixed(1));
    const provider = await Provider.create({
      user: userObj?._id ?? providerUser._id,
      businessName: p.businessName,
      slug: `provider-${i + 1}`,
      category: p.category,
      description: `${p.businessName} — Sherpur e ${p.category} service. ${p.experience} years experience, assured quality.`,
      about: `${p.businessName} — a highly experienced team in ${p.category}. Call us anytime for reliable service at fair prices.`,
      services: p.services,
      experience: p.experience,
      location: { district: "Sherpur", area: p.area },
      phone: userObj.phone,
      whatsapp: userObj.phone,
      workingHours: [
        { day: "Sat-Thu", open: "9:00 AM", close: "7:00 PM" },
        { day: "Friday", open: "3:00 PM", close: "7:00 PM" },
      ],
      verified: i % 3 !== 0,
      featured: [0, 4].includes(i),
      rating,
      reviewCount: 0,
      startingPrice: p.price,
      availability: i % 2 === 0 ? "available" : "busy",
      applicationStatus: "approved",
      blocked: false,
    });
    suppliers.push(provider);
    console.log(`  + Provider: ${p.businessName} (${p.category})`);
  }

  // Reviews
  const sampleReviews: Array<[number, string]> = [
    [5, "The job was done perfectly and even finished ahead of schedule."],
    [4, "Good work, though a bit slow. The quality was consistent."],
    [5, "Calm and professional, arrived right on time. Will use again."],
    [3, "The work was fine but one item cost more than expected."],
    [5, "Highly recommend to everyone!"],
  ];
  const reviewDocs = [];
  for (const [i, provider] of suppliers.entries()) {
    const reviewCount = i % 3;
    for (let r = 0; r < reviewCount; r++) {
      const sample = sampleReviews[r % sampleReviews.length];
      const request = await ServiceRequest.create({
        user: customer._id,
        provider: provider._id,
        service: `${provider.category} service`,
        description:
          "Sample completed service request seeded for review purposes on HelpHub BD.",
        location: { district: "Sherpur", area: AREAS[i % AREAS.length] },
        preferredDate: "2026-01-01",
        preferredTime: "Morning (9am - 12pm)",
        phone: customer.phone,
        status: "accepted",
        emergency: false,
      });
      reviewDocs.push({
        user: customer._id,
        provider: provider._id,
        serviceRequest: request._id,
        rating: sample[0],
        text: sample[1],
      });
    }
  }
  if (reviewDocs.length) {
    await Review.create(reviewDocs);

    const perProvider = new Map<string, { count: number; sum: number }>();
    for (const r of reviewDocs) {
      const key = r.provider.toString();
      const cur = perProvider.get(key) ?? { count: 0, sum: 0 };
      perProvider.set(key, { count: cur.count + 1, sum: cur.sum + r.rating });
    }
    const bulkOps = [];
    for (const [providerId, meta] of perProvider) {
      bulkOps.push({
        updateOne: {
          filter: { _id: providerId },
          update: {
            $inc: { reviewCount: meta.count },
            $set: { rating: Number((meta.sum / meta.count).toFixed(1)) },
          },
        },
      });
    }
    await Provider.bulkWrite(bulkOps);
    console.log(`Created ${reviewDocs.length} reviews`);
  }

  // A sample service request (pending)
  await ServiceRequest.create({
    user: customer._id,
    provider: suppliers[0]._id,
    service: "Emergency — Short circuit repair",
    description:
      "The kitchen switchboard was getting hot and sparks were coming from the switch. Please fix it tomorrow.",
    location: { district: "Sherpur", area: "Sherpur Sadar" },
    preferredDate: "2026-09-06",
    preferredTime: "Morning (9am - 12pm)",
    phone: "01700000003",
    status: "pending",
    emergency: true,
  });
  console.log("Created 1 sample service request");

  console.log("\nSeed complete!");
  console.log("Login preview:");
  console.log("  Admin    → 01700000001 / password");
  console.log("  Provider → 01700000002 / password");
  console.log("  Customer → 01700000003 / password");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});