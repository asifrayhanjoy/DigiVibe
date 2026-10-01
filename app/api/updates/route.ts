import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Update from "@/lib/models/Update";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PROMO_OFFER_SEED = {
  title: "মাত্র ১৫০ টাকায় ১৮ মাসের Gemini Pro / Google AI Pro Subscription! 🚀",
  description: `🎉 স্পেশাল মেগা অফার! ১৮ মাসের Gemini Pro / Google AI Pro এর সাথে পাচ্ছেন ৫TB ক্লাউড স্টোরেজ এবং বোনাস হিসেবে সেরা সব প্রিমিয়াম সাবস্ক্রিপশন সম্পূর্ণ ফ্রিতে!

📌 অর্ডারের নিয়ম ও প্রয়োজনীয় তথ্য:
• Single Invite (১৫০ টাকা): নিজের জিমেইল ব্যবহার, একবার পেমেন্ট ১৮ মাস ব্যবহার, ব্যক্তিগত ব্যবহারের জন্য সেরা, এবং সাথে ৫TB Storage সুবিধা।
• Personal+ Full Owner (২৫০ টাকা): সম্পূর্ণ ফ্যামিলি ম্যানেজার অ্যাকাউন্ট আপনার নিজের নিয়ন্ত্রণে, সর্বোচ্চ ৫ জনকে ইনভাইট করার সুবিধা, রিসেল বা টিম ব্যবহারের জন্য উপযুক্ত।

🚀 অর্ডারের জন্য প্রয়োজনীয় তথ্য: Single Invite-এর জন্য শুধু জিমেইল এবং Full Owner-এর জন্য জিমেইল, নাম ও নাম্বার প্রয়োজন।
⚡ ডেলিভারি সময়: ৫-২০ মিনিটের মধ্যে ইনস্ট্যান্ট সেটআপ ও ১৮ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি!`,
  category: "Promotional Offer",
  badgeText: "🔥 SPECIAL DEAL - 18 MONTHS",
  isPinned: true,
  author: "Master Admin",
  cards: [
    {
      title: "Single Invite Plan (১৫০ টাকা)",
      content: "• নিজের জিমেইল (Gmail) এ ইনস্ট্যান্ট এক্টিভেশন\n• একবার পেমেন্টে ১৮ মাস নিরবচ্ছিন্ন ব্যবহারের সুবিধা\n• ব্যক্তিগত ব্যবহারের জন্য সেরা পছন্দ\n• সাথে পাবেন ৫TB Google Cloud Storage স্পেস",
      badge: "১৫০ টাকা / ১৮ মাস",
      linkUrl: "/en/services?cat=subscriptions"
    },
    {
      title: "Personal+ Full Owner (২৫০ টাকা)",
      content: "• সম্পূর্ণ ফ্যামিলি ম্যানেজার অ্যাকাউন্ট আপনার নিজের নিয়ন্ত্রণে\n• সর্বোচ্চ ৫ জনকে ইনভাইট বা শেয়ার করার পূর্ণ সুবিধা\n• রিসেল, পরিবার বা টিম ব্যবহারের জন্য সবচেয়ে উপযুক্ত\n• জিমেইল, নাম ও নাম্বার দিয়ে ইন্সট্যান্ট সেটআপ",
      badge: "২৫০ টাকা / ১৮ মাস",
      linkUrl: "/en/services?cat=subscriptions"
    },
    {
      title: "Included Pro Tools & AI Models",
      content: "• Gemini Pro AI Deep Reasoning Model\n• Veo 3 Cinematic AI Video Generator\n• Flow & Whisk Creative AI Tools\n• Google Search & NotebookLM Integration\n• Android Studio & Google AI Studio Access",
      badge: "AI Suite",
      linkUrl: ""
    },
    {
      title: "🎁 FREE Bonus Subscriptions (১৮ মাস)",
      content: "• CapCut+ Premium (১৮ মাস বিনামূল্যে)\n• YouTube Premium for Android (১৮ মাস ফ্রি)\n• Canva Pro Premium (ক্যানবা প্রো ১৮ মাস ফ্রি)\n• ১০০% গ্যারান্টিযুক্ত অফিসিয়াল গিফট বোনাস",
      badge: "🎁 FREE BONUS",
      linkUrl: ""
    },
    {
      title: "Official Guarantee & Rapid Delivery",
      content: "• ১০০% অফিসিয়াল গুগল লাইসেন্সড এক্টিভেশন\n• অর্ডার করার ৫ থেকে ২০ মিনিটের ফাস্ট ডেলিভারি\n• ১৮ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি সুবিধা\n• ২৪/৭ অ্যাডমিন হোয়াটসঅ্যাপ সাপোর্ট টিম",
      badge: "100% Guaranteed",
      linkUrl: "https://wa.me/8801700000000"
    }
  ]
};

const CHATGPT_PLUS_OFFER_SEED = {
  title: "🌸 ChatGPT Plus সাবস্ক্রিপশন অফার! 🌸",
  description: `⚡ ChatGPT Plus (GPT-4o, Sora, DALL-E 3) প্রিমিয়াম সাবস্ক্রিপশন অফার! 

অফার প্যাকেজসমূহ:
• Package 1: Shared Account (আমরা Gmail ও পাসওয়ার্ড প্রদান করব)
• Package 2: Personal Account (আপনার নিজস্ব ব্যক্তিগত জিমেইলে নেওয়া হবে)

নিচের তালিকা থেকে আপনার পছন্দের প্যাকেজ নির্বাচন করুন এবং "অর্ডার করুন (Buy Now)" বাটনে ক্লিক করুন!`,
  category: "Promotional Offer",
  badgeText: "🌸 CHATGPT PLUS OFFER",
  isPinned: true,
  author: "Master Admin",
  cards: [
    {
      title: "Package 1: Shared Account (আমরা Gmail ও পাসওয়ার্ড দিব)",
      content: "• ১ মাসের জন্য: ৩০০ টাকা\n• ১ বছরের জন্য: ৪৫০ টাকা\n• ৩ বছরের জন্য: ৬০০ টাকা\n• ইনস্ট্যান্ট লগইন অ্যাকাউন্ট ও রিপ্লেসমেন্ট ওয়ারেন্টি",
      badge: "৩০০ টাকা থেকে শুরু",
      linkUrl: "/services?query=ChatGPT"
    },
    {
      title: "Package 2: Personal Account (আপনার নিজের জিমেইলে নেওয়া হবে)",
      content: "• ১ মাসের জন্য: ৪০০ টাকা\n• ১ বছরের জন্য: ৬০০ টাকা\n• ৩ বছরের জন্য: ১১০০ টাকা\n• ১০০% প্রাইভেট ও পার্সোনাল জিমেইল এক্টিভেশন",
      badge: "৪০০ টাকা থেকে শুরু",
      linkUrl: "/services?query=ChatGPT"
    },
    {
      title: "Included Features & GPT-4o Power",
      content: "• GPT-4o & GPT-4 Turbo Model Access\n• DALL-E 3 AI Image Generation\n• Sora Video Generation & Custom GPTs\n• Fast Response Time & High Priority Access",
      badge: "GPT-4o Full Access",
      linkUrl: ""
    }
  ]
};

// 1. GET /api/updates - Fetch all daily updates sorted by pinned & createdAt (No auto-seeding)
export async function GET() {
  try {
    await connectDB();

    const updates = await (Update as any).find({}).sort({ isPinned: -1, createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        updates: updates || [],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Error fetching updates from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch updates: " + (error.message || "Unknown error"),
        updates: [],
      },
      { status: 500 }
    );
  }
}

// 2. POST /api/updates - Create a new daily update (Admin CRUD)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      title,
      description,
      category,
      bannerImage,
      badgeText,
      cards,
      files,
      isPinned,
      author,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required." },
        { status: 400 }
      );
    }

    const newUpdate = await (Update as any).create({
      title,
      description,
      category: category || "Daily Announcement",
      bannerImage: bannerImage || "",
      badgeText: badgeText || "NEW UPDATE",
      cards: cards || [],
      files: files || [],
      isPinned: Boolean(isPinned),
      author: author || "Master Admin",
    });

    console.log(`📌 [MongoDB Atlas] Created Today's Update: "${newUpdate.title}" (ID: ${newUpdate._id})`);

    return NextResponse.json({
      success: true,
      message: "Daily Update published successfully!",
      update: newUpdate,
    });
  } catch (error: any) {
    console.error("❌ Error creating update in MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish update: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

// 3. PUT /api/updates - Edit existing update
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, title, description, category, bannerImage, badgeText, cards, files, isPinned } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Update ID is required" },
        { status: 400 }
      );
    }

    const updated = await (Update as any).findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          category,
          bannerImage,
          badgeText,
          cards: cards || [],
          files: files || [],
          isPinned: Boolean(isPinned),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Update record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Daily update updated successfully!",
      update: updated,
    });
  } catch (error: any) {
    console.error("❌ Error updating record in MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update record: " + error.message,
      },
      { status: 500 }
    );
  }
}

// 4. DELETE /api/updates?id=...&title=... - Delete update entry permanently (or purge all)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let title = searchParams.get("title");
    const purgeAll = searchParams.get("all") === "true" || searchParams.get("purge") === "true" || id === "all";

    if (purgeAll) {
      const result = await (Update as any).deleteMany({});
      console.log(`🗑️ [MongoDB Atlas] Purged ALL Today's Updates (${result.deletedCount} documents removed)`);
      return NextResponse.json({
        success: true,
        message: `All update entries permanently deleted from database (${result.deletedCount} removed)!`,
        deletedCount: result.deletedCount,
      });
    }

    if (!id) {
      try {
        const body = await request.json();
        id = body.id || body._id;
        title = title || body.title;
      } catch (e) {}
    }

    if (!id && !title) {
      return NextResponse.json(
        { success: false, message: "Update ID or Title is required for deletion." },
        { status: 400 }
      );
    }

    const filterConditions: any[] = [];

    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        filterConditions.push({ _id: new mongoose.Types.ObjectId(id) });
        filterConditions.push({ _id: id });
      } else {
        filterConditions.push({ title: id });
      }
    }

    if (title) {
      filterConditions.push({ title: title.trim() });
    }

    const filter = filterConditions.length > 1 ? { $or: filterConditions } : filterConditions[0];

    // Use deleteMany to clean up any duplicate entries in MongoDB Atlas
    const deleteResult = await (Update as any).deleteMany(filter);

    if (!deleteResult || deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Update record not found in database." },
        { status: 404 }
      );
    }

    console.log(`🗑️ [MongoDB Atlas] Permanently deleted ${deleteResult.deletedCount} update document(s) matching filter:`, filter);

    return NextResponse.json({
      success: true,
      message: `Daily update entry deleted permanently (${deleteResult.deletedCount} removed)!`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error: any) {
    console.error("❌ Error deleting update from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete update: " + error.message,
      },
      { status: 500 }
    );
  }
}
