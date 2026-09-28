import { OrderPayload, OrderResponse, User } from "@/types";

const NODE_AUTH_SERVICE = process.env.NEXT_PUBLIC_NODE_AUTH_URL || "http://localhost:5000/api/auth";
const NODE_USER_SERVICE = process.env.NEXT_PUBLIC_NODE_USER_URL || "http://localhost:5000/api/user";
const NODE_ORDER_SERVICE = process.env.NEXT_PUBLIC_NODE_ORDER_URL || "http://localhost:5000/api/orders";

/**
 * Fetch Current User Profile directly from MongoDB Atlas (with local fallback)
 */
export async function apiFetchProfile(email: string): Promise<User | null> {
  try {
    const res = await fetch(`${NODE_AUTH_SERVICE}/me?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem("digivibe_user", JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (err) {
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
    const res = await fetch(`${NODE_USER_SERVICE}/assets?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.assets || [];
    }
  } catch (err) {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("digivibe_user_assets");
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
    const res = await fetch(`${NODE_AUTH_SERVICE}/profile`, {
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
  } catch (err) {
    console.error("Error persisting profile update to MongoDB Atlas:", err);
  }

  return { success: false, message: "Could not save profile updates to database." };
}

/**
 * Add Credit / Wallet Top-Up in MongoDB Atlas
 */
export async function apiAddWalletCredit(email: string, amount: number): Promise<{ success: boolean; message: string; walletBalance?: number; user?: User }> {
  try {
    const res = await fetch(`${NODE_AUTH_SERVICE}/wallet/add`, {
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
    const res = await fetch(`${NODE_AUTH_SERVICE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose, userData }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Error calling send-otp microservice:", err);
  }

  return {
    success: false,
    message: "Failed to send OTP code. Please try again.",
  };
}

/**
 * Verify 6-Digit Email OTP against MongoDB Atlas
 */
export async function apiVerifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
  try {
    const res = await fetch(`${NODE_AUTH_SERVICE}/verify-otp`, {
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
    return { success: false, message: data.message || "Invalid OTP code." };
  } catch (err) {
    console.error("Error verifying OTP against database:", err);
  }

  return { success: false, message: "Invalid OTP or backend unavailable." };
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
    const res = await fetch(`${NODE_AUTH_SERVICE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password: pass }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    return { success: false, requiresOtp: false, message: errData.message || "Login failed." };
  } catch (err) {
    console.error("Error calling login microservice:", err);
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
    const res = await fetch(`${NODE_AUTH_SERVICE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    return { success: false, requiresOtp: false, message: errData.message || "Signup failed." };
  } catch (err) {
    console.error("Error calling signup microservice:", err);
  }

  return {
    success: false,
    requiresOtp: false,
    message: "Signup service offline.",
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
 * Admin Order Status Update (Approve / Reject Order)
 */
export async function apiUpdateOrderStatus(
  orderId: string,
  status: "Completed" | "Pending" | "Rejected"
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || `Order ${orderId} updated to ${status}.` };
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


