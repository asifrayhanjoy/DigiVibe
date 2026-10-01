import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { SERVICES } from "@/data/services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to sanitize product document to client ServiceItem format
function mapProductToServiceItem(doc: any) {
  return {
    id: doc.productId || doc._id.toString(),
    _id: doc._id.toString(),
    title: doc.title,
    category: doc.category,
    subtitle: doc.subtitle || "",
    operator: doc.operator || "",
    price: Number(doc.price),
    originalPrice: doc.originalPrice ? Number(doc.originalPrice) : Math.round(Number(doc.price) * 1.2),
    duration: doc.duration || "7 Days",
    rating: doc.rating ? Number(doc.rating) : 4.8,
    reviews: doc.reviews ? Number(doc.reviews) : 120,
    badge: doc.badge || doc.tag || doc.subtitle || "",
    tag: doc.tag || doc.badge || "",
    badgeColor: doc.badgeColor || "",
    logo: doc.logo || doc.image || "",
    image: doc.image || doc.logo || "",
    logoType: doc.logoType || "",
    icon: doc.icon || "Sparkles",
    inStock: doc.inStock !== false && doc.stock !== "Out of Stock" && doc.stock !== "Stock Out" && doc.stock !== "Sold Out",
    stock: doc.stock || (doc.inStock === false ? "Out of Stock" : "In Stock"),
    features: Array.isArray(doc.features) ? doc.features : [],
    popular: !!doc.popular,
    usdPrice: doc.usdPrice || "",
    unit: doc.unit || "",
    delivery: doc.delivery || "Instant Auto-Delivery",
    description: doc.description || "",
    overview: doc.overview || "",
    minQuantity: doc.minQuantity,
    maxQuantity: doc.maxQuantity,
    terms: doc.terms || "",
    priceNote: doc.priceNote || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// GET /api/products - Fetch all products from MongoDB Atlas (with auto-seeding fallback)
export async function GET(req: Request) {
  try {
    await connectDB();

    // Auto-seed or sync static SERVICES cards if DB is empty or missing promo items
    const seedOperations = (SERVICES as any[]).map((item) => ({
      updateOne: {
        filter: { productId: item.id },
        update: {
          $setOnInsert: {
            productId: item.id,
            title: item.title,
            category: item.category,
            subtitle: item.subtitle || item.badge || "",
            operator: item.operator || "",
            price: item.price,
            originalPrice: item.originalPrice || Math.round(item.price * 1.2),
            duration: item.validity || item.duration || "7 Days",
            rating: item.rating || 4.8,
            reviews: item.reviews || 120,
            tag: item.badge || item.tag || "",
            badge: item.badge || item.subtitle || "",
            badgeColor: item.badgeColor || "",
            logo: item.logo || item.image || "",
            image: item.image || item.logo || "",
            logoType: item.logoType || "",
            icon: item.icon || "Sparkles",
            inStock: item.inStock !== false && item.stock !== "Stock Out" && item.stock !== "Out of Stock",
            stock: item.stock || (item.inStock === false ? "Out of Stock" : "In Stock"),
            features: item.features || [],
            popular: !!item.popular,
            usdPrice: item.usdPrice || "",
            unit: item.unit || "",
            delivery: item.delivery || "Instant Auto-Delivery",
            description: item.description || "",
            overview: item.overview || "",
            minQuantity: item.minQuantity,
            maxQuantity: item.maxQuantity,
            terms: item.terms || "",
            priceNote: item.priceNote || "",
          },
        },
        upsert: true,
      },
    }));

    if (seedOperations.length > 0) {
      await (Product as any).bulkWrite(seedOperations);
    }

    let products = await (Product as any).find().sort({ createdAt: -1 }).lean();

    const mappedProducts = products.map(mapProductToServiceItem);

    return NextResponse.json(
      {
        success: true,
        count: mappedProducts.length,
        products: mappedProducts,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products from database",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product card (Admin only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      title,
      category,
      price,
      subtitle,
      operator,
      originalPrice,
      duration,
      rating,
      reviews,
      badge,
      tag,
      badgeColor,
      logo,
      image,
      logoType,
      icon,
      inStock,
      stock,
      features,
      popular,
      usdPrice,
      unit,
      delivery,
      description,
      overview,
      minQuantity,
      maxQuantity,
      terms,
      priceNote,
    } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json(
        { success: false, message: "Title, Category, and Price are required fields." },
        { status: 400 }
      );
    }

    const generatedId = `service-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const productId = body.productId || body.id || generatedId;

    const isAvailable = inStock !== false && stock !== "Out of Stock" && stock !== "Stock Out" && stock !== "Sold Out";
    const finalStock = stock || (isAvailable ? "In Stock" : "Out of Stock");

    const newProduct = await (Product as any).create({
      productId,
      title: title.trim(),
      category: category.trim(),
      subtitle: subtitle || "",
      operator: operator || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.2),
      duration: duration || "7 Days",
      rating: rating ? Number(rating) : 4.8,
      reviews: reviews ? Number(reviews) : 120,
      badge: badge || tag || "",
      tag: tag || badge || "",
      badgeColor: badgeColor || "",
      logo: logo || image || "",
      image: image || logo || "",
      logoType: logoType || "",
      icon: icon || "Sparkles",
      inStock: isAvailable,
      stock: finalStock,
      features: Array.isArray(features) ? features : [],
      popular: !!popular,
      usdPrice: usdPrice || "",
      unit: unit || "",
      delivery: delivery || "Instant Auto-Delivery",
      description: description || "",
      overview: overview || "",
      minQuantity: minQuantity ? Number(minQuantity) : undefined,
      maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
      terms: terms || "",
      priceNote: priceNote || "",
    });

    const mapped = mapProductToServiceItem(newProduct.toObject());

    return NextResponse.json({
      success: true,
      message: "New service card created successfully!",
      product: mapped,
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product: " + (error?.message || "Internal server error"),
      },
      { status: 500 }
    );
  }
}
