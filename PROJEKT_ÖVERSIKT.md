# News Gamma - Projektöversikt

## Teknisk Stack och Arkitektur

### Frontend

- **Next.js 15.5.4** (App Router med Turbopack)
- **React 19.1.0** med TypeScript 5
- **Tailwind CSS 4** med custom animations
- **Radix UI** - Tillgängliga UI-komponenter
- **Embla Carousel** - Karusellkomponenter
- **Lucide React** - Ikonsystem
- **Next Themes** - Dark/Light mode-hantering

### Backend & Databashantering

- **Prisma 6.18.0** - ORM med PostgreSQL
- **Better Auth 1.3.27** - Modern autentiseringslösning med Prisma-adapter
- **Server Actions** - Next.js server-side funktionalitet för all backend-logik
- **Nodemailer 7.0.10** - E-posthantering
- **Zod 4.1.12** - Runtime-validering och typsäkerhet

### Betalningar & Prenumerationer

- **Stripe 19.1.0** - Betalningshantering
- **Better Auth Stripe Plugin** - Integration för prenumerationshantering

### AI & Innehållsgenerering

- **AI SDK 5.0.80** (Vercel)
- **Google AI SDK 2.0.23** - Gemini 2.5 Flash integration
- **MDXEditor 3.48.0** - Rich text editor för artikelinnehåll

### Externa API:er

- **Spotprices API** (lexlink.se/espot) - Elpriser för Sverige (SE1-SE4)
- **SMHI API** - Väderdata

### Utvecklingsverktyg

- **ESLint 9** med Next.js-konfiguration
- **PostCSS** med Tailwind
- **TypeScript** - Strikt typning genom hela projektet

## Arkitektur och Design Patterns

### Server Actions

Projektet använder genomgående **Server Actions** för all backend-logik:

- Alla filer i `src/lib/actions/` markerade med `"use server"`
- Typsäker kommunikation mellan klient och server
- Optimerad prestanda med automatisk caching

**Exempel på Server Actions:**

- `admin.ts` - Administratörsoperationer
- `category.ts` - Kategorihantering
- `comment.ts` - Kommentarsfunktionalitet
- `contact-actions.ts` - Kontaktformulär
- `email-actions.ts` - E-postverifiering
- `mail.ts` - E-postutskick med Nodemailer
- `profile.ts` - Användarprofilhantering
- `weather.ts` - Väderdata
- `weather-location.ts` - Lokaliseringsfunktioner

### Autentisering & Auktorisering

- **Better Auth** med custom plugin för Stripe
- E-postverifiering vid registrering
- Rollbaserad åtkomstkontroll (Admin, Editor, User)
- Sessionshantering med säker token-lagring

### Databasmodeller (Prisma)

```prisma
- Article (med premium & editorsChoice flaggor)
- Category (med showInNavbar konfiguration)
- User (med roller, Stripe-integration)
- Comment
- Order & OrderItem
- Session & Account
- PasswordResetToken
```

## Teammedlemmar och Bidrag

### Magui

**Backend & Betalningsintegration**

- **CRUD-funktionalitet** för artiklar och kategorier

  - Skapa, redigera, ta bort artiklar via admin-panel
  - Kategorihantering med dynamisk navbar-visning
  - Server Actions för alla CRUD-operationer

- **Prenumerationsstatistik och Dashboard**

  - Implementerat admin-dashboard med datavisualisering
  - Komponenter: BarChart, LineGraph, DashboardCard, GoalDataCard
  - Statistik över användare, artiklar och prenumerationer

- **Stripe-integration**

  - Better Auth Stripe-plugin för prenumerationshantering
  - Betalflödeshantering och subscription-status
  - Webhook-hantering för betalningsbekräftelser

- **Cookie Banner**

  - GDPR-kompatibel cookie-consent komponent
  - LocalStorage-hantering för användarpreferenser
  - Anpassningsbara varianter (default, small, mini)

- **Rollbaserad åtkomstkontroll i Admin**
  - Implementerat middleware för admin/editor-åtkomst
  - Skyddade routes med `requireAdmin()` och `requireAdminOrEditor()`
  - RoleSelect-komponent för användarhantering

---

### Ahmed

**AI-integration & Externt API-arbete**

- **Elpris-API Integration**

  - Server-side funktionalitet för att hämta spotpriser från lexlink.se
  - Datavisualisering för alla svenska elområden (SE1-SE4)
  - SpotChart-komponent med Recharts
  - Typsäker implementation med custom TypeScript-typer

- **Gemini AI för Artikelgenerering**

  - Integration med Google AI SDK (Gemini 2.5 Flash)
  - AI-driven artikelgenerering via `/admin/artiklar-ai`
  - Automatisk generering av rubrik, sammanfattning och innehåll
  - Google Search-integration för aktuell information
  - Structured output med Zod-validering

- **MDX Editor-implementation**
  - MDXEditor för rich text-redigering av artiklar
  - Markdown-stöd för formatering av sammanfattningar och innehåll
  - Integration i både AI-generering och manuell artikelskapande
  - Referensbaserad hantering för realtidsuppdateringar

---

### Johan

**E-postfunktionalitet & Verifiering**

- **Better Auth E-postverifiering**

  - Implementerat e-postverifiering vid registrering
  - Integrating med Nodemailer för e-postutskick
  - Custom email templates för verifieringslänkar
  - Säker token-generering och validering
  - Återskicka verifieringsmail-funktionalitet

- **Kontaktformulär med Nodemailer**

  - Server Action för kontaktformulär (`contact-actions.ts`)
  - E-postutskick till administratörer
  - Zod-validering av formulärdata
  - React Hook Form-integration
  - Error handling och användarfeedback med Sonner (toast)
  - Transport-konfiguration med SMTP

- **E-postkonfiguration**
  - Nodemailer transporter setup
  - Miljövariabel-hantering för e-postcredentials
  - Logging och debugging för e-postleverans
  - Preview URLs för utvecklingsmiljö

---

### Josefine

**UX/UI, Autentisering & Innehållspresentation**

- **UX/UI Design & Branding**

  - Logotypdesign och visuell identitet
  - Responsiv layout-design med Tailwind CSS
  - Dark/Light mode-implementation med Next Themes
  - ThemeLogo-komponent med dynamisk temahantering
  - Navbar och Footer-komponenter
  - UI-komponentbibliotek (shadcn/ui)

- **Better Auth-implementation**

  - Konfiguration av Better Auth med Prisma-adapter
  - Admin-plugin setup
  - Auth client och server-side auth utilities
  - Session-hantering med säkra headers
  - Zod-scheman för autentiseringsvalidering

- **Rollhantering**

  - User role-system (Admin, Editor, User)
  - Server-side middleware (`requireAdmin`, `requireAdminOrEditor`)
  - Conditional rendering baserat på användarroll
  - Admin/Editor-specifika routes och komponenter

- **Mina Sidor**

  - SettingsForm för användarprofilhantering
  - Lösenordsändring med Better Auth
  - E-post och namnuppdateringar
  - SubscriptionManager för prenumerationsstatus

- **Användarhantering (Admin)**

  - Användarlistning i admin-panel
  - Rollfördelning via RoleSelect-komponent
  - Användarstatistik i dashboard

- **Premium-flagga på Artiklar**

  - Premium article-funktionalitet i databasmodell
  - Conditional rendering av premium-innehåll
  - Åtkomstkontroll för premium-artiklar
  - Visuell indikation för premium-status

- **Sökfunktioner**

  - SearchForm-komponent med React Hook Form
  - Server-side sökning med Prisma
  - Sökresultat med artikelförhandsvisning
  - Dynamisk slug-generering för SEO

- **SLUG-system för Artiklar**

  - SEO-vänliga URL:er med slugify-funktionalitet
  - Dynamic routes med `[slug]` parameter
  - ID-extraktion från slug för databasqueries
  - URL-sanitering och formatering

- **Article Rendering & Komponenter**

  - ArticleHero - Hero-sektion för artikelsidor
  - ArticleContent - Markdown-rendering med react-markdown
  - ArticleCard - Återanvändbart artikelkort
  - CommentsSection - Kommentarsfunktionalitet
  - ArticlesSection.server - Server-side artikellistning

- **Editor's Choice Carousel**
  - EditorChoiceCarousel med Embla Carousel
  - Autoplay-funktionalitet
  - Responsiv design för mobile/desktop
  - Integration på startsidan och redaktörssida
  - Premium-indikation i carousel

---

## Projektstruktur

```
news-gamma/
├── prisma/
│   └── schema.prisma          # Databasmodeller
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin-panel
│   │   │   ├── artiklar/      # Artikelhantering (CRUD)
│   │   │   ├── artiklar-ai/   # AI-artikelgenerering
│   │   │   ├── anvandare/     # Användarhantering
│   │   │   ├── kategorier/    # Kategorihantering
│   │   │   └── dashboard/     # Statistik & visualisering
│   │   ├── artiklar/          # Artikelvisning
│   │   │   └── [slug]/        # Dynamisk artikelsida
│   │   ├── el/                # Elprisinformation
│   │   ├── kategori/          # Kategorifiltrering
│   │   ├── mina-sidor/        # Användarinställningar
│   │   ├── prenumeration/     # Stripe checkout
│   │   └── sok/               # Sökfunktionalitet
│   ├── components/            # React-komponenter
│   │   ├── Admin/             # Admin-specifika komponenter
│   │   ├── articles/          # Artikelkomponenter
│   │   ├── dashboard/         # Dashboard-komponenter
│   │   ├── Forms/             # Formulär (Login, Signup, Contact)
│   │   ├── layout/            # Layout-komponenter
│   │   └── ui/                # Återanvändbara UI-komponenter
│   ├── lib/
│   │   ├── actions/           # Server Actions
│   │   ├── auth.ts            # Better Auth-konfiguration
│   │   ├── server-auth.ts     # Server-side auth utilities
│   │   ├── prisma.ts          # Prisma client
│   │   └── schema/            # Zod-scheman
│   └── types/                 # TypeScript-typdefinitioner
└── package.json
```

## Funktionalitet

### Användarfunktioner

- Registrering med e-postverifiering
- Inloggning/utloggning
- Profilhantering
- Prenumeration via Stripe
- Kommentera artiklar
- Sök artiklar
- Dark/Light mode

### Admin/Editor-funktioner

- Skapa, redigera, ta bort artiklar
- AI-assisterad artikelgenerering
- Kategorihantering
- Användarhantering med rollfördelning
- Statistik och dashboard
- Editor's Choice-markering
- Premium content-flaggning

### Innehållspresentation

- Responsiva artikelkort
- Karuseller för utvalt innehåll
- Kategoribaserad navigering
- SEO-optimerade URL:er med slugs
- Markdown-formaterat innehåll

### Integrationer

- Stripe för prenumerationer
- Gemini AI för innehållsgenerering
- Spotprices API för elpriser
- SMHI för väderdata
- Nodemailer för e-postkommunikation

---

## Sammanfattning

News Gamma är en fullstack Next.js-applikation som demonstrerar moderna webbutvecklingstekniker med fokus på:

- **Server-first arkitektur** med Server Actions och Server Components
- **Typsäkerhet** genom TypeScript och Zod-validering
- **Skalbar autentisering** med Better Auth och rollbaserad access control
- **AI-integration** för innehållsgenerering
- **Betalningshantering** med Stripe
- **Optimerad användarupplevelse** med responsiv design och dark mode
- **SEO-optimering** med dynamiska routes och metadata

Projektet visar på starkt teamarbete där varje medlem har bidragit med sina specialområden inom frontend, backend, AI-integration och användarupplevelse.
