import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import type { Category, Product } from '../api/types';

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products')]).then(([catRes, prodRes]) => {
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter(
          (p) => (typeof p.category === 'string' ? p.category : p.category._id) === activeCategory
        );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>

      {/* Hero header */}
      <header
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #4A2010 0%, #6B3A2A 60%, #8B5040 100%)' }}
      >
        {/* Dekoratif daire */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: '#FAF3E0' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: '#D2622A' }}
        />

        <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-5 text-center animate-fade-in">
          <div className="text-4xl mb-2 drop-shadow">☕</div>
          <h1
            className="text-white text-2xl font-bold tracking-widest uppercase mb-1"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}
          >
            Kafe Menüsü
          </h1>
          <p className="text-white/50 text-xs tracking-widest uppercase">Lezzet & Keyif</p>
        </div>

        {/* Kategori sekmeleri */}
        {!loading && categories.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-4 mt-2 overflow-x-auto scrollbar-none">
            <div className="flex gap-1 w-max mx-auto">
              {[{ _id: 'all', name: 'Tümü' }, ...categories].map((cat) => {
                const isActive = activeCategory === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setActiveCategory(cat._id)}
                    className={`cat-tab px-5 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded-full transition-all ${
                      isActive ? 'active text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                    style={isActive ? { backgroundColor: 'rgba(255,255,255,0.15)' } : {}}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* İnce ayraç çizgisi */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #D2622A, #C4A882, #D2622A)' }} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-sm" style={{ color: '#9B7B6B' }}>Bu kategoride ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-10">
        <div
          className="inline-block mx-auto mb-3"
          style={{ width: 40, height: 1, backgroundColor: '#C4A882' }}
        />
        <p className="text-xs tracking-widest uppercase" style={{ color: '#C4A882' }}>
          Afiyet Olsun
        </p>
      </footer>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card-hover bg-white rounded-2xl overflow-hidden flex"
      style={{
        boxShadow: '0 2px 12px rgba(44,26,14,0.07)',
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeUp 0.4s ease ${Math.min(index * 0.07, 0.35)}s both` : 'none',
      }}
    >
      {/* Görsel */}
      <div className="relative shrink-0 w-28 h-28 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.35s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: '#F5ECD7' }}
          >
            🍽️
          </div>
        )}
        {/* Fiyat rozeti */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center py-1 text-xs font-bold text-white"
          style={{ background: 'rgba(210,98,42,0.88)', letterSpacing: '0.03em' }}
        >
          ₺{product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
        </div>
      </div>

      {/* İçerik */}
      <div className="px-4 py-3 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3
            className="font-bold text-sm leading-snug truncate"
            style={{ color: '#2C1A0E', fontFamily: 'Georgia, serif' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{
                color: '#9B7B6B',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </p>
          )}
        </div>

        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.allergens.map((a) => (
              <span
                key={a}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: '#FAF3E0',
                  color: '#9B7B6B',
                  border: '1px solid #E8D8C0',
                  fontSize: '10px',
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex rounded-2xl overflow-hidden" style={{ height: 112 }}>
          <div className="skeleton shrink-0" style={{ width: 112 }} />
          <div className="flex-1 p-4 space-y-2">
            <div className="skeleton h-4 rounded" style={{ width: '60%' }} />
            <div className="skeleton h-3 rounded" style={{ width: '85%' }} />
            <div className="skeleton h-3 rounded" style={{ width: '45%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
