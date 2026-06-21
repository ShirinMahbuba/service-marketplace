import { Router, Request, Response } from 'express';
import { SESSION_COOKIE } from '../lib/auth';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const user = req.body;

  res.cookie(SESSION_COOKIE, encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 1000,
    sameSite: 'lax',
  });

  res.json({ success: true, user });
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ success: true });
});

export default router;
