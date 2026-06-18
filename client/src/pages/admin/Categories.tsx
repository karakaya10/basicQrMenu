import { useEffect, useState, FormEvent } from 'react';
import api from '../../api/axios';
import type { Category } from '../../api/types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description ?? '');
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Kategori adı gerekli'); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, { name, description });
      } else {
        await api.post('/categories', { name, description });
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
    if (!confirm('Bu kategoriyi ve içindeki tüm ürünleri silmek istediğinize emin misiniz?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2C1A0E' }}>Kategoriler</h2>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#D2622A' }}
        >
          + Kategori Ekle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#2C1A0E' }}>
              {editing ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Ad *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                  placeholder="Örn: İçecekler"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C1A0E' }}>Açıklama</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                  placeholder="Opsiyonel"
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
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📂</p>
          <p style={{ color: '#9B7B6B' }}>Henüz kategori yok. İlkini ekleyin!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl px-6 py-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: '#2C1A0E' }}>{cat.name}</p>
                {cat.description && <p className="text-sm mt-0.5" style={{ color: '#9B7B6B' }}>{cat.description}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="px-4 py-1.5 text-sm rounded-lg border transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#D2622A', color: '#D2622A' }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="px-4 py-1.5 text-sm rounded-lg text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#c0392b' }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
