# 📰 Dagens Dos

<p align="center">
  <img src="./public/mockup-dagensdos.jpg" alt="Mockup - Dagens Dos" width="700">
</p>


En modern nyhetsapplikation byggd med **Next.js 15 (App Router)** och **TypeScript**.  
Projektet är utvecklat som ett grupparbete av **Josefine, Johan, Magui och Ahmed** på **Lexicon i Linköping**.

---

## 📚 Innehållsförteckning

- [Översikt](#översikt)
- [Teknikstack](#teknikstack)
- [Teammedlemmar och Bidrag](#teammedlemmar-och-bidrag)
- [Förutsättningar](#förutsättningar)
- [Installation](#installation)
- [Miljövariabler](#miljövariabler)
- [Utveckling](#utveckling)
- [Projektstruktur](#projektstruktur)
- [Arkitektur](#arkitektur)
- [Funktionalitet](#funktionalitet)
- [Distribution](#distribution)
- [Felsökning](#felsökning)
- [Kontakt](#kontakt)

---

## 🧭 Översikt

**News Gamma** är en fullstack-nyhetsapplikation med fokus på **prestanda**, **typesäkerhet** och **skalbarhet**.  
Projektet demonstrerar moderna webbutvecklingstekniker med **server-first arkitektur**, **AI-integration** och **användarhantering**.

### 🔑 Huvudfunktioner

- Responsiv design med Dark/Light mode  
- Säker autentisering med e-postverifiering  
- Rollbaserad åtkomstkontroll (Admin, Editor, User)  
- Prenumerationssystem med Stripe  
- AI-assisterad artikelgenerering  
- CRUD-funktionalitet för artiklar och kategorier  
- Dashboard med statistik och visualiseringar  
- Extern API-integration (Elpriser, Väderdata)

<p align="center">
  <img src="./public/screenshot-dark.png" alt="Dark mode" width="48%">
  <img src="./public/screenshot-light.png" alt="Light mode" width="48%">
</p>

---

## ⚙️ Teknikstack

### Frontend
- **Next.js 15.5.4** (App Router, Turbopack)
- **React 19.1.0** + **TypeScript 5**
- **Tailwind CSS 4**
- **Radix UI**, **Embla Carousel**, **Lucide React**
- **Next Themes** (Dark/Light mode)

### Backend & Databas
- **Prisma 6.18.0** (PostgreSQL)
- **Better Auth 1.3.27**
- **Server Actions** (Next.js)
- **Nodemailer 7.0.10**
- **Zod 4.1.12**

### Betalningar & AI
- **Stripe 19.1.0**
- **Better Auth Stripe Plugin**
- **AI SDK (Vercel)**, **Google AI SDK (Gemini 2.5 Flash)**
- **MDXEditor 3.48.0**

### Externa API:er
- **Spotprices API** – Elpriser SE1–SE4  
- **SMHI API** – Väderdata

---

## 👥 Teammedlemmar och Bidrag

### **Magui – Backend & Betalningar**
- CRUD för artiklar & kategorier  
- Stripe-integration  
- Dashboard-visualiseringar  
- Rollbaserad åtkomstkontroll  
- Cookie-banner (GDPR)

### **Ahmed – AI & API**
- Elpris-API med visualisering  
- Gemini AI-integration  
- Google Search-koppling  
- MDX-editor  
- Zod-validering

### **Johan – E-post & Verifiering**
- E-postverifiering (Better Auth + Nodemailer)  
- Kontaktformulär & templates  
- SMTP-konfiguration

### **Josefine – UX/UI & Autentisering**
- Design, logotyp, UX-flöden  
- Better Auth-integration  
- Rollhantering (Admin/Editor/User)  
- Sökfunktion & SEO-sluggar  
- Article rendering-komponenter  
- Projektledning

---

## 🧩 Förutsättningar

- **Node.js 18+**
- **npm / pnpm / yarn**
- **PostgreSQL**
- **Stripe-konto**
- (Valfritt) **Google AI API-nyckel**

---

## 🚀 Installation

```bash
# 1. Klona repo
git clone <repository-url>
cd news-gamma

# 2. Installera beroenden
npm install

# 3. Skapa miljöfil
cp .env.example .env

# 4. Generera Prisma Client
npx prisma generate

# 5. Migrera databas
npx prisma migrate dev

# 6. Starta utvecklingsserver
npm run dev


## Miljövariabler

Skapa en `.env`-fil i projektets rot. Inkludera aldrig denna fil i versionshantering.

### Nödvändiga variabler

```env
# Databas
DATABASE_URL="postgresql://postgres:password@localhost:5432/news-gamma"

# Autentisering
BETTER_AUTH_SECRET="en-lång-slumpmässig-och-hemlig-sträng"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# E-post (Nodemailer)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="smtp-user@example.com"
EMAIL_PASS="smtp-password"

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

**Obs:** För produktion, använd plattformens secure environment variable storage.

## Utveckling

### Tillgängliga skript

```bash
npm run dev      # Starta utvecklingsserver
npm run build    # Bygg för produktion
npm start        # Starta produktionsserver
npm run lint     # Kör ESLint
```

### Snabbtest

- Besök `http://localhost:3000/` för startsidan
- Registrera en användare via `/registrera`
- Logga in via `/logga-in`
- Kontrollera databastabell efter migrationer
- Verifiera prenumerationsflödet i Stripe testläge

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
├── public/                    # Statiska tillgångar
└── package.json
```

### Viktiga filer

- `prisma/schema.prisma` - Databasschema med PostgreSQL provider
- `src/lib/prisma.ts` - Prisma Client singleton-instans
- `src/lib/auth.ts` - Better Auth server-konfiguration
- `src/lib/client/auth-client.ts` - Better Auth client för React
- `src/lib/server-auth.ts` - Server-side auth middleware
- `src/lib/actions/` - Server Actions för backend-logik

## Arkitektur

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
- Server-side middleware för skyddade routes

### Databasmodeller (Prisma)

```prisma
- Article (med premium & editorsChoice flaggor)
- Category (med showInNavbar konfiguration)
- User (med roller, Stripe-integration, emailVerified)
- Comment
- Order & OrderItem
- Session & Account
- PasswordResetToken
```

## Funktionalitet

### Användarfunktioner

- Registrering med e-postverifiering
- Inloggning/utloggning
- Profilhantering (namn, e-post, lösenord)
- Prenumeration via Stripe
- Kommentera artiklar
- Sök artiklar
- Dark/Light mode
- Läsa premium-innehåll (kräver prenumeration)

### Admin/Editor-funktioner

<p align="center">
	<img src="./public/screenshot-adminartiklar.png" alt="Admin artiklar - screenshot" style="max-width:100%;height:auto;border-radius:6px;" />
</p>

- Skapa, redigera, ta bort artiklar
- AI-assisterad artikelgenerering med Gemini
- MDX-editor för rich text innehåll
- Kategorihantering med navbar-visning
- Användarhantering med rollfördelning
- Statistik och dashboard med visualiseringar
- Editor's Choice-markering
- Premium content-flaggning
- Användarbanhantering

### Innehållspresentation

<p align="center">
	<img src="./public/screenshot-slug.png" alt="Artikelvy / slug - exempel" style="max-width:100%;height:auto;border-radius:6px;" />
</p>

- Responsiva artikelkort
- Karuseller för utvalt innehåll
- Kategoribaserad navigering
- SEO-optimerade URL:er med slugs
- Markdown-formaterat innehåll
- Artikelvyer och statistik

### Integrationer

- **Stripe** - Prenumerationer och betalningar
- **Gemini AI** - Innehållsgenerering med Google Search
- **Spotprices API** - Elpriser för svenska elområden
- **SMHI** - Väderdata för Sverige
- **Nodemailer** - E-postkommunikation

## Felsökning

### Vanliga problem

**Typfel efter schemaändringar**

```bash
npx prisma generate
```

**Autentiseringsfel**

- Kontrollera att `BETTER_AUTH_SECRET` är korrekt angiven i `.env`
- Verifiera att Stripe-nycklar matchar rätt miljö (test/production)

**Lint-varningar**

```bash
npm run lint
```

**Databasanslutning**

- Verifiera `DATABASE_URL` i `.env`
- Kontrollera att PostgreSQL-servern kör
- Testa anslutningen med `npx prisma db pull`

## Distribution

Projektet är kompatibelt med plattformar som:

- **Vercel** - Rekommenderad för Next.js-projekt
- **Railway** - Med PostgreSQL-databas
- **Render** - Fullstack hosting
- Andra plattformar med Next.js och PostgreSQL-stöd

### Deployment-checklista

1. Konfigurera alla miljövariabler i målmiljön
2. Säkerställ att `BETTER_AUTH_SECRET` är unik och säker (minst 32 tecken)
3. Uppdatera `BETTER_AUTH_URL` till produktions-URL
4. Använd produktions-nycklar för Stripe
5. Kör databasmigrationer i produktionsmiljön: `npx prisma migrate deploy`
6. Generera Prisma Client: `npx prisma generate`
7. Testa autentisering, prenumerationsflöden och AI-funktionalitet
8. Konfigurera SMTP för e-postleverans

### Vercel-specifikt

```bash
# Installera Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sätt miljövariabler
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
# ... och resten av variablerna
```

## Felsökning

### Vanliga problem

**Typfel efter schemaändringar**

```bash
npx prisma generate
```

**Autentiseringsfel**

- Kontrollera att `BETTER_AUTH_SECRET` är korrekt angiven i `.env`
- Verifiera att `BETTER_AUTH_URL` matchar din miljö
- Kontrollera att Stripe-nycklar matchar rätt miljö (test/production)

**Databasanslutning**

- Verifiera `DATABASE_URL` i `.env`
- Kontrollera att PostgreSQL-servern kör
- Testa anslutningen: `npx prisma db pull`
- Kontrollera att migrationer är körda: `npx prisma migrate status`

**E-postleverans**

- Testa SMTP-uppgifter med ett verktyg som Ethereal Email
- Kontrollera att `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` är korrekta
- Verifiera att brandväggen tillåter utgående SMTP-trafik

**AI-generering fungerar inte**

- Kontrollera att `GOOGLE_GENERATIVE_AI_API_KEY` är korrekt
- Verifiera API-nyckelns behörigheter och kvoter
- Kontrollera nätverksanslutning till Google AI API

**Build-fel**

```bash
# Rensa cache och bygg om
rm -rf .next
npm run build
```

**Lint-varningar**

```bash
npm run lint
```

## Kontakt

För frågor, samarbeten eller support, kontakta utvecklarna:

**Utvecklingsteam:**

- **Josefine** - UX/UI, Autentisering & Projektledning
- **Johan** - E-postfunktionalitet & Verifiering
- **Magui** - Backend & Betalningsintegration
- **Ahmed** - AI-integration & Externa API

**Institution:** Lexicon i Linköping

---

## Sammanfattning

News Gamma demonstrerar moderna webbutvecklingstekniker med:

- **Server-first arkitektur** med Server Actions och Server Components
- **Typsäkerhet** genom TypeScript och Zod-validering
- **Skalbar autentisering** med Better Auth och rollbaserad access control
- **AI-integration** för innehållsgenerering med Gemini
- **Betalningshantering** med Stripe
- **Optimerad användarupplevelse** med responsiv design och dark mode
- **SEO-optimering** med dynamiska routes och metadata

Tack för att du använder News Gamma!
