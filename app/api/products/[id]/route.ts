import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import DeletedProduct from "@/lib/models/DeletedProduct";
import { getCanonicalCategory } from "@/lib/categories";

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
    title_bn: doc.title_bn || doc.title,
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
    isPinned: !!(doc.isPinned ?? doc.pinned),
    pinned: !!(doc.isPinned ?? doc.pinned),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// GET /api/products/[id] - Fetch single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const idParam = resolvedParams?.id;

    if (!idParam) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const decodedId = decodeURIComponent(idParam).trim();
    const isObjectId = typeof decodedId === "string" && Boolean(decodedId.match(/^[0-9a-fA-F]{24}$/));
    const conditions: any[] = [{ productId: decodedId }, { id: decodedId }];
    if (isObjectId) {
      conditions.push({ _id: decodedId });
      try {
        conditions.push({ _id: new mongoose.Types.ObjectId(decodedId) });
      } catch (e) {}
    }
    const filter = conditions.length === 1 ? conditions[0] : { $or: conditions };

    const doc = await (Product as any).findOne(filter).lean();

    if (!doc) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: mapProductToServiceItem(doc) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/products/[id] - Edit existing service card (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const rawIdParam = resolvedParams?.id;

    if (!rawIdParam) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const decodedId = decodeURIComponent(rawIdParam).trim();
    const body = await req.json();

    const {
      title,
      category,
      price,
      subtitle,
      operator,
      originalPrice,
      duration,
      validity,
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
      status,
      stockStatus,
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
      isPinned,
      pinned,
    } = body;

    // Resolve stock status accurately across all representations
    const hasInStock = inStock !== undefined;
    const hasStock = stock !== undefined;
    const hasStatus = status !== undefined || stockStatus !== undefined;

    let isAvailable: boolean | undefined;
    if (hasInStock || hasStock || hasStatus) {
      if (inStock === false || inStock === "false") {
        isAvailable = false;
      } else if (
        stock === "Stock Out" ||
        stock === "Out of Stock" ||
        stock === "Sold Out" ||
        status === "stock-out" ||
        status === "out-of-stock" ||
        stockStatus === "stock-out"
      ) {
        isAvailable = false;
      } else if (inStock === true || inStock === "true" || stock === "In Stock" || status === "in-stock") {
        isAvailable = true;
      } else {
        isAvailable = true;
      }
    }

    const finalStock = isAvailable !== undefined
      ? (!isAvailable
          ? (stock === "Sold Out" ? "Sold Out" : (stock === "Out of Stock" ? "Out of Stock" : "Stock Out"))
          : "In Stock")
      : undefined;

    const finalStatus = isAvailable !== undefined ? (isAvailable ? "in-stock" : "stock-out") : undefined;

    const updateData: any = {};
    if (title !== undefined) {
      const trimmedTitle = typeof title === "string" ? title.trim() : title;
      updateData.title = trimmedTitle;
      updateData.title_bn = body.title_bn || trimmedTitle;
    }
    if (category !== undefined) updateData.category = typeof category === "string" ? category.trim() : category;
    if (subtitle !== undefined) updateData.subtitle = typeof subtitle === "string" ? subtitle.trim() : subtitle;
    if (operator !== undefined) updateData.operator = operator;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);

    // Capture and persist both duration and validity fields
    const targetDuration = duration !== undefined ? duration : validity;
    if (targetDuration !== undefined) {
      const trimmed = typeof targetDuration === "string" ? targetDuration.trim() : targetDuration;
      updateData.duration = trimmed;
      updateData.validity = trimmed;
    }
    if (rating !== undefined) updateData.rating = Number(rating);
    if (reviews !== undefined) updateData.reviews = Number(reviews);
    if (badge !== undefined) updateData.badge = typeof badge === "string" ? badge.trim() : badge;
    if (tag !== undefined) updateData.tag = typeof tag === "string" ? tag.trim() : tag;
    if (badgeColor !== undefined) updateData.badgeColor = badgeColor;

    // Capture and persist custom image URL and presets across all representations
    const rawImage = imageUrl !== undefined ? imageUrl : (image !== undefined ? image : logo);
    if (rawImage !== undefined) {
      const trimmedImg = typeof rawImage === "string" ? rawImage.trim() : (rawImage || "");
      updateData.imageUrl = trimmedImg;
      updateData.image = trimmedImg;
      updateData.logo = trimmedImg;
    }

    if (logoType !== undefined) {
      updateData.logoType = typeof logoType === "string" ? logoType.trim() : (logoType ?? "");
    }
    if (icon !== undefined) updateData.icon = icon;

    // Apply unified stock fields synchronously
    if (isAvailable !== undefined) {
      updateData.inStock = isAvailable;
      updateData.stock = finalStock;
      updateData.status = finalStatus;
      updateData.stockStatus = finalStatus;

      // When setting to in stock, clean out any stale "SOLD OUT" badge/tag/subtitle
      if (isAvailable) {
        if (updateData.badge === "SOLD OUT" || updateData.badge === "Sold Out ❌" || updateData.badge?.toLowerCase() === "sold out") {
          updateData.badge = "";
        }
        if (updateData.tag === "SOLD OUT" || updateData.tag === "Sold Out ❌" || updateData.tag?.toLowerCase() === "sold out") {
          updateData.tag = "";
        }
        if (updateData.subtitle === "SOLD OUT" || updateData.subtitle === "Sold Out ❌" || updateData.subtitle?.toLowerCase() === "sold out") {
          updateData.subtitle = "";
        }
      }
    }

    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];
    if (popular !== undefined) updateData.popular = !!popular;
    if (usdPrice !== undefined) updateData.usdPrice = usdPrice;
    if (unit !== undefined) updateData.unit = unit;
    if (delivery !== undefined) updateData.delivery = delivery;
    if (description !== undefined) updateData.description = description;
    if (overview !== undefined) updateData.overview = overview;
    if (minQuantity !== undefined) updateData.minQuantity = minQuantity ? Number(minQuantity) : undefined;
    if (maxQuantity !== undefined) updateData.maxQuantity = maxQuantity ? Number(maxQuantity) : undefined;
    if (terms !== undefined) updateData.terms = terms;
    if (priceNote !== undefined) updateData.priceNote = priceNote;
    if (isPinned !== undefined || pinned !== undefined) {
      const pinVal = isPinned !== undefined ? !!isPinned : !!pinned;
      updateData.isPinned = pinVal;
      updateData.pinned = pinVal;
    }

    // Collect all candidate identifiers
    const targetProductId = (body.productId || body.id || decodedId).toString().trim();
    const candidateIds = Array.from(
      new Set(
        [
          decodedId,
          rawIdParam.trim(),
          (body.id || "").toString().trim(),
          (body.productId || "").toString().trim(),
          (body._id || "").toString().trim(),
          (body.originalId || "").toString().trim(),
        ].filter(Boolean)
      )
    );

    const orConditions: any[] = [];
    for (const cid of candidateIds) {
      orConditions.push({ productId: cid });
      orConditions.push({ id: cid });
      if (typeof cid === "string" && cid.match(/^[0-9a-fA-F]{24}$/)) {
        orConditions.push({ _id: cid });
        try {
          orConditions.push({ _id: new mongoose.Types.ObjectId(cid) });
        } catch (e) {}
      }
    }

    if (body.originalTitle && typeof body.originalTitle === "string" && body.originalTitle.trim().length > 0) {
      orConditions.push({ title: body.originalTitle.trim() });
    }

    const filter = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };

    // 1. First attempt to find existing product to update by _id
    let existingDoc = await (Product as any).findOne(filter);

    let updatedDoc: any = null;
    if (existingDoc) {
      // Ensure productId is always populated on document
      updateData.productId = existingDoc.productId || targetProductId;

      updatedDoc = await (Product as any).findByIdAndUpdate(
        existingDoc._id,
        { $set: updateData },
        { new: true, runValidators: false }
      ).lean();
    } else {
      // 2. Fallback: Create directly to prevent MongoDB $or inference errors on upsert
      updateData.productId = targetProductId;
      const created = await (Product as any).create({
        ...updateData,
        productId: targetProductId,
      });
      updatedDoc = created?.toObject ? created.toObject() : created;
    }

    const mapped = mapProductToServiceItem(updatedDoc || { ...updateData, productId: targetProductId });

    try {
      await (DeletedProduct as any).deleteMany({
        $or: candidateIds.map((cid) => ({ productId: cid }))
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Service card updated successfully!",
      product: mapped,
    });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update service card: " + (error?.message || "Internal server error"),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Remove product card (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const idParam = resolvedParams?.id;

    if (!idParam) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const decodedId = decodeURIComponent(idParam).trim();

    // Read optional request body for extra IDs (e.g. _id vs productId)
    let bodyId = "";
    let bodyProductId = "";
    let bodyDocId = "";
    try {
      const body = await req.json();
      bodyId = (body?.id || "").toString().trim();
      bodyProductId = (body?.productId || "").toString().trim();
      bodyDocId = (body?._id || "").toString().trim();
    } catch (e) {
      // Body is optional
    }

    const candidateIds = Array.from(
      new Set(
        [decodedId, idParam.trim(), bodyId, bodyProductId, bodyDocId]
          .filter((v): v is string => Boolean(v && v.length > 0))
      )
    );

    const conditions: any[] = [];
    for (const cand of candidateIds) {
      conditions.push({ productId: cand });
      if (cand.match(/^[0-9a-fA-F]{24}$/)) {
        conditions.push({ _id: cand });
      }
    }

    const queryFilter = conditions.length === 1 ? conditions[0] : { $or: conditions };

    // Find any existing matching documents before deleting to capture all identifiers
    const existingDocs = await (Product as any).find(queryFilter).lean();
    const allIdsToRecord = new Set<string>(candidateIds);
    existingDocs.forEach((doc: any) => {
      if (doc.productId) allIdsToRecord.add(doc.productId.toString());
      if (doc._id) allIdsToRecord.add(doc._id.toString());
    });

    // Delete documents from Product collection
    await (Product as any).deleteMany(queryFilter);

    // Persist all deleted IDs in DeletedProduct collection so initial seeding NEVER re-inserts them
    for (const pid of allIdsToRecord) {
      try {
        await (DeletedProduct as any).findOneAndUpdate(
          { productId: pid },
          { productId: pid, deletedAt: new Date() },
          { upsert: true }
        );
      } catch (err) {
        console.error("Failed to record deleted product in DeletedProduct:", pid, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product card deleted successfully",
      deletedIds: Array.from(allIdsToRecord),
    });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/products/[id] - Alias to PUT for partial field updates (like toggling isPinned)
export const PATCH = PUT;
