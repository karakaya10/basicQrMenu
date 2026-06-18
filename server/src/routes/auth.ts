import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Tek admin kullanıcısı .env'den okunur
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'E-posta ve şifre gerekli' });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (email !== adminEmail || !adminPasswordHash) {
    res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    return;
  }

  const isMatch = await bcrypt.compare(password, adminPasswordHash);
  if (!isMatch) {
    res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    return;
  }

  const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  res.json({ token });
});

export default router;
