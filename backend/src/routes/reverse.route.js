import express from 'express';
import { handleReverseAiChat, getAllReverseScenarios, getReverseScenarioById } from '../features/reverse/reverseController.js';
const router = express.Router();

router.post('/ai-chat', handleReverseAiChat);
router.get('/', getAllReverseScenarios);
router.get('/:id', getReverseScenarioById);

export default router;