import { Router } from 'express';
import inspectorRoute from './inspector.route.js';
import communityRoute from './community.route.js';
import articleRoute from './article.route.js';
import reverseRoute from './reverse.route.js';
import authRoute from './auth.route.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Subsystem router operational is connected.' });
});

router.use('/inspector', inspectorRoute);
router.use('/community', communityRoute);
router.use('/articles', articleRoute);
router.use('/reverse', reverseRoute);
router.use('/auth', authRoute);

export default router;
