import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Droplets,
  Snowflake,
  Laptop,
  Smartphone,
  Wrench,
  GraduationCap,
  Paintbrush,
  Sparkles,
  Camera,
  PawPrint,
  Refrigerator,
  Home,
  Phone,
  AlarmClock,
  Code,
} from "lucide-react";
import type { Category, Location, RequestStatus } from "@/types";

export const APP_NAME = "HelpHub BD";
export const APP_TAGLINE = "Find the service you need in Sherpur";
export const APP_DESCRIPTION =
  "Electrician, plumber, technician, mechanic, tutor and many more trusted service providers, all in one place.";

export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE || "01800-000000";
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@helphubbd.com";

export const CURRENCY = "৳";

export function formatBDT(amount: number): string {
  return `${CURRENCY}${amount.toLocaleString("en-US")}`;
}

export function formatBDTShort(amount: number): string {
  if (amount >= 1000)
    return `${CURRENCY}${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return `${CURRENCY}${amount}`;
}

const categoryMeta: Array<Omit<Category, "icon"> & { icon: LucideIcon }> = [
  {
    slug: "electrician",
    name: "Electrician",
    nameBn: "",
    description:
      "House wiring, switches, lights and any electrical problem solved.",
    icon: Zap,
    popular: true,
  },
  {
    slug: "plumber",
    name: "Plumber",
    nameBn: "",
    description:
      "Pipes, tanks, bathroom fittings, gas lines and water problems.",
    icon: Droplets,
    popular: true,
  },
  {
    slug: "ac-fridge-technician",
    name: "AC & Fridge Technician",
    nameBn: "",
    description: "AC gas charging, repair, servicing and refrigerator repair.",
    icon: Snowflake,
    popular: true,
  },
  {
    slug: "computer-laptop",
    name: "Computer & Laptop",
    nameBn: "",
    description:
      "Laptop formatting, computer repair, SSD upgrades and software installation.",
    icon: Laptop,
    popular: true,
  },
  {
    slug: "mobile-repair",
    name: "Mobile Repair",
    nameBn: "",
    description:
      "Mobile display, battery, charging port repair and software issues.",
    icon: Smartphone,
    popular: true,
  },
  {
    slug: "car-bike-mechanic",
    name: "Car & Bike Mechanic",
    nameBn: "",
    description:
      "Car servicing, bike repair, engine tuning, brakes and much more.",
    icon: Wrench,
    popular: true,
  },
  {
    slug: "tutor",
    name: "Tutor",
    nameBn: "",
    description:
      "Home tutor for school, college, university and skill development.",
    icon: GraduationCap,
    popular: true,
  },
  {
    slug: "painter",
    name: "Painter",
    nameBn: "",
    description:
      "House painting, wall colours, designs and waterproofing services.",
    icon: Paintbrush,
    popular: true,
  },
  {
    slug: "cleaning-service",
    name: "Cleaning Service",
    nameBn: "",
    description: "Complete cleaning for your home, office or shop.",
    icon: Sparkles,
    popular: true,
  },
  {
    slug: "photographer",
    name: "Photographer",
    nameBn: "",
    description:
      "Wedding photography, events, studio shoots and video coverage.",
    icon: Camera,
    popular: true,
  },
  {
    slug: "veterinary",
    name: "Veterinary",
    nameBn: "",
    description:
      "Cows, goats, dogs, cats — pet and livestock treatment and vaccines.",
    icon: PawPrint,
    popular: true,
  },
  {
    slug: "home-appliance-repair",
    name: "Home Appliance Repair",
    nameBn: "",
    description:
      "Fridge, oven, washing machine, microwave — all appliance repairs.",
    icon: Refrigerator,
    popular: true,
  },
  {
    slug: "web-development",
    name: "Web Development",
    nameBn: "",
    description: "Website design, development, maintenance and IT support.",
    icon: Code,
    popular: true,
  },
];

export const CATEGORIES: Category[] = categoryMeta.map((category) => {
  const { icon, ...rest } = category;
  void icon;
  return rest;
});

export const CATEGORY_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  categoryMeta.map(({ slug, icon }) => [slug, icon]),
);

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug.replace(/-/g, " ");
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Wrench;
}

// -----------------------------------------------------------
// Locations — designed so more districts can be added easily
// -----------------------------------------------------------
export const DISTRICTS: Array<{ name: string; slug: string; areas: string[] }> =
  [
    {
      name: "Sherpur",
      slug: "sherpur",
      areas: [
        "Sherpur Sadar",
        "Rajarpur",
        "Sherpur City Bus Stand",
        "Dhunot Mor",
        "Naymile",
        "Mirzapur",
        "Garidha",
        "Sughat",
        "Bishalpur",
        "Bhabanipur",
        "Khanpur",
        "Kusumba",
        "Shahbandegi",
        "Khamarkandi",
        "Seemabari",
        "Arkandi",
        "Fulbari",
        "Mohipur",
        "Bagara",
        "Jamur",
        "Hapunia",
        "Chonka",
        "Ranirhat",
        "Shalpa",
        "Kalshimati",
        "Chakpathalia",
        "Modonpur",
        "Mirzapur Bazar",
        "Garidha Bazar",
        "Chonka Bazar",
        "Ranirhat Bazar",
        "Shalpa Bazar",
        "Dhunot Mor Bazar",
      ],
    },
    {
      name: "Bogura",
      slug: "bogura",
      areas: [
        "Bogura Sadar",
        "Shibganj",
        "Gabtali",
        "Dupchanchia",
        "Adamdighi",
      ],
    },
    {
      name: "Dhaka",
      slug: "dhaka",
      areas: ["Mirpur", "Uttara", "Dhanmondi", "Gulshan", "Motijheel"],
    },
    {
      name: "Rajshahi",
      slug: "rajshahi",
      areas: ["Rajshahi Sadar", "Boalia", "Paba", "Godagari"],
    },
    {
      name: "Sirajganj",
      slug: "sirajganj",
      areas: ["Sirajganj Sadar", "Shahjadpur", "Ullapara", "Kamarkhanda"],
    },
  ];

export const SHERPUR_LOCATIONS: Location[] = DISTRICTS[0].areas.map((area) => ({
  district: "Sherpur",
  area,
}));

export const DEFAULT_LOCATION: Location = {
  district: "Sherpur",
  area: "Sherpur Sadar",
};

export function getAllAreas(district: string): string[] {
  return DISTRICTS.find((d) => d.name === district)?.areas ?? [];
}

// -----------------------------------------------------------
// Bilingual area names — Bangla for Sherpur town, road stalls & bazars
// Key = English storage name, value = Bangla display name.
// -----------------------------------------------------------
export const AREA_NAMES_BN: Record<string, string> = {
  "Sherpur Sadar": "শেরপুর সদর",
  Nakla: "নকলা",
  Nalitabari: "নালিতাবাড়ী",
  Sreebardi: "শ্রীবরদী",
  Jhenaigati: "ঝিনাইগাতী",
  Kaligonj: "কালীগঞ্জ",
  Rajarpur: "রাজারপুর",
  "Sherpur City Bus Stand": "শহরশেরপুর বাসস্ট্যান্ড",
  "Dhunot Mor": "ধুনট মোড়",
  Naymile: "নয়মাইল",
  Mirzapur: "মির্জাপুর",
  Garidha: "গাড়িদহ",
  Sughat: "সুঘাট",
  Bishalpur: "বিশালপুর",
  Bhabanipur: "ভবানীপুর",
  Khanpur: "খানপুর",
  Kusumba: "কুসুম্বী",
  Shahbandegi: "শাহবন্দেগী",
  Khamarkandi: "খামারকান্দি",
  Seemabari: "সীমাবাড়ী",
  Arkandi: "আরকান্দি",
  Fulbari: "ফুলবাড়ী",
  Mohipur: "মহিপুর",
  Bagara: "বাগড়া",
  Jamur: "জামুর",
  Hapunia: "হাপুনিয়া",
  Chonka: "ছোনকা",
  Ranirhat: "রানীরহাট",
  Shalpa: "শালফা",
  Boalia: "বোয়ালিয়া",
  Kalshimati: "কালশিমাটি",
  Chakpathalia: "চকপাথালিয়া",
  Modonpur: "মদনপুর",
  "Mirzapur Bazar": "মির্জাপুর বাজার",
  "Garidha Bazar": "গাড়িদহ বাজার",
  "Chonka Bazar": "ছোনকা বাজার",
  "Ranirhat Bazar": "রানীরহাট বাজার",
  "Shalpa Bazar": "শালফা বাজার",
  "Dhunot Mor Bazar": "ধুনট মোড় বাজার",
};

/** "Dhunot Mor" → "ধুনট মোড় (Dhunot Mor)" — keeps the stored English key visible too. */
export function prettyArea(
  area: string,
  opts: { showEnglish?: boolean } = {},
): string {
  const bn = AREA_NAMES_BN[area];
  const showEn = opts.showEnglish ?? true;
  if (!bn) return area;
  return showEn ? `${bn} (${area})` : bn;
}

// -----------------------------------------------------------
// Service requests
// -----------------------------------------------------------
export const REQUEST_STATUSES: Array<{
  value: RequestStatus;
  label: string;
  labelBn: string;
  color: string;
}> = [
  {
    value: "pending",
    label: "Pending",
    labelBn: "",
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "accepted",
    label: "Accepted",
    labelBn: "",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "rejected",
    label: "Rejected",
    labelBn: "",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "completed",
    label: "Completed",
    labelBn: "",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    labelBn: "",
    color: "bg-gray-200 text-gray-600",
  },
];

export function getRequestStatusMeta(status: RequestStatus) {
  return (
    REQUEST_STATUSES.find((s) => s.value === status) ?? REQUEST_STATUSES[0]
  );
}

// -----------------------------------------------------------
// Sort + filter options
// -----------------------------------------------------------
export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "price", label: "Lowest Price" },
  { value: "nearest", label: "Nearest" },
] as const;

export const PRICE_RANGES = [
  { id: "under-500", label: "Under ৳500", min: 0, max: 500 },
  { id: "500-1000", label: "৳500 – ৳1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "৳1,000 – ৳2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "৳2,000 – ৳5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above ৳5,000", min: 5000, max: null },
] as const;

export const EMERGENCY_CATEGORIES = [
  {
    slug: "electrician",
    name: "Electrician",
    icon: "⚡",
    description: "Short circuit, wiring, board fixing",
    availableNow: true,
  },
  {
    slug: "plumber",
    name: "Plumber",
    icon: "🚰",
    description: "Pipe burst, leaking tap, washroom",
    availableNow: true,
  },
  {
    slug: "car-bike-mechanic",
    name: "Car/Bike Mechanic",
    icon: "🔧",
    description: "Roadside break down, puncture",
    availableNow: false,
  },
  {
    slug: "ac-fridge-technician",
    name: "AC/Fridge Technician",
    icon: "❄️",
    description: "AC short, fridge not cooling",
    availableNow: true,
  },
  {
    slug: "home-appliance-repair",
    name: "Home Appliance Repair",
    icon: "🏠",
    description: "Oven, geyser, washing machine",
    availableNow: false,
  },
];

export const FAQ_ITEMS = [
  {
    question: "How do I send a service request?",
    answer:
      "Search for a service on the homepage, open a provider profile, click 'Send Service Request', fill out the short form and submit. It takes 10-20 seconds!",
  },
  {
    question: "How are providers verified?",
    answer:
      "When a provider joins, our admin team manually reviews every profile. After checking the national ID, business address and phone number, the provider receives a verified badge.",
  },
  {
    question: "Do I need an account to send a request?",
    answer:
      "No account is needed to browse providers. You only register once when sending a service request. It takes a second — just name, phone and password.",
  },
  {
    question: "How does a provider join?",
    answer:
      "Register from the 'Become a Provider' page with your business name, service, area and phone. Once our team verifies you, your profile will be shown to customers.",
  },
  {
    question: "How do I leave a review?",
    answer:
      "After your service request is complete, you can rate and review the provider from their profile. One completed request is all you need.",
  },
  {
    question: "How does the emergency service work?",
    answer:
      "If you have an urgent problem (such as a power outage or pipe leak), send a request using the emergency option. Available providers respond as fast as they can. Keep in mind — if no provider is available, it may take a little longer.",
  },
];

export const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  if (digits.startsWith("01")) {
    return `+88 ${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const WORK_HOURS_DEFAULT = [
  { day: "Saturday", open: "09:00", close: "21:00" },
  { day: "Sunday", open: "09:00", close: "21:00" },
  { day: "Monday", open: "09:00", close: "21:00" },
  { day: "Tuesday", open: "09:00", close: "21:00" },
  { day: "Wednesday", open: "09:00", close: "21:00" },
  { day: "Thursday", open: "09:00", close: "21:00" },
  { day: "Friday", open: "10:00", close: "18:00" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Find Providers", href: "/providers" },
  { label: "Become a Provider", href: "/become-provider" },
];

export { Phone, AlarmClock, Home as HomeIcon };
