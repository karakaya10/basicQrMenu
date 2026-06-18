const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const CategorySchema = new mongoose.Schema({ name: String, description: String, order: Number }, { timestamps: true });
const ProductSchema = new mongoose.Schema({
  name: String, description: String, price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String, isAvailable: Boolean, order: Number, allergens: [String]
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

const categories = [
  { name: 'Sıcak İçecekler', description: 'El yapımı kahveler ve sıcak içecekler', order: 1 },
  { name: 'Soğuk İçecekler', description: 'Serinleten içecekler', order: 2 },
  { name: 'Kahvaltı', description: 'Güne taze başlamak için', order: 3 },
  { name: 'Tatlılar', description: 'Günün her anına yakışan lezzetler', order: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB bağlandı');

  await Category.deleteMany({});
  await Product.deleteMany({});

  const cats = await Category.insertMany(categories);
  const [sicak, soguk, kahvalti, tatli] = cats;

  const products = [
    // Sıcak İçecekler
    { name: 'Espresso', description: 'Yoğun aromalı tek shot espresso', price: 45, category: sicak._id, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80', isAvailable: true, order: 1, allergens: [] },
    { name: 'Cappuccino', description: 'Espresso, buharla ısıtılmış süt ve süt köpüğü', price: 75, category: sicak._id, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', isAvailable: true, order: 2, allergens: ['Süt'] },
    { name: 'Latte', description: 'Espresso ve bol sütlü kadifemsi içecek', price: 80, category: sicak._id, image: 'https://images.unsplash.com/photo-1561882468-9110d70d2efd?w=400&q=80', isAvailable: true, order: 3, allergens: ['Süt'] },
    { name: 'Türk Kahvesi', description: 'Geleneksel tarife göre pişirilmiş Türk kahvesi', price: 50, category: sicak._id, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', isAvailable: true, order: 4, allergens: [] },
    { name: 'Çay', description: 'Demlik çay, ince belli bardakta', price: 30, category: sicak._id, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80', isAvailable: true, order: 5, allergens: [] },

    // Soğuk İçecekler
    { name: 'Cold Brew', description: '12 saat soğuk demlenmiş filtre kahve', price: 90, category: soguk._id, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', isAvailable: true, order: 1, allergens: [] },
    { name: 'Frappe', description: 'Buz, süt ve espresso ile hazırlanan soğuk kahve', price: 85, category: soguk._id, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', isAvailable: true, order: 2, allergens: ['Süt'] },
    { name: 'Limonata', description: 'Taze sıkılmış limon ve nane ile', price: 65, category: soguk._id, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80', isAvailable: true, order: 3, allergens: [] },
    { name: 'Taze Portakal Suyu', description: 'Günlük taze sıkılmış portakal', price: 70, category: soguk._id, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', isAvailable: true, order: 4, allergens: [] },

    // Kahvaltı
    { name: 'Avokado Toast', description: 'Ekşi maya ekmeği üzerinde ezilmiş avokado, poşe yumurta', price: 145, category: kahvalti._id, image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80', isAvailable: true, order: 1, allergens: ['Gluten', 'Yumurta'] },
    { name: 'Waffle', description: 'Çikolata sosu, muz ve çilek ile', price: 120, category: kahvalti._id, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80', isAvailable: true, order: 2, allergens: ['Gluten', 'Süt', 'Yumurta'] },
    { name: 'Granola Bowl', description: 'Yoğurt, mevsim meyveleri ve bal ile', price: 110, category: kahvalti._id, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80', isAvailable: true, order: 3, allergens: ['Süt', 'Fındık'] },
    { name: 'Kruvasan', description: 'Tereyağlı, çıtır çıtır taze kruvasan', price: 65, category: kahvalti._id, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', isAvailable: true, order: 4, allergens: ['Gluten', 'Süt'] },

    // Tatlılar
    { name: 'Tiramisu', description: 'Maskarpone ve espresoya bandırılmış bisküvi ile klasik İtalyan tatlısı', price: 130, category: tatli._id, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', isAvailable: true, order: 1, allergens: ['Gluten', 'Süt', 'Yumurta'] },
    { name: 'Cheesecake', description: 'New York usulü, çilek sosuyla', price: 125, category: tatli._id, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80', isAvailable: true, order: 2, allergens: ['Gluten', 'Süt', 'Yumurta'] },
    { name: 'Brownie', description: 'Sıcak servis, vanilyalı dondurma ile', price: 95, category: tatli._id, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', isAvailable: true, order: 3, allergens: ['Gluten', 'Süt', 'Yumurta', 'Fındık'] },
  ];

  await Product.insertMany(products);

  console.log(`✓ ${cats.length} kategori eklendi`);
  console.log(`✓ ${products.length} ürün eklendi`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
