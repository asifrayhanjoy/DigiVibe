import { OrderPayload, OrderResponse, User } from "@/types";

const NODE_AUTH_SERVICE = process.env.NEXT_PUBLIC_NODE_AUTH_URL || "";
const NODE_USER_SERVICE = process.env.NEXT_PUBLIC_NODE_USER_URL || "";
const NODE_ORDER_SERVICE = process.env.NEXT_PUBLIC_NODE_ORDER_URL || "";

/**
 * Fetch Current User Profile directly from MongoDB Atlas (with local fallback)
 */
export async function apiFetchProfile(email: string): Promise<User | null> {
  try {
    const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem("digivibe_user", JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (err) {
    if (NODE_AUTH_SERVICE) {
      try {
        const res = await fetch(`${NODE_AUTH_SERVICE}/me?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem("digivibe_user", JSON.stringify(data.user));
            return data.user;
          }
        }
      } catch (e) {}
    }
    // Graceful offline/local fallback
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("digivibe_user");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
  }
  return null;
}

/**
 * Fetch Real User Assets directly from MongoDB Atlas (with local fallback)
 */
export async function apiFetchUserAssets(email: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/assets?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.assets && Array.isArray(data.assets)) {
        return data.assets;
      }
    }
  } catch (err) {
    console.error("Error fetching assets from /api/assets:", err);
  }

  try {
    if (NODE_USER_SERVICE) {
      const res = await fetch(`${NODE_USER_SERVICE}/assets?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        return data.assets || [];
      }
    }
  } catch (err) {}

  return [];
}

/**
 * Fetch Real User Orders directly from MongoDB Atlas (with local fallback)
 */
export async function apiFetchUserOrders(email: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (err) {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("digivibe_user_orders");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
  }
  return [];
}

/**
 * Update Profile details & Persist directly to MongoDB Atlas
 */
export async function apiUpdateProfile(profileData: {
  email: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  avatar?: string;
}): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const authUrl = NODE_AUTH_SERVICE || "/api/auth";
    const res = await fetch(`${authUrl}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.user) {
        localStorage.setItem("digivibe_user", JSON.stringify(data.user));
      }
      return data;
    }
    return { success: false, message: data.message || "Failed to update profile." };
  } catch (err: any) {
    console.error("Error persisting profile update to MongoDB Atlas:", err);
    return { success: false, message: `Could not save profile updates: ${err?.message || "Server error"}` };
  }
}

/**
 * Add Credit / Wallet Top-Up in MongoDB Atlas
 */
export async function apiAddWalletCredit(email: string, amount: number): Promise<{ success: boolean; message: string; walletBalance?: number; user?: User }> {
  try {
    const authUrl = NODE_AUTH_SERVICE || "/api/auth";
    const res = await fetch(`${authUrl}/wallet/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        const saved = localStorage.getItem("digivibe_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.walletBalance = data.walletBalance;
          localStorage.setItem("digivibe_user", JSON.stringify(parsed));
        }
      }
      return data;
    }
  } catch (err) {
    console.error("Error adding wallet credit in MongoDB Atlas:", err);
  }

  return { success: false, message: "Failed to top-up wallet in database." };
}

/**
 * Send Email OTP Request via Nodemailer & MongoDB Atlas
 */
export async function apiSendOtp(email: string, purpose: "login" | "signup", userData?: any): Promise<{ success: boolean; message: string; demoOtp?: string }> {
  try {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose, userData }),
    });
    const data = await res.json();
    if (data && (res.ok || data.message)) {
      return data;
    }
  } catch (err: any) {
    console.error("Error sending OTP via API route:", err);
    if (NODE_AUTH_SERVICE) {
      try {
        const res = await fetch(`${NODE_AUTH_SERVICE}/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, purpose, userData }),
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
  }

  return {
    success: false,
    message: "Failed to send OTP code. Please check your network or database connection.",
  };
}

/**
 * Verify 6-Digit Email OTP against MongoDB Atlas
 */
export async function apiVerifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem("digivibe_user", JSON.stringify(data.user));
        localStorage.setItem("digivibe_token", data.token);
        localStorage.setItem("digivibe_user_email", email.toLowerCase());
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `digivibe_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return data;
    }
    if (data && data.message) {
      return { success: false, message: data.message };
    }
  } catch (err: any) {
    console.error("Error verifying OTP against database:", err);
    if (NODE_AUTH_SERVICE) {
      try {
        const res = await fetch(`${NODE_AUTH_SERVICE}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
  }

  return { success: false, message: "Invalid OTP or authentication server error." };
}

export async function apiLogin(email: string, pass: string): Promise<{ success: boolean; requiresOtp: boolean; message: string; user?: User; token?: string; demoOtp?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Hardcoded Admin Access Verification Rule
  if (normalizedEmail === "mdasifrayhanjoy2@gmail.com" && pass === "@@@123@@@") {
    const adminUser: User = {
      id: "admin-master-001",
      name: "Md Asif Rayhan Joy (Admin)",
      email: "mdasifrayhanjoy2@gmail.com",
      phone: "01302271472",
      role: "admin",
      walletBalance: 99999,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      createdAt: new Date().toISOString()
    };
    const adminToken = "admin_master_token_digivibe_2026";
    localStorage.setItem("digivibe_user", JSON.stringify(adminUser));
    localStorage.setItem("digivibe_token", adminToken);
    localStorage.setItem("digivibe_user_email", normalizedEmail);
    document.cookie = `token=${adminToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `digivibe_token=${adminToken}; path=/; max-age=604800; SameSite=Lax`;

    return {
      success: true,
      requiresOtp: false,
      message: "Admin Authentication Granted! Welcome Md Asif Rayhan Joy.",
      user: adminUser,
      token: adminToken
    };
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password: pass }),
    });
    const data = await res.json();
    if (data && (res.ok || data.message)) {
      if (data.user && data.token) {
        localStorage.setItem("digivibe_user", JSON.stringify(data.user));
        localStorage.setItem("digivibe_token", data.token);
        localStorage.setItem("digivibe_user_email", normalizedEmail);
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `digivibe_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return data;
    }
  } catch (err: any) {
    console.error("Error calling login API route:", err);
  }

  // Fallback regular user login if backend offline
  const fallbackUser: User = {
    id: "user-" + Date.now(),
    name: normalizedEmail.split("@")[0],
    email: normalizedEmail,
    role: "customer",
    walletBalance: 0,
    createdAt: new Date().toISOString()
  };
  const userToken = "token_" + Date.now();
  localStorage.setItem("digivibe_user", JSON.stringify(fallbackUser));
  localStorage.setItem("digivibe_token", userToken);
  localStorage.setItem("digivibe_user_email", normalizedEmail);

  return {
    success: true,
    requiresOtp: false,
    message: "Login successful.",
    user: fallbackUser,
    token: userToken
  };
}

/**
 * Step 1 Signup - Triggers Real Email OTP
 */
export async function apiSignup(name: string, email: string, pass: string, phone: string): Promise<{ success: boolean; requiresOtp: boolean; message: string; demoOtp?: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone }),
    });
    const data = await res.json();
    if (data && (res.ok || data.message)) {
      return data;
    }
  } catch (err: any) {
    console.error("Error calling signup API route:", err);
    if (NODE_AUTH_SERVICE) {
      try {
        const res = await fetch(`${NODE_AUTH_SERVICE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password: pass, phone }),
        });
        const errData = await res.json();
        return errData;
      } catch (e) {}
    }
  }

  return {
    success: false,
    requiresOtp: false,
    message: "Registration server error. Please verify your internet connection and database setup.",
  };
}

/**
 * Order Processing Integration (Saves Real Order directly to MongoDB Atlas)
 */
export async function apiProcessOrder(payload: OrderPayload): Promise<OrderResponse> {
  try {
    let userEmail = payload.customerEmail;
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("digivibe_user");
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          userEmail = parsed.email || userEmail;
        } catch (e) {}
      }
    }

    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userEmail }),
    });

    if (orderRes.ok) {
      const data = await orderRes.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("digivibe_order_created", { detail: data.order }));
      }
      return {
        success: data.success ?? true,
        orderId: data.orderId || "DV-000000",
        message: data.message || "Order saved to database.",
        fulfillmentStatus: data.fulfillmentStatus || "pending",
        estimatedFulfillmentTime: data.estimatedFulfillmentTime || "Pending Admin Approval",
        data: data.order,
      };
    }
  } catch (err) {
    console.error("Error processing order in database:", err);
  }

  return {
    success: false,
    orderId: "DV-000000",
    message: "Failed to save order to database.",
    fulfillmentStatus: "pending",
    estimatedFulfillmentTime: "N/A",
  };
}

/**
 * Fetch All Orders for Admin directly from MongoDB Atlas
 */
export async function apiFetchAllOrders(): Promise<any[]> {
  try {
    const res = await fetch("/api/orders?admin=true");
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (err) {
    console.error("Error fetching admin orders from MongoDB Atlas:", err);
  }
  return [];
}

/**
 * Admin Order Status Update (Approve / Reject Order with Custom Instructions & Files)
 */
export async function apiUpdateOrderStatus(
  orderId: string,
  status: "Completed" | "Pending" | "Rejected",
  deliveryNotes?: string,
  deliveryFiles?: any[],
  customCredentials?: string
): Promise<{ success: boolean; message: string; order?: any }> {
  try {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, deliveryNotes, deliveryFiles, customCredentials }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || `Order ${orderId} updated to ${status}.`, order: data.order };
    }
  } catch (err) {
    console.error("Error updating order status in MongoDB Atlas:", err);
  }

  return { success: false, message: `Failed to update order ${orderId} status.` };
}

/**
 * Admin Delete Order from MongoDB Atlas
 */
export async function apiDeleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || `Order ${orderId} deleted.` };
    }
  } catch (err) {
    console.error("Error deleting order from MongoDB Atlas:", err);
  }

  return { success: false, message: `Failed to delete order ${orderId}.` };
}

/**
 * Mark notification as read in MongoDB Atlas
 */
export async function apiMarkNotificationRead(orderId: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", orderId }),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (err) {
    console.error("Error marking notification read in MongoDB Atlas:", err);
  }
  return { success: false };
}

/**
 * Mark all pending notifications as read in MongoDB Atlas
 */
export async function apiMarkAllNotificationsRead(): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (err) {
    console.error("Error marking all notifications read in MongoDB Atlas:", err);
  }
  return { success: false };
}

/**
 * Fetch All Today's Updates from MongoDB Atlas
 */
export async function apiFetchUpdates(): Promise<any[]> {
  try {
    const res = await fetch("/api/updates");
    if (res.ok) {
      const data = await res.json();
      return data.updates || [];
    }
  } catch (err) {
    console.error("Error fetching updates from MongoDB Atlas:", err);
  }
  return [];
}

/**
 * Create New Today's Update in MongoDB Atlas (Admin)
 */
export async function apiCreateUpdate(payload: {
  title: string;
  description: string;
  category?: string;
  bannerImage?: string;
  badgeText?: string;
  cards?: any[];
  files?: any[];
  isPinned?: boolean;
  author?: string;
}): Promise<{ success: boolean; message: string; update?: any }> {
  try {
    const res = await fetch("/api/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || "Update published successfully!", update: data.update };
    }
    return { success: false, message: data.message || "Failed to create update." };
  } catch (err: any) {
    console.error("Error publishing update to MongoDB Atlas:", err);
    return { success: false, message: err.message || "Failed to publish update." };
  }
}

/**
 * Delete Today's Update Entry from MongoDB Atlas (Admin)
 */
export async function apiDeleteUpdate(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/updates?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || "Update entry deleted." };
    }
    return { success: false, message: data.message || "Failed to delete update." };
  } catch (err: any) {
    console.error("Error deleting update entry from MongoDB Atlas:", err);
    return { success: false, message: err.message || "Failed to delete update entry." };
  }
}

/**
 * Upload binary file, image or archive (.zip, .apk, .pdf, .ovpn) directly to Cloudinary
 */
export async function apiUploadToCloudinary(
  fileDataUrl: string,
  filename?: string,
  folder: string = "digivibe_assets"
): Promise<{ success: boolean; url?: string; public_id?: string; message?: string }> {
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: fileDataUrl, filename, folder }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, url: data.url, public_id: data.public_id, message: data.message };
    }
    return { success: false, message: data.message || "Cloudinary upload failed." };
  } catch (err: any) {
    console.error("Error uploading to Cloudinary:", err);
    return { success: false, message: err.message || "Cloudinary upload error." };
  }
}


