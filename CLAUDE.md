# basicQrMenu — Kafe QR Menü Uygulaması

## Proje Özeti
Yeni açılan bir kafe için QR kod ile erişilen dijital menü + admin yönetim paneli.

## Tech Stack
- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express + TypeScript
- **Veritabanı:** MongoDB (Mongoose)
- **Auth:** JWT (admin için)
- **Görseller:** Multer (sunucuya yükleme)
- **QR Kod:** react-qr-code

## Dizin Yapısı
```
basicQrMenu/
├── client/           # React frontend (port 5173)
│   └── src/
│       ├── api/          # axios.ts, types.ts
│       ├── context/      # AuthContext.tsx (JWT token yönetimi)
│       ├── components/admin/  # AdminLayout, ProtectedRoute
│       └── pages/
│           ├── Menu.tsx          # Müşteri menü sayfası
│           └── admin/            # Login, Dashboard, Categories, Products, QrCode
├── server/           # Express backend (port 3001)
│   └── src/
│       ├── models/       # Category.ts, Product.ts
│       ├── routes/       # auth.ts, categories.ts, products.ts
│       └── middleware/   # auth.ts (JWT protect)
└── package.json      # Root — concurrently ile her ikisini başlatır
```

## Önemli Teknik Notlar
- **Port:** macOS port 5000 AirPlay tarafından meşgul — backend port **3001** kullanıyor
- **Tailwind v4:** `tailwind.config.js` yok, `@tailwindcss/vite` plugin ile çalışır, `@import "tailwindcss"` CSS'te yeterli
- **Axios token:** Interceptor güvenilir çalışmadı; `api.defaults.headers.common['Authorization']` AuthContext'te `useEffect` ile set ediliyor
- **Type import:** Vite 8 ile `types.ts`'den import için `import type { }` zorunlu
- **Seed script:** `server/seed.js` — veritabanını örnek veriyle doldurmak için `node seed.js` (server klasöründen)

## Admin Bilgileri
- **URL:** `http://localhost:5173/admin`
- **E-posta:** `admin@kafem.com`
- **Şifre:** `admin123`
- Şifre değiştirmek için: `cd server && npm run hash-password YeniSifre` → çıkan hash'i `.env` içine yaz

## Renk Paleti (Vintage & Toprak)
| Renk | Hex | Kullanım |
|------|-----|----------|
| Krem | `#FAF3E0` | Arka plan |
| Espresso | `#2C1A0E` | Ana metin |
| Koyu Kahve | `#6B3A2A` | Sidebar, navbar |
| Terracotta | `#D2622A` | Butonlar, vurgular |
| Bej | `#C4A882` | İkincil metin, kenarlık |

## Başlatma
```bash
# MongoDB başlat (bir kez)
brew services start mongodb-community

# Projeyi başlat
cd /Users/sametkarakaya/Desktop/basicQrMenu
npm run dev
```

---

## Tamamlanan Aşamalar

### ✅ Aşama 1 — Temel Altyapı
- Backend: Express + MongoDB + JWT auth kurulumu
- Frontend: React + Vite + Tailwind v4 kurulumu
- Proxy: Vite → Express yönlendirmesi

### ✅ Aşama 2 — Veritabanı Modelleri
- `Category` modeli (name, description, order)
- `Product` modeli (name, description, price, category, image, isAvailable, allergens, order)

### ✅ Aşama 3 — Admin Paneli
- Login sayfası (JWT auth)
- Dashboard (istatistikler: kategori sayısı, ürün sayısı, stok durumu)
- Kategori yönetimi (ekle / düzenle / sil)
- Ürün yönetimi (ekle / düzenle / sil + fotoğraf yükleme + alerjen bilgisi)
- QR Kod sayfası (URL gir, anlık önizleme, PNG/SVG indir)

### ✅ Aşama 4 — Müşteri Menüsü
- Kategori filtresi (sticky header içinde)
- Ürün kartları (görsel, isim, açıklama, fiyat rozeti, alerjenler)
- Mobil öncelikli tasarım

### ✅ Aşama 5 — Premium Tasarım
- Hero header (gradient, dekoratif daireler, elegant tipografi)
- Skeleton loading (shimmer animasyonu)
- Scroll fade-up animasyonu (IntersectionObserver ile staggered)
- Kart hover efekti (lift + shadow)
- Fiyat rozeti (görselin üstünde terracotta şerit)

---

## Planlanan Gelecek Aşamalar

### 🔲 Aşama 6 — Masa Bazlı QR
- Her masa için benzersiz QR: `/menu?masa=1`
- Admin panelinde masa yönetimi

### 🔲 Aşama 7 — Sipariş Sistemi
- Müşteri masadan sipariş verebilsin
- Admin panelinde canlı sipariş takibi (WebSocket veya polling)
- Sipariş durumu: Bekliyor → Hazırlanıyor → Hazır

### 🔲 Aşama 8 — Ödeme Entegrasyonu
- Masadan ödeme talebi
- Ödeme yöntemleri (nakit / kart)

### 🔲 Aşama 9 — Ekstra Özellikler (Opsiyonel)
- Çok dilli menü (TR / EN)
- Günlük/haftalık satış raporları
- Ürün arama
- Öne çıkan ürünler (featured)
- Kafe bilgileri sayfası (çalışma saatleri, sosyal medya)
- PWA desteği (telefona yüklenebilir uygulama)
