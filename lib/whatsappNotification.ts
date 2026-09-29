/**
 * Automated WhatsApp Admin Notification Utility for DigiVibe Enterprise Platform
 */

export interface OrderNotificationPayload {
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  items?: Array<{ title: string; quantity?: number; price?: number }>;
  totalAmount: number;
  paymentMethod: string;
  trxId: string;
  status?: string;
}

// Configured Admin WhatsApp Contact Numbers (International format with country code)
export const ADMIN_WHATSAPP_NUMBERS = [
  { label: "Main Admin", phone: "8801990800188", display: "+8801990800188" },
  { label: "Secondary Admin", phone: "8801302271472", display: "+8801302271472" }
];

/**
 * Generates formatted WhatsApp text message for an order
 */
export function formatOrderWhatsAppMessage(order: OrderNotificationPayload): string {
  const itemSummary = order.items && order.items.length > 0
    ? order.items.map((i) => `${i.title}${i.quantity ? ` (x${i.quantity})` : ""}`).join(", ")
    : "Digital Service";

  return `🚨 *NEW ORDER ALERT - DIGIVIBE* 🚨

📦 *Order ID:* #${order.orderId}
👤 *Customer Email:* ${order.customerEmail}
📞 *Customer Mobile/WhatsApp:* ${order.customerPhone || "N/A"}
🛍️ *Purchased Product:* ${itemSummary}
💳 *Payment Method:* ${order.paymentMethod}
🔑 *TrxID:* ${order.trxId}
💰 *Total Amount:* ৳${order.totalAmount} BDT
⏳ *Status:* ${order.status || "Pending Admin Approval"}

⚡ *Action Required:* Please review & approve in Admin Dashboard!`;
}

/**
 * Generates direct click-to-chat WhatsApp link for primary admin
 */
export function getAdminWhatsAppLink(order: OrderNotificationPayload, targetPhone = "8801990800188"): string {
  const message = formatOrderWhatsAppMessage(order);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Triggers automated real-time WhatsApp notification to target admin numbers.
 * Dispatches HTTP API payloads concurrently to both +8801990800188 and +8801302271472.
 * Supports UltraMsg, Green API, Twilio, and standard HTTP WhatsApp API Gateways.
 */
export async function sendAdminWhatsAppNotification(order: OrderNotificationPayload) {
  const message = formatOrderWhatsAppMessage(order);
  const primaryLink = getAdminWhatsAppLink(order, ADMIN_WHATSAPP_NUMBERS[0].phone);
  const secondaryLink = getAdminWhatsAppLink(order, ADMIN_WHATSAPP_NUMBERS[1].phone);

  console.log(`\n======================================================`);
  console.log(`📲 [REAL-TIME WHATSAPP ADMIN NOTIFICATION TRIGGERED]`);
  console.log(`📦 Order #${order.orderId} placed for ৳${order.totalAmount} BDT`);
  console.log(`------------------------------------------------------`);
  console.log(message);
  console.log(`------------------------------------------------------`);
  console.log(`🔗 Admin WhatsApp Deep Link (Main +8801990800188): ${primaryLink}`);
  console.log(`🔗 Admin WhatsApp Deep Link (Alt  +8801302271472): ${secondaryLink}`);
  console.log(`======================================================\n`);

  const whatsappApiUrl = process.env.WHATSAPP_API_URL || process.env.WHATSAPP_GATEWAY_URL;
  const whatsappToken = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_TOKEN || process.env.ULTRAMSG_TOKEN;
  const instanceId = process.env.WHATSAPP_INSTANCE_ID || process.env.ULTRAMSG_INSTANCE_ID || process.env.GREEN_API_INSTANCE_ID;
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "+14155238886";

  // Dispatch real-time WhatsApp notifications concurrently to both target admin numbers
  const dispatchPromises = ADMIN_WHATSAPP_NUMBERS.map(async (admin) => {
    // 1. Twilio Integration Fallback
    if (twilioAccountSid && twilioAuthToken) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const bodyParams = new URLSearchParams({
          To: `whatsapp:+${admin.phone}`,
          From: `whatsapp:${twilioFromNumber.startsWith("+") ? twilioFromNumber : `+${twilioFromNumber}`}`,
          Body: message
        });

        const res = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64")}`
          },
          body: bodyParams.toString()
        });

        if (res.ok) {
          console.log(`✅ [Twilio WhatsApp] Delivered to ${admin.display} for Order #${order.orderId}`);
          return { provider: "Twilio", phone: admin.phone, status: "delivered", success: true };
        }
      } catch (err: any) {
        console.error(`⚠️ [Twilio WhatsApp] Error for ${admin.display}:`, err.message);
      }
    }

    // 2. UltraMsg Integration
    if (whatsappApiUrl?.includes("ultramsg.com") || (instanceId && whatsappToken && !whatsappApiUrl)) {
      try {
        const ultraEndpoint = whatsappApiUrl || `https://api.ultramsg.com/${instanceId}/messages/chat`;
        const res = await fetch(ultraEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            token: whatsappToken || "",
            to: `+${admin.phone}`,
            body: message
          }).toString()
        });

        if (res.ok) {
          console.log(`✅ [UltraMsg WhatsApp] Delivered to ${admin.display} for Order #${order.orderId}`);
          return { provider: "UltraMsg", phone: admin.phone, status: "delivered", success: true };
        }
      } catch (err: any) {
        console.error(`⚠️ [UltraMsg WhatsApp] Error for ${admin.display}:`, err.message);
      }
    }

    // 3. Generic WhatsApp Gateway / Webhook Integration
    if (whatsappApiUrl) {
      try {
        let endpoint = whatsappApiUrl;
        if (instanceId && !endpoint.includes(instanceId)) {
          endpoint = `${whatsappApiUrl.replace(/\/$/, "")}/${instanceId}/sendMessage`;
        }

        const payload = {
          phone: admin.phone,
          to: admin.phone,
          chatId: `${admin.phone}@c.us`,
          message: message,
          body: message,
          orderId: order.orderId
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(whatsappToken ? { Authorization: `Bearer ${whatsappToken}`, "X-Api-Key": whatsappToken } : {})
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          console.log(`✅ [WhatsApp Gateway] Message sent to ${admin.display} for Order #${order.orderId}`);
          return { provider: "GenericGateway", phone: admin.phone, status: "delivered", success: true };
        } else {
          const errText = await res.text();
          console.error(`⚠️ [WhatsApp Gateway] HTTP ${res.status} for ${admin.display}: ${errText}`);
          return { provider: "GenericGateway", phone: admin.phone, status: "failed", error: errText };
        }
      } catch (err: any) {
        console.error(`⚠️ [WhatsApp Gateway] Dispatch error for ${admin.display}:`, err.message);
        return { provider: "GenericGateway", phone: admin.phone, status: "error", error: err.message };
      }
    }

    // Default fallback when external SMS/WhatsApp API gateway URL is not configured: Log deep link
    return {
      provider: "ConsoleLogger",
      phone: admin.phone,
      status: "logged_deep_link",
      deepLink: getAdminWhatsAppLink(order, admin.phone)
    };
  });

  const dispatchResults = await Promise.allSettled(dispatchPromises);

  return {
    success: true,
    messageFormatted: message,
    primaryLink,
    secondaryLink,
    dispatchResults
  };
}
