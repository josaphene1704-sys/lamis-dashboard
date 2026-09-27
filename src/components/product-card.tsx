"use client"

import * as React from "react"
import {
  Check,
  Droplets,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type Product = {
  id: string
  name: string
  brand: string
  description: string
  price: number
  /** מחיר לפני הנחה, אם יש מבצע */
  oldPrice?: number
  volume: string
  rating: number
  reviews: number
  /** נתיב לתמונה (למשל /products/mask.jpg). בלי תמונה מוצג רקע מעוצב */
  image?: string
  tags?: string[]
  label?: "חדש" | "מבצע" | "רב מכר"
  inStock?: boolean
  /** לשימוש מקצועי במספרה בלבד */
  professional?: boolean
}

type ProductCardProps = {
  product: Product
  onAddToCart?: (product: Product, quantity: number) => void
  className?: string
}

const priceFormat = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
})

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const [quantity, setQuantity] = React.useState(1)
  const [favorite, setFavorite] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const inStock = product.inStock ?? true

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  function handleAdd() {
    onAddToCart?.(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Card
      className={cn(
        "group gap-4 overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* תמונה */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary via-accent to-muted">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Droplets className="size-16 text-primary/40 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {product.label && (
              <Badge className={cn(product.label === "מבצע" && "bg-destructive text-white")}>
                {product.label === "רב מכר" && <Sparkles />}
                {product.label}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="secondary">{discount}% הנחה</Badge>
            )}
          </div>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={favorite ? "הסרה מהמועדפים" : "הוספה למועדפים"}
            aria-pressed={favorite}
            onClick={() => setFavorite((f) => !f)}
            className="rounded-full bg-card/90 backdrop-blur"
          >
            <Heart className={cn("transition-colors", favorite && "fill-primary text-primary")} />
          </Button>
        </div>

        {product.professional && (
          <span className="absolute bottom-3 start-3 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background">
            לשימוש מקצועי
          </span>
        )}
      </div>

      {/* פרטים */}
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wide">{product.brand}</span>
          <span>{product.volume}</span>
        </div>
        <CardTitle className="text-lg leading-snug">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
        <div className="flex items-center gap-1.5 text-sm">
          <div className="flex" aria-label={`דירוג ${product.rating} מתוך 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < Math.round(product.rating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {priceFormat.format(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {priceFormat.format(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="size-3.5" />
          {inStock ? "במלאי, משלוח למספרה תוך 2 ימי עסקים" : "אזל מהמלאי כרגע"}
        </p>
      </CardContent>

      {/* פעולות */}
      <CardFooter className="mt-auto gap-2">
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="הוספת יחידה"
            disabled={!inStock}
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus />
          </Button>
          <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="הורדת יחידה"
            disabled={!inStock || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus />
          </Button>
        </div>
        <Button
          type="button"
          className="flex-1"
          disabled={!inStock}
          onClick={handleAdd}
        >
          {added ? <Check /> : <ShoppingBag />}
          {!inStock ? "אזל מהמלאי" : added ? "נוסף להזמנה" : "הוספה להזמנה"}
        </Button>
      </CardFooter>
    </Card>
  )
}
