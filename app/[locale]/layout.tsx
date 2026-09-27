import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Locale } from "@/types";

export default async function LocalizedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale === "bn" ? "bn" : "en") as Locale;

  return (
    <AuthProvider>
      <LanguageProvider initialLocale={locale}>
        <CartProvider>
          {children}
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
