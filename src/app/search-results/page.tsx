import type { Metadata } from "next"
import { ExternalLink, Search } from "lucide-react"

import rawData from "@/data/google-search.json"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "תוצאות חיפוש בגוגל | למיס קוסמטיקס",
  description: "תוצאות אורגניות מגוגל שחולצו עם Apify",
}

type OrganicResult = {
  position?: number
  title?: string
  url?: string
  displayedUrl?: string
  websiteTitle?: string
  description?: string
}

type SearchPage = {
  searchQuery?: { term?: string; page?: number }
  organicResults?: OrganicResult[]
}

// הקובץ של Apify יכול להגיע כמערך של עמודי חיפוש או כעמוד בודד
const pages: SearchPage[] = Array.isArray(rawData) ? rawData : [rawData as SearchPage]

// מזהים תוצאות של העסק עצמו כדי להדגיש אותן
const OWN_MARKERS = ["lamis_cosmatics", "lamiscosmatics", "lamis-cosmetics"]

function isOwn(r: OrganicResult) {
  const text = `${r.url ?? ""} ${r.websiteTitle ?? ""}`.toLowerCase()
  return OWN_MARKERS.some((m) => text.includes(m))
}

// גוגל מקצר תיאורים ומוסיף "Read more" בסוף
function cleanDescription(d?: string) {
  const text = (d ?? "").replace(/\s*Read more$/i, "").trim()
  return text
}

function hostname(url?: string) {
  if (!url) return ""
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export default function SearchResultsPage() {
  const total = pages.reduce((sum, p) => sum + (p.organicResults?.length ?? 0), 0)
  const ownCount = pages.reduce(
    (sum, p) => sum + (p.organicResults ?? []).filter(isOwn).length,
    0,
  )

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">למיס קוסמטיקס</p>
        <h1 className="text-3xl font-bold tracking-tight">תוצאות חיפוש בגוגל</h1>
        <p className="mt-1 text-muted-foreground">
          {total} תוצאות אורגניות ב-{pages.length} חיפושים, מתוך הקובץ שחולץ עם Apify
        </p>
        {ownCount > 0 && (
          <p className="mt-3 text-sm">
            <Badge className="me-2">שלך</Badge>
            {ownCount === 1 ? "תוצאה אחת שלך מופיעה" : `${ownCount} תוצאות שלך מופיעות`} ברשימה
          </p>
        )}
      </header>

      {total === 0 && (
        <p className="text-muted-foreground">לא נמצאו תוצאות אורגניות בקובץ.</p>
      )}

      {pages.map((page, i) => {
        const results = page.organicResults ?? []
        if (results.length === 0) return null
        return (
          <section key={i} className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{page.searchQuery?.term ?? "חיפוש"}</h2>
              {page.searchQuery?.page && (
                <Badge variant="secondary">עמוד {page.searchQuery.page}</Badge>
              )}
            </div>

            <ol className="grid gap-4">
              {results.map((r, j) => {
                const own = isOwn(r)
                const description = cleanDescription(r.description)
                return (
                <li key={r.url ?? j}>
                  <Card className={own ? "border-primary ring-2 ring-primary/30" : undefined}>
                    <CardHeader>
                      <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{r.position ?? j + 1}</Badge>
                        {own && <Badge>שלך</Badge>}
                        <span dir="auto" className="truncate">
                          {r.websiteTitle ?? hostname(r.url)}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-snug">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1.5 text-primary hover:underline"
                          >
                            {r.title ?? r.url}
                            <ExternalLink className="mt-1 size-4 shrink-0" />
                          </a>
                        ) : (
                          r.title
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">
                        {description || <span className="italic">אין תיאור בתוצאה הזו</span>}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
