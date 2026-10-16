import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import DeletedProduct from "@/lib/models/DeletedProduct";
import { SERVICES } from "@/data/services";
import { getCanonicalCategory } from "@/lib/categories";
import { compareAlphabetical } from "@/lib/sorting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to sanitize product document to client ServiceItem format
function mapProductToServiceItem(doc: any) {
  const productId = (doc.productId || doc.id || (doc._id ? doc._id.toString() : "")).toString().trim();
  const docId = doc._id ? doc._id.toString() : productId;
  const canonicalCat = getCanonicalCategory({ id: productId || docId, category: doc.category, title: doc.title });

  const rawInStock = doc.inStock;
  const rawStock = (doc.stock || "").toString().trim();
  const rawStatus = (doc.status || doc.stockStatus || "").toString().trim().toLowerCase();

  const isAvailable =
    rawInStock !== false &&
    rawInStock !== "false" &&
    rawStock !== "Stock Out" &&
    rawStock !== "Out of Stock" &&
    rawStock !== "Sold Out" &&
    rawStatus !== "stock-out" &&
    rawStatus !== "out-of-stock";

  const resolvedStock = isAvailable
    ? "In Stock"
    : (rawStock === "Sold Out" ? "Sold Out" : (rawStock === "Out of Stock" ? "Out of Stock" : "Stock Out"));

  const resolvedStatus = isAvailable ? "in-stock" : "stock-out";

  // Clean badge: if available, it should never say SOLD OUT
  let resolvedBadge = (doc.badge || doc.tag || doc.subtitle || "").toString().trim();
  if (isAvailable && (resolvedBadge === "SOLD OUT" || resolvedBadge === "Sold Out ❌" || resolvedBadge.toLowerCase() === "sold out")) {
    resolvedBadge = doc.subtitle && doc.subtitle !== "SOLD OUT" && doc.subtitle !== "Sold Out ❌" ? doc.subtitle : "";
  }

  let resolvedTag = (doc.tag || doc.badge || "").toString().trim();
  if (isAvailable && (resolvedTag === "SOLD OUT" || resolvedTag === "Sold Out ❌" || resolvedTag.toLowerCase() === "sold out")) {
    resolvedTag = "";
  }

  return {
    id: productId || docId,
    _id: docId,
    productId: productId || docId,
    title: doc.title,
    category: canonicalCat,
    subtitle: doc.subtitle || "",
    operator: doc.operator || "",
    price: Number(doc.price),
    originalPrice: doc.originalPrice ? Number(doc.originalPrice) : Math.round(Number(doc.price) * 1.2),
    duration: doc.duration || doc.validity || "7 Days",
    validity: doc.validity || doc.duration || "7 Days",
    rating: doc.rating ? Number(doc.rating) : 4.8,
    reviews: doc.reviews ? Number(doc.reviews) : 120,
    badge: resolvedBadge,
    tag: resolvedTag,
    badgeColor: doc.badgeColor || "",
    logo: (doc.imageUrl || doc.image || doc.logo || "").toString().trim(),
    image: (doc.imageUrl || doc.image || doc.logo || "").toString().trim(),
    imageUrl: (doc.imageUrl || doc.image || doc.logo || "").toString().trim(),
    logoType: doc.logoType !== undefined && doc.logoType !== null ? doc.logoType : "",
    icon: doc.icon || "Sparkles",
    inStock: isAvailable,
    stock: resolvedStock,
    status: resolvedStatus,
    stockStatus: resolvedStatus,
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
    smmPriceMigrated: !!doc.smmPriceMigrated,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// GET /api/products - Fetch all products from MongoDB Atlas (with initial seeding fallback)
export async function GET(req: Request) {
  try {
    await connectDB();

    // 0. Query DeletedProduct collection to get all permanently deleted product IDs
    const deletedDocs = await (DeletedProduct as any).find().lean();
    const deletedIds = new Set<string>(
      deletedDocs.map((d: any) => d.productId?.toString()).filter(Boolean)
    );

    // Also include purged email items
    const purgedEmailIds = ["email-fr-outlook", "email-hotmail-trust", "email-outlook-fresh"];
    purgedEmailIds.forEach((id) => deletedIds.add(id));

    // Filter out ANY deleted products from default static SERVICES
    const activeSeedServices = (SERVICES as any[]).filter((item) => !deletedIds.has(item.id));

    // 1. One-time initial seeding for empty database or missing default static products ($setOnInsert)
    const existingCount = await (Product as any).countDocuments();

    if (existingCount === 0) {
      // Seed default SERVICES into MongoDB if DB is completely empty (excluding any deleted ones)
      const initialDocs = activeSeedServices.map((item) => ({
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
        inStock: item.inStock !== false && (item as any).inStock !== "false" && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out",
        stock: item.stock || (item.inStock === false ? "Stock Out" : "In Stock"),
        status: (item.inStock !== false && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out") ? "in-stock" : "stock-out",
        stockStatus: (item.inStock !== false && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out") ? "in-stock" : "stock-out",
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
        smmPriceMigrated: !!item.smmPriceMigrated,
      }));

      if (initialDocs.length > 0) {
        await (Product as any).insertMany(initialDocs, { ordered: false });
      }
    } else {
      // If DB has documents, ensure missing default SERVICES are added using $setOnInsert (skipping deleted items)
      const seedOperations = activeSeedServices.map((item) => ({
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
              inStock: item.inStock !== false && (item as any).inStock !== "false" && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out",
              stock: item.stock || (item.inStock === false ? "Stock Out" : "In Stock"),
              status: (item.inStock !== false && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out") ? "in-stock" : "stock-out",
              stockStatus: (item.inStock !== false && item.stock !== "Stock Out" && item.stock !== "Out of Stock" && item.stock !== "Sold Out") ? "in-stock" : "stock-out",
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
              smmPriceMigrated: !!item.smmPriceMigrated,
            },
          },
          upsert: true,
        },
      }));

      if (seedOperations.length > 0) {
        await (Product as any).bulkWrite(seedOperations);
      }
    }

    // Explicitly guarantee any purged or deleted items are purged from Product collection
    if (deletedIds.size > 0) {
      const deletedArr = Array.from(deletedIds);
      const objectIdDeletes = deletedArr.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));
      await (Product as any).deleteMany({
        $or: [
          { productId: { $in: deletedArr } },
          ...(objectIdDeletes.length > 0 ? [{ _id: { $in: objectIdDeletes } }] : []),
        ],
      });
    }

    // Database Migration: Ensure every product in "Social Media Service" has the +5.00 BDT increase applied
    try {
      const unmigratedSmm = await (Product as any).find({
        $and: [
          {
            $or: [
              { category: "smm" },
              { category: "social" },
              { category: /social/i },
              { category: /smm/i },
              { productId: /^smm-/i },
              { id: /^smm-/i },
            ],
          },
          { smmPriceMigrated: { $ne: true } },
        ],
      }).lean();

      if (unmigratedSmm.length > 0) {
        const usdRate = 127;
        const migrationOps = unmigratedSmm.map((prod: any) => {
          const currentPrice = Number(prod.price) || 0;
          const newPrice = currentPrice + 5;
          const newOriginalPrice = prod.originalPrice
            ? Number(prod.originalPrice) + 5
            : Math.round(newPrice * 1.2);
          const newUsdPrice = `$${(newPrice / usdRate).toFixed(2)}`;

          return {
            updateOne: {
              filter: { _id: prod._id },
              update: {
                $set: {
                  price: newPrice,
                  originalPrice: newOriginalPrice,
                  usdPrice: newUsdPrice,
                  smmPriceMigrated: true,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          };
        });

        if (migrationOps.length > 0) {
          await (Product as any).bulkWrite(migrationOps);
        }
      }
    } catch (migErr) {
      console.error("SMM price auto-migration warning:", migErr);
    }

    const deletedArr = Array.from(deletedIds);
    const objectIdDeletes = deletedArr.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));
    const excludeFilter = deletedArr.length > 0
      ? {
          productId: { $nin: deletedArr },
          ...(objectIdDeletes.length > 0 ? { _id: { $nin: objectIdDeletes } } : {}),
        }
      : {};

    let products = await (Product as any).find(excludeFilter).sort({ createdAt: -1 }).lean();

    const mappedProducts = products.map(mapProductToServiceItem);
    mappedProducts.sort(compareAlphabetical);

    return NextResponse.json(
      {
        success: true,
        count: mappedProducts.length,
        products: mappedProducts,
        deletedIds: Array.from(deletedIds),
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
      imageUrl,
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
      validity,
    } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json(
        { success: false, message: "Title, Category, and Price are required fields." },
        { status: 400 }
      );
    }

    const generatedId = `service-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const productId = body.productId || body.id || generatedId;

    const isAvailable = inStock !== false && inStock !== "false" && stock !== "Out of Stock" && stock !== "Stock Out" && stock !== "Sold Out";
    const finalStock = !isAvailable
      ? (stock === "Sold Out" ? "Sold Out" : (stock === "Out of Stock" ? "Out of Stock" : "Stock Out"))
      : "In Stock";
    const finalStatus = isAvailable ? "in-stock" : "stock-out";

    let cleanBadge = (badge || tag || "").toString().trim();
    let cleanTag = (tag || badge || "").toString().trim();
    if (isAvailable) {
      if (cleanBadge === "SOLD OUT" || cleanBadge === "Sold Out ❌" || cleanBadge.toLowerCase() === "sold out") {
        cleanBadge = "";
      }
      if (cleanTag === "SOLD OUT" || cleanTag === "Sold Out ❌" || cleanTag.toLowerCase() === "sold out") {
        cleanTag = "";
      }
    }

    const targetDuration = (duration || validity || "7 Days").toString().trim();
    const rawImage = imageUrl !== undefined ? imageUrl : (image !== undefined ? image : logo);
    const customImg = typeof rawImage === "string" ? rawImage.trim() : (rawImage || "");
    const targetLogoType = typeof logoType === "string" ? logoType.trim() : (logoType || "");

    const newProduct = await (Product as any).create({
      productId,
      title: title.trim(),
      category: category.trim(),
      subtitle: subtitle || "",
      operator: operator || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.2),
      duration: targetDuration,
      validity: targetDuration,
      rating: rating ? Number(rating) : 4.8,
      reviews: reviews ? Number(reviews) : 120,
      badge: cleanBadge,
      tag: cleanTag,
      badgeColor: badgeColor || "",
      logo: customImg,
      image: customImg,
      imageUrl: customImg,
      logoType: targetLogoType,
      icon: icon || "Sparkles",
      inStock: isAvailable,
      stock: finalStock,
      status: finalStatus,
      stockStatus: finalStatus,
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

    try {
      await (DeletedProduct as any).deleteMany({ productId });
    } catch (e) {}

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
