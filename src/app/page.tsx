"use client"

import * as React from "react"
import { ShoppingBag } from "lucide-react"

import { ProductCard, type Product } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"

// נתוני דוגמה בלבד. מחליפים במוצרים ובמחירים האמיתיים
const products: Product[] = [
  {
    id: "keratin-mask",
    name: "מסכת קרטין לשיקום שיער פגום",
    brand: "Lemis Pro",
    description: "מסכה עשירה לשיער צבוע ומוחלק. מחזירה רכות וברק כבר מהשימוש הראשון.",
    price: 89,
    oldPrice: 110,
    volume: "500 מ״ל",
    rating: 4.8,
    reviews: 124,
    tags: ["שיער צבוע", "ללא מלחים"],
    label: "מבצע",
    professional: true,
  },
  {
    id: "argan-oil",
    name: "שמן ארגן לברק וטיפוח קצוות",
    brand: "Lemis Pro",
    description: "כמה טיפות על שיער לח או יבש. מפחית קרזול ומגן מחום הפן.",
    price: 65,
    volume: "100 מ״ל",
    rating: 4.6,
    reviews: 87,
    tags: ["כל סוגי השיער", "הגנה מחום"],
    label: "רב מכר",
  },
  {
    id: "silver-shampoo",
    name: "שמפו סגול לנטרול גוונים צהובים",
    brand: "Lemis Color",
    description: "לבלונד, לגוונים ולשיער אפור. שומר על גוון קר ונקי בין צביעה לצביעה.",
    price: 72,
    volume: "1 ליטר",
    rating: 4.4,
    reviews: 53,
    tags: ["בלונד", "גוונים"],
    label: "חדש",
    inStock: false,
    professional: true,
  },
]

export default function Home() {
  const [cartCount, setCartCount] = React.useState(0)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">למיס קוסמטיקס</p>
          <h1 className="text-3xl font-bold tracking-tight">מוצרים מקצועיים למספרה</h1>
          <p className="mt-1 text-muted-foreground">כרטיס מוצר לדוגמה, בנוי עם ספריית העיצוב shadcn/ui</p>
        </div>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
          <ShoppingBag className="size-4" />
          {cartCount} פריטים בהזמנה
        </Badge>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(_, qty) => setCartCount((c) => c + qty)}
          />
        ))}
      </section>
    </main>
  )
}
