import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import DeletedProduct from "@/lib/models/DeletedProduct";

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
    duration: doc.duration || doc.validity || "7 Days",
    validity: doc.validity || doc.duration || "7 Days",
    rating: doc.rating ? Number(doc.rating) : 4.8,
    reviews: doc.reviews ? Number(doc.reviews) : 120,
    badge: doc.badge || doc.tag || doc.subtitle || "",
    tag: doc.tag || doc.badge || "",
    badgeColor: doc.badgeColor || "",
    logo: doc.logo || doc.image || "",
    image: doc.image || doc.logo || "",
    logoType: doc.logoType || "",
    icon: doc.icon || "Sparkles",
    inStock: doc.inStock !== false && (doc as any).inStock !== "false" && doc.stock !== "Out of Stock" && doc.stock !== "Stock Out" && doc.stock !== "Sold Out",
    stock: doc.stock || (doc.inStock === false ? "Stock Out" : "In Stock"),
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
    const filter = isObjectId ? { $or: [{ productId: decodedId }, { _id: decodedId }] } : { productId: decodedId };

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
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

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

    const isAvailable = 
      inStock !== false && 
      inStock !== "false" && 
      stock !== "Out of Stock" && 
      stock !== "Stock Out" && 
      stock !== "Sold Out";

    const finalStock = !isAvailable
      ? (stock === "Sold Out" ? "Sold Out" : (stock === "Out of Stock" ? "Out of Stock" : "Stock Out"))
      : "In Stock";

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle;
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
    if (badge !== undefined) updateData.badge = badge;
    if (tag !== undefined) updateData.tag = tag;
    if (badgeColor !== undefined) updateData.badgeColor = badgeColor;
    if (logo !== undefined) updateData.logo = logo;
    if (image !== undefined) updateData.image = image;
    if (logoType !== undefined) updateData.logoType = logoType;
    if (icon !== undefined) updateData.icon = icon;
    if (inStock !== undefined || stock !== undefined) {
      updateData.inStock = isAvailable;
      updateData.stock = finalStock;
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

    const targetProductId = (body.productId || body.id || id).toString().trim();
    const isObjectId = typeof id === "string" && Boolean(id.match(/^[0-9a-fA-F]{24}$/));
    const isBodyObjectId = typeof body._id === "string" && Boolean(body._id.match(/^[0-9a-fA-F]{24}$/));

    const orConditions: any[] = [{ productId: id }, { productId: targetProductId }];
    if (isObjectId) orConditions.push({ _id: id });
    if (isBodyObjectId) orConditions.push({ _id: body._id });

    const filter = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };

    const updatedDoc = await (Product as any).findOneAndUpdate(
      filter,
      { 
        $set: updateData,
        $setOnInsert: { productId: targetProductId }
      },
      { new: true, upsert: true }
    ).lean();

    const mapped = mapProductToServiceItem(updatedDoc);

    try {
      await (DeletedProduct as any).deleteMany({
        $or: [{ productId: id }, { productId: targetProductId }]
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
