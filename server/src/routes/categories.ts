import { Router, Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { protect } from '../middleware/auth';

const router = Router();

// Public — müşteri menüsü için
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — kategori oluştur
router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, order } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Kategori adı gerekli' });
      return;
    }
    const category = await Category.create({ name, description, order: order ?? 0 });
    res.status(201).json(category);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — kategori güncelle
router.put('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }
    res.json(category);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin — kategori sil
router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }
    await Product.deleteMany({ category: req.params.id });
    res.json({ message: 'Kategori ve ürünleri silindi' });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;
