import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import api from '../../api/axios';
import type { Category, Product } from '../../api/types';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  isAvailable: true,
  allergens: '',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const load = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/all'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    const catId = typeof product.category === 'string' ? product.category : product.category._id;
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price.toString(),
      category: catId,
      isAvailable: product.isAvailable,
      allergens: (product.allergens ?? []).join(', '),
    });
    setImageFile(null);
    setImagePreview(product.image ? product.image : null);
    setError('');
    setShowForm(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setError('Ad, fiyat ve kategori zorunludur');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('isAvailable', form.isAvailable.toString());
      fd.append('allergens', JSON.stringify(form.allergens.split(',').map((s) => s.trim()).filter(Boolean)));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      setShowForm(false);
      load();
    } catch {
      setError('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const filtered = filterCat
    ? products.filter((p) => (typeof p.category === 'string' ? p.category : p.category._id) === filterCat)
    : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2C1A0E' }}>Ürünler</h2>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#D2622A' }}
        >
          + Ürün Ekle
        </button>
      </div>

      {/* Kategori filtresi */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterCat('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterCat ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          style={!filterCat ? { backgroundColor: '#D2622A' } : {}}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setFilterCat(cat._id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCat === cat._id ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            style={filterCat === cat._id ? { backgroundColor: '#D2622A' } : {}}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#2C1A0E' }}>
              {editing ? 'Ürün Düzenle' : 'Yeni Ürün'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Ad *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                  placeholder="Örn: Cappuccino"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none resize-none"
                  rows={2}
                  placeholder="Ürün açıklaması..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Fiyat (₺) *</label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Kategori *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none bg-white"
                  >
                    <option value="">Seç...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Alerjenler</label>
                <input
                  type="text"
                  value={form.allergens}
                  onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                  placeholder="Gluten, Süt, Yumurta (virgülle ayırın)"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isAvailable" className="text-sm" style={{ color: '#2C1A0E' }}>
                  Satışta
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2C1A0E' }}>Fotoğraf</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:text-white"
                  style={{ '--file-bg': '#D2622A' } as React.CSSProperties}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                  style={{ backgroundColor: '#D2622A' }}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9B7B6B' }}>Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🍽️</p>
          <p style={{ color: '#9B7B6B' }}>Henüz ürün yok. İlkini ekleyin!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-4xl" style={{ backgroundColor: '#FAF3E0' }}>
                  🍽️
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm" style={{ color: '#2C1A0E' }}>{product.name}</h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white ml-2 shrink-0"
                    style={{ backgroundColor: product.isAvailable ? '#27ae60' : '#c0392b' }}
                  >
                    {product.isAvailable ? 'Satışta' : 'Stok dışı'}
                  </span>
                </div>
                <p className="text-sm font-bold mb-3" style={{ color: '#D2622A' }}>
                  ₺{product.price.toFixed(2)}
                </p>
                <p className="text-xs mb-3" style={{ color: '#9B7B6B' }}>
                  {typeof product.category === 'string' ? product.category : product.category.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 py-1.5 text-xs rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#D2622A', color: '#D2622A' }}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-1.5 text-xs rounded-lg text-white hover:opacity-80"
                    style={{ backgroundColor: '#c0392b' }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
