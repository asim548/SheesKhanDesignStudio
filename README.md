# Shees Khan Design Studio

Official website for **Shees Khan Design Studio** — luxury bridal couture, made-to-order bespoke, and ready-to-wear.

**Live site:** [https://shees-khan-design-studio.vercel.app](https://shees-khan-design-studio.vercel.app)

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · MongoDB · NextAuth · Cloudinary · Resend · Zustand

**Repository:** [asim548/SheesKhanDesignStudio](https://github.com/asim548/SheesKhanDesignStudio)

---

## Features

### Public site
- Brand homepage with hero video, featured collections & ready-to-wear
- **Bespoke** portfolio (`/collections`) — consultation-led
- **Ready-to-Wear shop** (`/shop`) — sizes, cart, checkout (payment via WhatsApp)
- Custom consultation multi-step form
- Wishlist, search, and client-care pages
- Mobile bottom navigation + WhatsApp floating action
- Contact, about, craftsmanship, testimonials, measurement guide

---

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in environment variables (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for local development.

---

## Environment variables

Copy `.env.example` → `.env.local`:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | Site URL (`https://shees-khan-design-studio.vercel.app` in production) |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (`https://shees-khan-design-studio.vercel.app`) |
| `ADMIN_EMAIL` | Studio login email |
| `ADMIN_PASSWORD` | Studio login password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key for order/contact emails |
| `NOTIFICATION_EMAIL` | Owner inbox for alerts |
| `RESEND_FROM` | Optional verified-domain sender |
| `WHATSAPP_TOKEN` | Optional Meta Cloud API token |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional Meta phone number ID |
| `WHATSAPP_OWNER_NUMBER` | Owner WhatsApp (digits, e.g. `923185088200`) |

> Never commit `.env.local`. Only `.env.example` is tracked.

---

## Main public routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/collections` | Bespoke designs |
| `/shop` | Ready-to-wear catalog |
| `/cart` · `/checkout` · `/order-confirmation` | RTW commerce flow |
| `/custom-order` | Bespoke consultation |
| `/wishlist` · `/search` · `/account` | Client tools |
| `/about` · `/craftsmanship` · `/testimonials` · `/contact` | Brand & contact |

---

## Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npm run seed     # Seed sample data (requires env)
```

---

## Deploy (Vercel)

Live deployment: [https://shees-khan-design-studio.vercel.app](https://shees-khan-design-studio.vercel.app)

1. Import [asim548/SheesKhanDesignStudio](https://github.com/asim548/SheesKhanDesignStudio) in [Vercel](https://vercel.com)
2. Add environment variables from `.env.example`
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to  
   `https://shees-khan-design-studio.vercel.app`
4. Deploy

### Supporting services
- **MongoDB Atlas** — free M0 cluster; allow `0.0.0.0/0` for Vercel
- **Cloudinary** — image uploads
- **Resend** — order/contact notifications

---

## Brand

- **Studio:** Shees Khan Design Studio  
- **WhatsApp:** +92 318 5088200  
- **Instagram:** [@sheeskhan.official](https://www.instagram.com/sheeskhan.official)  
- **Palette:** Ivory `#FAF7F2` · Espresso `#3D2B22` · Blush `#E8D5D0`  
- **Fonts:** Cormorant Garamond · Jost  

---

## License

Private project for Shees Khan Design Studio. All rights reserved.
