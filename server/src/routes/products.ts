import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/Product';
import { protect } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Sadece görsel dosyaları yüklenebilir'));
  },
});

// Public — menü için tüm ürünler
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { isAvailable: true };
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ order: 1, createdAt: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — tüm ürünler (stok dışı dahil)
router.get('/all', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ order: 1, createdAt: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — ürün oluştur
router.post('/', protect, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, isAvailable, order, allergens } = req.body;
    if (!name || !price || !category) {
      res.status(400).json({ message: 'Ad, fiyat ve kategori gerekli' });
      return;
    }
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      isAvailable: isAvailable !== 'false',
      order: order ? parseInt(order) : 0,
      allergens: allergens ? JSON.parse(allergens) : [],
    });
    res.status(201).json(await product.populate('category', 'name'));
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — ürün güncelle
router.put('/:id', protect, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: Record<string, unknown> = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.price) updates.price = parseFloat(updates.price as string);
    if (updates.order) updates.order = parseInt(updates.order as string);
    if (updates.allergens && typeof updates.allergens === 'string') {
      updates.allergens = JSON.parse(updates.allergens);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category', 'name');
    if (!product) {
      res.status(404).json({ message: 'Ürün bulunamadı' });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — ürün sil
router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Ürün bulunamadı' });
      return;
    }
    if (product.image) {
      const filePath = path.join(__dirname, '../..', product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Ürün silindi' });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;
