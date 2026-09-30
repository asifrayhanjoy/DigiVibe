import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

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

// GET /api/products/[id] - Fetch single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const isObjectId = typeof id === "string" && Boolean(id.match(/^[0-9a-fA-F]{24}$/));
    const filter = isObjectId ? { $or: [{ productId: id }, { _id: id }] } : { productId: id };

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

    const isAvailable = inStock !== false && stock !== "Out of Stock" && stock !== "Stock Out" && stock !== "Sold Out";
    const finalStock = stock || (isAvailable ? "In Stock" : "Out of Stock");

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (operator !== undefined) updateData.operator = operator;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
    if (duration !== undefined) updateData.duration = duration;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (reviews !== undefined) updateData.reviews = Number(reviews);
    if (badge !== undefined) updateData.badge = badge;
    if (tag !== undefined) updateData.tag = tag;
    if (badgeColor !== undefined) updateData.badgeColor = badgeColor;
    if (logo !== undefined) updateData.logo = logo;
    if (image !== undefined) updateData.image = image;
    if (logoType !== undefined) updateData.logoType = logoType;
    if (icon !== undefined) updateData.icon = icon;
    if (inStock !== undefined) updateData.inStock = isAvailable;
    if (stock !== undefined) updateData.stock = finalStock;
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

    const isObjectId = typeof id === "string" && Boolean(id.match(/^[0-9a-fA-F]{24}$/));
    const filter = isObjectId ? { $or: [{ productId: id }, { _id: id }] } : { productId: id };

    const updatedDoc = await (Product as any).findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, upsert: true }
    ).lean();

    const mapped = mapProductToServiceItem(updatedDoc);

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
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const isObjectId = typeof id === "string" && Boolean(id.match(/^[0-9a-fA-F]{24}$/));
    const filter = isObjectId ? { $or: [{ productId: id }, { _id: id }] } : { productId: id };

    await (Product as any).deleteOne(filter);

    return NextResponse.json({
      success: true,
      message: "Product card deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
