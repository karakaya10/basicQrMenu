import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Category, Product } from '../../api/types';

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products/all')])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setProducts(prodRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const availableCount = products.filter((p) => p.isAvailable).length;

  const stats = [
    { label: 'Toplam Kategori', value: categories.length, icon: '📂' },
    { label: 'Toplam Ürün', value: products.length, icon: '🍽️' },
    { label: 'Satışta', value: availableCount, icon: '✅' },
    { label: 'Stok Dışı', value: products.length - availableCount, icon: '❌' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C1A0E' }}>Dashboard</h2>

      {loading ? (
        <p style={{ color: '#9B7B6B' }}>Yükleniyor...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-3xl font-bold" style={{ color: '#D2622A' }}>{value}</div>
                <div className="text-sm mt-1" style={{ color: '#9B7B6B' }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4" style={{ color: '#2C1A0E' }}>Kategorilere Göre Ürünler</h3>
            <div className="space-y-3">
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => (typeof p.category === 'string' ? p.category : p.category._id) === cat._id
                ).length;
                return (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#2C1A0E' }}>{cat.name}</span>
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: '#D2622A' }}
                    >
                      {count} ürün
                    </span>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm" style={{ color: '#9B7B6B' }}>Henüz kategori yok.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
