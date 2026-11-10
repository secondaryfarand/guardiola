import { Router } from 'express';
import inspectorController from '../features/inspector/inspector.controller.js';

const router = Router();

router.post('/scan', inspectorController.scanThreat);

export default router;