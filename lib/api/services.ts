import { OrderPayload, OrderResponse, User } from "@/types";

const NODE_AUTH_SERVICE = process.env.NEXT_PUBLIC_NODE_AUTH_URL || "http://localhost:5000/api/auth";
const NODE_USER_SERVICE = process.env.NEXT_PUBLIC_NODE_USER_URL || "http://localhost:5000/api/user";
const NODE_ORDER_SERVICE = process.env.NEXT_PUBLIC_NODE_ORDER_URL || "http://localhost:5000/api/orders";

/**
 * Fetch Current User Profile directly from MongoDB Atlas
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
    console.error("Could not fetch user profile from MongoDB Atlas:", err);
  }
  return null;
}

/**
 * Fetch Real User Assets directly from MongoDB Atlas
 */
export async function apiFetchUserAssets(email: string): Promise<any[]> {
  try {
    const res = await fetch(`${NODE_USER_SERVICE}/assets?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.assets || [];
    }
  } catch (err) {
    console.error("Could not fetch user assets from MongoDB Atlas:", err);
  }
  return [];
}

/**
 * Fetch Real User Orders directly from MongoDB Atlas
 */
export async function apiFetchUserOrders(email: string): Promise<any[]> {
  try {
    const res = await fetch(`${NODE_USER_SERVICE}/orders?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (err) {
    console.error("Could not fetch user orders from MongoDB Atlas:", err);
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
      }
      return data;
    }
    return { success: false, message: data.message || "Invalid OTP code." };
  } catch (err) {
    console.error("Error verifying OTP against database:", err);
  }

  return { success: false, message: "Invalid OTP or backend unavailable." };
}

/**
 * Step 1 Login - Triggers Real Email OTP
 */
export async function apiLogin(email: string, pass: string): Promise<{ success: boolean; requiresOtp: boolean; message: string; demoOtp?: string }> {
  try {
    const res = await fetch(`${NODE_AUTH_SERVICE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    return { success: false, requiresOtp: false, message: errData.message || "Login failed." };
  } catch (err) {
    console.error("Error calling login microservice:", err);
  }

  return {
    success: false,
    requiresOtp: false,
    message: "Login service offline.",
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
 * Order Processing Integration (Saves Real Order & Assets to MongoDB Atlas)
 */
export async function apiProcessOrder(payload: OrderPayload): Promise<OrderResponse> {
  try {
    const savedUserStr = localStorage.getItem("digivibe_user");
    let userEmail = payload.customerEmail;
    if (savedUserStr) {
      const parsed = JSON.parse(savedUserStr);
      userEmail = parsed.email || userEmail;
    }

    const orderRes = await fetch(`${NODE_ORDER_SERVICE}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userEmail }),
    });

    if (orderRes.ok) {
      return await orderRes.json();
    }
  } catch (err) {
    console.error("Error processing order in database:", err);
  }

  return {
    success: false,
    orderId: "DV-000000",
    message: "Failed to save order to database.",
    fulfillmentStatus: "processing",
    estimatedFulfillmentTime: "N/A",
  };
}

