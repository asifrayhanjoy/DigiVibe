import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

// Complete list of 31 SMM Growth Services with +5 BDT Markup Rule applied (Target Price = Base Price + 5 BDT)
export const SMM_GROWTH_SERVICES = [
  {
    id: "smm-telegram-member-group-200pcs",
    title: "Telegram Member Group / Chanel 👨‍👨‍👦‍👦 (200 Pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.8,
    reviews: 290,
    basePrice: 46,
    price: 51,
    originalPrice: 90,
    duration: "Lifetime Refill",
    unit: "200pcs",
    minQuantity: 200,
    maxQuantity: 20000,
    logoType: "telegram",
    icon: "Send",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Telegram Member Group / Chanel (Lifetime Refill / 200pcs) - Base ৳46.00 + Markup ৳5 = ৳51.00",
    overview: "[215] - Telegram - Members | High Quality | Instant Start | 100k/Day | Lifetime Refill♻️⚡️ [সতর্ক বার্তা⚠️] আপনার গ্রুপ বা চ্যনেল অবশ্যই পাবলিক থাকতে হবে 💯",
    features: [
      "200 Real Channel / Group Members",
      "Lifetime Refill Guarantee ♻️",
      "Min: 200 · Max: 20000",
      "Public Channel / Group Required 💯"
    ],
    popular: false
  },
  {
    id: "smm-tiktok-likes-views-1000pcs",
    title: "TikTok - Likes+Views ❤️👀 (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 310,
    basePrice: 60,
    price: 65,
    originalPrice: 110,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "tiktok",
    icon: "TrendingUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "TikTok - Likes+Views (30 Day Refill / 1000pcs) - Base ৳60.00 + Markup ৳5 = ৳65.00",
    overview: "TikTok Likes + Views Combo Pack | High Retention | Instant Start | 30 Days Auto Refill ♻️",
    features: [
      "1000 Likes + Views Combo Pack",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 50000",
      "Instant Auto Start Speed"
    ],
    popular: true
  },
  {
    id: "smm-tiktok-video-view-2000pcs",
    title: "TikTok Video View 👀 (365 Day Refill / 2000pcs)",
    category: "smm",
    subtitle: "365D Refill 🔘",
    badge: "365D Refill",
    tag: "365D Refill",
    rating: 4.8,
    reviews: 240,
    basePrice: 30,
    price: 35,
    originalPrice: 60,
    duration: "365 Days",
    unit: "2000pcs",
    minQuantity: 2000,
    maxQuantity: 500000,
    logoType: "tiktok",
    icon: "Eye",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Tiktok Video View (365 Day Refill / 2000pcs) - Base ৳30.00 + Markup ৳5 = ৳35.00",
    overview: "TikTok Video Views | Ultra High Speed 500k/Day | 365 Days Refill Button Active 🟢",
    features: [
      "2000 Fast Video Views 👀",
      "365 Days Auto Refill Guarantee ♻️",
      "Min: 2000 · Max: 500000",
      "Instant 500k/Day High Speed"
    ],
    popular: false
  },
  {
    id: "smm-fb-post-react",
    title: "Facebook Post React ❤️ [Video / Pic] (No Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill 🕝",
    tag: "No Refill 🕝",
    rating: 4.9,
    reviews: 240,
    basePrice: 26,
    price: 31,
    originalPrice: 50,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "facebook",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Post React [Video / Pic] (No Refill / 1000pcs) - Base ৳26.00 + Markup ৳5 = ৳31.00",
    overview: "[1205] - Facebook - Post Reaction ❤️ [Video / Pic] | Instant⚡ | High Quality | 100k/Day | No Refill 🕝",
    features: [
      "1000 Post / Video / Pic Reactions ❤️",
      "No Refill 🕝",
      "Min: 1000 · Max: 50000",
      "Instant 100k/Day High Speed Start"
    ],
    popular: true
  },
  {
    id: "smm-fb-video-reels-view",
    title: "Facebook Video / Reels View 👀 (Lifetime Refill / 2000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.8,
    reviews: 290,
    basePrice: 16,
    price: 21,
    originalPrice: 40,
    duration: "Lifetime Refill",
    unit: "2000pcs",
    minQuantity: 2000,
    maxQuantity: 100000,
    logoType: "facebook",
    icon: "ThumbsUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Video / Reals View (Lifetime Refill / 2000pcs) - Base ৳16.00 + Markup ৳5 = ৳21.00",
    overview: "[149] - Facebook - Video/Reels Views | Non Drop | 5M/Day | Instant | Lifetime Refill ♻️",
    features: [
      "2000 Video & Reels Views 👀",
      "Lifetime Refill Guarantee ♻️",
      "Min: 2000 · Max: 100000",
      "Instant 5M/Day Speed"
    ],
    popular: false
  },
  {
    id: "smm-fb-post-react-nondrop-1000pcs",
    title: "Facebook Post React Non Drop ❤️ [Video / Pic] (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.9,
    reviews: 380,
    basePrice: 60,
    price: 65,
    originalPrice: 100,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "facebook",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Post React Non Drop [Video / Pic] (Lifetime Refill / 1000pcs) - Base ৳60.00 + Markup ৳5 = ৳65.00",
    overview: "Facebook Non Drop Post Reactions [Video / Pic] | 100% Real Quality | Lifetime Refill Guarantee ♻️",
    features: [
      "1000 Non Drop Video / Pic Reactions ❤️",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 50000",
      "100% Non Drop Real Accounts"
    ],
    popular: true
  },
  {
    id: "smm-fb-follower-mix",
    title: "Facebook Follower 🌏 [Mix] Page / Profile 👨‍👨‍👦‍👦 (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.8,
    reviews: 360,
    basePrice: 40,
    price: 45,
    originalPrice: 80,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "facebook",
    icon: "ThumbsUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Follower [Mix] Page / Profile (Lifetime Refill / 1000pcs) - Base ৳40.00 + Markup ৳5 = ৳45.00",
    overview: "[1100] - Facebook - Profile/Page Follower | Mix Source | 50k/Day | Instant⚡ | Non Drop | Lifetime Refill ♻️",
    features: [
      "1000 Profile / Page Followers",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "Non Drop Stable Source"
    ],
    popular: false
  },
  {
    id: "smm-tiktok-video-like-norefill-1000pcs",
    title: "TikTok Video Like ❤️ (No Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.7,
    reviews: 220,
    basePrice: 43,
    price: 48,
    originalPrice: 80,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "tiktok",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Tiktok Video Like (No Refill / 1000pcs) - Base ৳43.00 + Markup ৳5 = ৳48.00",
    overview: "TikTok Video Likes | Instant Fast Delivery | High Speed 50k/Day | No Refill 🕝",
    features: [
      "1000 High Speed TikTok Likes ❤️",
      "No Refill 🕝",
      "Min: 1000 · Max: 50000",
      "Instant 50k/Day Speed"
    ],
    popular: false
  },
  {
    id: "smm-tiktok-follower-500pcs",
    title: "TikTok Follower 👥 (No Refill / 500pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.8,
    reviews: 340,
    basePrice: 145,
    price: 150,
    originalPrice: 220,
    duration: "No Refill",
    unit: "500pcs",
    minQuantity: 500,
    maxQuantity: 10000,
    logoType: "tiktok",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Tiktok Follower (No Refill / 500pcs) - Base ৳145.00 + Markup ৳5 = ৳150.00",
    overview: "TikTok Real Profile Followers | Fast Delivery | Min 500pcs | No Refill 🕝",
    features: [
      "500 Real TikTok Profile Followers 👥",
      "No Refill 🕝",
      "Min: 500 · Max: 10000",
      "Fast Delivery & Instant Growth"
    ],
    popular: true
  },
  {
    id: "smm-telegram-member-group-1000pcs",
    title: "Telegram Member Group / Chanel 👨‍👨‍👦‍👦 (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.9,
    reviews: 530,
    basePrice: 160,
    price: 165,
    originalPrice: 240,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 20000,
    logoType: "telegram",
    icon: "Send",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Telegram Member Group / Chanel (Lifetime Refill / 1000pcs) - Base ৳160.00 + Markup ৳5 = ৳165.00",
    overview: "[215] - Telegram - Members | High Quality | Instant Start | 100k/Day | Lifetime Refill♻️⚡️ [সতর্ক বার্তা⚠️] আপনার গ্রুপ বা চ্যনেল অবশ্যই পাবলিক থাকতে হবে 💯",
    features: [
      "1000 Real Channel / Group Members",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 20000",
      "Public Channel / Group Required 💯"
    ],
    popular: true
  },
  {
    id: "smm-fb-comments-1000pcs",
    title: "Facebook Comments 💬 [Video / Pic] (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 180,
    basePrice: 220,
    price: 225,
    originalPrice: 320,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "facebook",
    icon: "MessageSquare",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Comments [Video / Pic] (30 Day Refill / 1000pcs) - Base ৳220.00 + Markup ৳5 = ৳225.00",
    overview: "Facebook Comments [Video / Pic] | High Quality Accounts | 30 Days Auto Refill ♻️",
    features: [
      "1000 Facebook Post / Video Comments 💬",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "Custom Mix High Quality Profiles"
    ],
    popular: true
  },
  {
    id: "smm-telegram-post-reaction",
    title: "Telegram Post Reaction 🥰❤️+View Free (Non Refill / 5000pcs)",
    category: "smm",
    subtitle: "No Refill 🔘",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.7,
    reviews: 190,
    basePrice: 25,
    price: 30,
    originalPrice: 60,
    duration: "No Refill",
    unit: "5000pcs",
    minQuantity: 5000,
    maxQuantity: 20000,
    logoType: "telegram",
    icon: "Send",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Telegram Post Reaction +View Free (Non Refill / 5000pcs) - Base ৳25.00 + Markup ৳5 = ৳30.00",
    overview: "[921] - Telegram Reaction [❤️] + Views Free - ≈ ৳25 [সতর্ক বার্তা⚠] পুরাতন পোস্ট লিংক দিয়ে ওর্ডার করবেন না।",
    features: [
      "5000 Mixed Emoji Reactions",
      "Free Post Views Included",
      "Min: 5000 · Max: 20000",
      "Do not order with old post link"
    ],
    popular: false
  },
  {
    id: "smm-pinterest-follower-1000pcs",
    title: "Pinterest Follower 📌 (Non Drop 30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.8,
    reviews: 150,
    basePrice: 110,
    price: 115,
    originalPrice: 180,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "pinterest",
    icon: "Sparkles",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Pinterest Follower (Non Drop 30 Day Refill / 1000pcs) - Base ৳110.00 + Markup ৳5 = ৳115.00",
    overview: "Pinterest Non Drop Followers | 30 Days Auto Refill Button Active | High Quality Profile Growth",
    features: [
      "1000 Non Drop Pinterest Followers 📌",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "Safe & Steady Growth"
    ],
    popular: false
  },
  {
    id: "smm-kwai-likes-1000pcs",
    title: "Kwai Likes ❤️ (No Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.7,
    reviews: 130,
    basePrice: 35,
    price: 40,
    originalPrice: 70,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "kwai",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Kawai Likes (No Refill / 1000pcs) - Base ৳35.00 + Markup ৳5 = ৳40.00",
    overview: "Kwai Video Likes | Fast Delivery | Instant Start | No Refill 🕝",
    features: [
      "1000 Fast Kwai Video Likes ❤️",
      "No Refill 🕝",
      "Min: 1000 · Max: 50000",
      "Instant Auto Start Speed"
    ],
    popular: false
  },
  {
    id: "smm-twitter-like-1000pcs",
    title: "Twitter Like ❤️ [High Drop / No Refill] (1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.6,
    reviews: 210,
    basePrice: 25,
    price: 30,
    originalPrice: 60,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "twitter",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Twitter Like (High Drop / No Refill / 1000pcs) - Base ৳25.00 + Markup ৳5 = ৳30.00",
    overview: "Twitter / X Post Likes | High Drop Speed Source | Instant Start | No Refill 🕝",
    features: [
      "1000 Twitter / X Likes ❤️",
      "No Refill 🕝 (High Drop Warning)",
      "Min: 1000 · Max: 50000",
      "Instant High Speed Start"
    ],
    popular: false
  },
  {
    id: "smm-twitter-follower-1000pcs",
    title: "Twitter Follower 👥 (No Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.8,
    reviews: 310,
    basePrice: 150,
    price: 155,
    originalPrice: 230,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "twitter",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Twitter Follower (No Refill / 1000pcs) - Base ৳150.00 + Markup ৳5 = ৳155.00",
    overview: "Twitter / X Followers | High Quality Profile Growth | Instant Start | No Refill 🕝",
    features: [
      "1000 Twitter / X Followers 👥",
      "No Refill 🕝",
      "Min: 1000 · Max: 10000",
      "Instant Delivery & Growth"
    ],
    popular: true
  },
  {
    id: "smm-twitter-tweet-views-10000pcs",
    title: "Twitter Tweet Views 👀 (Non Drop / 10000pcs)",
    category: "smm",
    subtitle: "Non Drop 🔘",
    badge: "Non Drop",
    tag: "Non Drop",
    rating: 4.9,
    reviews: 270,
    basePrice: 20,
    price: 25,
    originalPrice: 50,
    duration: "Non Drop",
    unit: "10000pcs",
    minQuantity: 10000,
    maxQuantity: 1000000,
    logoType: "twitter",
    icon: "Eye",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Twitter Tweet views (Non Drop / 10000pcs) - Base ৳20.00 + Markup ৳5 = ৳25.00",
    overview: "Twitter / X Tweet Impression Views | 100% Non Drop | Ultra Fast 1M/Day Speed",
    features: [
      "10000 Non Drop Tweet Views 👀",
      "100% Non Drop Guarantee",
      "Min: 10000 · Max: 1000000",
      "Ultra High Speed 1M/Day"
    ],
    popular: true
  },
  {
    id: "smm-twitch-follower-1000pcs",
    title: "Twitch Follower 🟣 (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.8,
    reviews: 160,
    basePrice: 50,
    price: 55,
    originalPrice: 90,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 20000,
    logoType: "twitch",
    icon: "Radio",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Twitch Follower (30 Day Refill / 1000pcs) - Base ৳50.00 + Markup ৳5 = ৳55.00",
    overview: "Twitch Streamer Channel Followers | 30 Days Auto Refill ♻️ | High Quality Account Boost",
    features: [
      "1000 Twitch Channel Followers 🟣",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 20000",
      "Safe & Instant Delivery"
    ],
    popular: false
  },
  {
    id: "smm-whatsapp-post-reaction-love-1000pcs",
    title: "WhatsApp Post Reaction Love ❤️ (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 230,
    basePrice: 15,
    price: 20,
    originalPrice: 40,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 20000,
    logoType: "whatsapp",
    icon: "Heart",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "WhatsApp Post Reaction Love (30 Day Refill / 1000pcs) - Base ৳15.00 + Markup ৳5 = ৳20.00",
    overview: "WhatsApp Channel / Post Love Reactions ❤️ | 30 Days Auto Refill ♻️ | Instant Start",
    features: [
      "1000 WhatsApp Love Reactions ❤️",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 20000",
      "Instant Auto Start"
    ],
    popular: true
  },
  {
    id: "smm-whatsapp-channel-member-1000pcs",
    title: "WhatsApp Channel Member 💚 (Non Drop 30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 310,
    basePrice: 70,
    price: 75,
    originalPrice: 120,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "whatsapp",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "WhatsApp Channel Member (Non Drop 30 Day Refill / 1000pcs) - Base ৳70.00 + Markup ৳5 = ৳75.00",
    overview: "WhatsApp Channel Subscribers | Non Drop Source | 30 Days Auto Refill ♻️",
    features: [
      "1000 Non Drop Channel Members 💚",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "High Quality Real Members"
    ],
    popular: true
  },
  {
    id: "smm-spotify-followers-1000pcs",
    title: "Spotify Followers 🎧 (Non Drop 365 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "365D Refill 🔘",
    badge: "365D Refill",
    tag: "365D Refill",
    rating: 4.8,
    reviews: 200,
    basePrice: 50,
    price: 55,
    originalPrice: 95,
    duration: "365 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "spotify",
    icon: "Sparkles",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Spotify Followers (Non Drop 365 Day Refill / 1000pcs) - Base ৳50.00 + Markup ৳5 = ৳55.00",
    overview: "Spotify Artist / User Followers | 100% Non Drop | 365 Days Auto Refill ♻️",
    features: [
      "1000 Non Drop Artist Followers 🎧",
      "365 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 50000",
      "Safe & Organic Music Growth"
    ],
    popular: false
  },
  {
    id: "smm-tiktok-like-nondrop",
    title: "TikTok Like Video ❤️ [Non Drop] (1000pcs)",
    category: "smm",
    subtitle: "Non Drop 🔘",
    badge: "Non Drop",
    tag: "Non Drop",
    rating: 4.8,
    reviews: 280,
    basePrice: 60,
    price: 65,
    originalPrice: 110,
    duration: "Non Drop",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 100000,
    logoType: "tiktok",
    icon: "TrendingUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "TikTok Like Video [Non Drop] (Non Drop / 1000pcs) - Base ৳60.00 + Markup ৳5 = ৳65.00",
    overview: "[1637] TikTok Likes❤️ | [HQ REAL] | Instant | 10k/Hours Complete | Non Drop | [90 Day Refill Button Active]",
    features: [
      "1000 Non Drop Video Likes",
      "90 Day Refill Active",
      "Min: 1000 · Max: 100000",
      "Do not order with old video link"
    ],
    popular: false
  },
  {
    id: "smm-fb-group-member",
    title: "Facebook Group Member 👨‍👩‍👦‍👦 (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.9,
    reviews: 410,
    basePrice: 55,
    price: 60,
    originalPrice: 100,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "facebook",
    icon: "ThumbsUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Group Member (Lifetime Refill / 1000pcs) - Base ৳55.00 + Markup ৳5 = ৳60.00",
    overview: "[510] - Facebook - Group Members | Real Accounts | Cancel Enable⛔️ | Instant⚡ | 50K/Day | Lifetime Refill ♻️",
    features: [
      "1000 Real Group Members",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 50000",
      "Cancel Enable Supported"
    ],
    popular: true
  },
  {
    id: "smm-instagram-followers-indian-1000pcs",
    title: "Instagram Followers 🇮🇳 [Indian Mix] (No Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.8,
    reviews: 290,
    basePrice: 150,
    price: 155,
    originalPrice: 230,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 20000,
    logoType: "instagram",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Instagram Followers [Indian Mix] (No Refill / 1000pcs) - Base ৳150.00 + Markup ৳5 = ৳155.00",
    overview: "Instagram Followers [Indian Mix] | High Quality Accounts | Instant Start | No Refill 🕝",
    features: [
      "1000 Indian Mix Instagram Followers 🇮🇳",
      "No Refill 🕝",
      "Min: 1000 · Max: 20000",
      "Targeted Regional Quality Profiles"
    ],
    popular: true
  },
  {
    id: "smm-instagram-video-view-20000pcs",
    title: "Instagram Video View 👀 (No Refill / 20000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.9,
    reviews: 330,
    basePrice: 15,
    price: 20,
    originalPrice: 40,
    duration: "No Refill",
    unit: "20000pcs",
    minQuantity: 20000,
    maxQuantity: 1000000,
    logoType: "instagram",
    icon: "Eye",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Instagram Video View (No Refill / 20000pcs) - Base ৳15.00 + Markup ৳5 = ৳20.00",
    overview: "Instagram Video & Reels Views | High Speed 1M/Day | Instant Start | No Refill 🕝",
    features: [
      "20000 Video & Reels Views 👀",
      "No Refill 🕝",
      "Min: 20000 · Max: 1000000",
      "Ultra Fast 1M/Day Speed"
    ],
    popular: true
  },
  {
    id: "smm-telegram-post-view-1000pcs",
    title: "Telegram Post View 👀 (Non Refill / 1000pcs)",
    category: "smm",
    subtitle: "No Refill 🕝",
    badge: "No Refill",
    tag: "No Refill",
    rating: 4.7,
    reviews: 210,
    basePrice: 15,
    price: 20,
    originalPrice: 40,
    duration: "No Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 100000,
    logoType: "telegram",
    icon: "Eye",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Telegram Post View (Non Refill / 1000pcs) - Base ৳15.00 + Markup ৳5 = ৳20.00",
    overview: "Telegram Channel Post Views | Instant Speed | No Refill 🕝",
    features: [
      "1000 Telegram Post Views 👀",
      "No Refill 🕝",
      "Min: 1000 · Max: 100000",
      "Instant Auto Start"
    ],
    popular: false
  },
  {
    id: "smm-yt-view-1y",
    title: "Youtube Video View 👀 (1 Year Refill / 1000pcs)",
    category: "smm",
    subtitle: "365D Refill 🔘",
    badge: "365D Refill",
    tag: "365D Refill",
    rating: 4.9,
    reviews: 320,
    basePrice: 90,
    price: 95,
    originalPrice: 150,
    duration: "365 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "youtube",
    icon: "PlayCircle",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Youtube Video View (1 Year Refill / 1000pcs) - Base ৳90.00 + Markup ৳5 = ৳95.00",
    overview: "[511] - YouTube - Views | Source: Mix | Instant⚡️ | 500/Day | Refill Button Active🟢 | 365D Refill ♻️",
    features: [
      "1000 High Quality Views",
      "365D Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "Do not order with old video link"
    ],
    popular: true
  },
  {
    id: "smm-youtube-video-like-1000pcs",
    title: "Youtube Video Like 👍 (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 350,
    basePrice: 120,
    price: 125,
    originalPrice: 190,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 20000,
    logoType: "youtube",
    icon: "ThumbsUp",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Youtube Video Like (30 Day Refill / 1000pcs) - Base ৳120.00 + Markup ৳5 = ৳125.00",
    overview: "YouTube Video Likes | High Quality Non Drop | 30 Days Auto Refill ♻️",
    features: [
      "1000 High Quality YouTube Likes 👍",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 20000",
      "Instant Start Non Drop"
    ],
    popular: true
  },
  {
    id: "smm-instagram-video-like",
    title: "Instagram Video Like ❤️🩹 (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.9,
    reviews: 440,
    basePrice: 15,
    price: 20,
    originalPrice: 40,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 50000,
    logoType: "instagram",
    icon: "Sparkles",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Instagram Video Like (Lifetime Refill / 1000pcs) - Base ৳15.00 + Markup ৳5 = ৳20.00",
    overview: "[1140] - Instagram - Likes | Instant | High Quality | 100k/Day | Lifetime Refill ♻️",
    features: [
      "1000 Real Video Likes",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 50000",
      "High Quality 100k/Day"
    ],
    popular: true
  },
  {
    id: "smm-instagram-follower-1000pcs",
    title: "Instagram Follower 👥 (Lifetime Refill / 1000pcs)",
    category: "smm",
    subtitle: "Lifetime Refill 🔘",
    badge: "Lifetime Refill",
    tag: "Lifetime Refill",
    rating: 4.9,
    reviews: 610,
    basePrice: 200,
    price: 205,
    originalPrice: 280,
    duration: "Lifetime Refill",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "instagram",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Instagram Follower (Lifetime Refill / 1000pcs) - Base ৳200.00 + Markup ৳5 = ৳205.00",
    overview: "[438] - Instagram - Followers | High Quality🌟 | Low Drop | 50k/Day | Instant⚡ | Lifetime Refill ♻️",
    features: [
      "1000 High Quality Followers",
      "Lifetime Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "Instant 50k/Day Speed"
    ],
    popular: true
  },
  {
    id: "service-1790852663760-oac6w",
    title: "Facebook Follower 🇧🇩 [BD] Page / Profile 👨‍👨‍👦‍👦 (30 Day Refill / 1000pcs)",
    category: "smm",
    subtitle: "30 Days Refill 🔘",
    badge: "30 Days Refill",
    tag: "30 Days Refill",
    rating: 4.9,
    reviews: 100,
    basePrice: 110,
    price: 115,
    originalPrice: 150,
    duration: "30 Days",
    unit: "1000pcs",
    minQuantity: 1000,
    maxQuantity: 10000,
    logoType: "facebook",
    icon: "Users",
    delivery: "Instant Auto Start",
    stock: "In Stock",
    inStock: true,
    description: "Facebook Follower [BD] Page / Profile (30 Day Refill / 1000pcs) - Base ৳110.00 + Markup ৳5 = ৳115.00",
    overview: "[1027] - Facebook - 𝐏𝐫𝐨𝐟𝐢𝐥𝐞/𝐏𝐚𝐠𝐞 Bangladeshi🇧🇩Follower | [Max 10k] Real Quality | 3k/Day | Non Drop | 30D Refill♻️",
    features: [
      "1000 Bangladeshi Real Profile / Page Followers 🇧🇩",
      "30 Days Auto Refill Guarantee ♻️",
      "Min: 1000 · Max: 10000",
      "High Quality Target BD Source"
    ],
    popular: true
  }
];

async function syncSmmGrowthDb() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI!);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed.');
    }
    const collection = db.collection('products');

    console.log(`📦 Loaded ${SMM_GROWTH_SERVICES.length} SMM Growth services to sync.`);

    const bulkOps: any[] = [];

    for (const item of SMM_GROWTH_SERVICES) {
      const isAvailable = item.inStock !== false && item.stock !== 'Out of Stock';
      const finalStock = item.stock || (isAvailable ? 'In Stock' : 'Out of Stock');
      const finalPrice = Number(item.price);
      const originalPrice = item.originalPrice ? Number(item.originalPrice) : Math.round(finalPrice * 1.3);

      const updatePayload = {
        productId: item.id,
        title: item.title.trim(),
        category: 'smm',
        subtitle: item.subtitle,
        badge: item.badge,
        tag: item.tag,
        price: finalPrice,
        originalPrice: originalPrice,
        duration: item.duration,
        rating: item.rating,
        reviews: item.reviews,
        unit: item.unit,
        minQuantity: item.minQuantity,
        maxQuantity: item.maxQuantity,
        logoType: item.logoType,
        icon: item.icon,
        delivery: item.delivery,
        stock: finalStock,
        inStock: isAvailable,
        description: item.description,
        overview: item.overview,
        features: item.features,
        popular: item.popular,
      };

      bulkOps.push({
        updateOne: {
          filter: { productId: item.id },
          update: {
            $set: updatePayload,
            $setOnInsert: { createdAt: new Date() }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      console.log(`⚡ Executing bulkWrite for ${bulkOps.length} SMM Growth services...`);
      const result = await collection.bulkWrite(bulkOps);
      console.log('✅ bulkWrite completed.');
      console.log(`   - Matched documents: ${result.matchedCount}`);
      console.log(`   - Modified/Updated documents: ${result.modifiedCount}`);
      console.log(`   - Upserted/Inserted documents: ${result.upsertedCount}`);
    }

    // Verify SMM items in MongoDB Atlas
    const totalSmmInDb = await collection.countDocuments({
      category: { $in: ['smm', 'SMM', 'SMM Growth'] }
    });

    const dbItems = await collection.find({
      category: { $in: ['smm', 'SMM', 'SMM Growth'] }
    }).toArray();

    console.log('\n==================================================');
    console.log('🎉 SMM GROWTH SERVICES DATABASE SYNC SUCCESSFUL!');
    console.log('==================================================');
    console.log(`Total SMM Growth services in MongoDB Atlas: ${totalSmmInDb}`);
    console.log('\nAll SMM Growth Services in MongoDB:');
    dbItems.forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.productId}] ${p.title} | Price: ৳${p.price}`);
    });
    console.log('==================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during SMM Growth DB sync:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  syncSmmGrowthDb();
}
