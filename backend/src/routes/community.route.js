import express from 'express';
import communityController from '../features/community/commuity.controller.js';

const router = express.Router();

router.get('/', communityController.getReports);
router.post('/', communityController.createReport);
router.patch('/:id/confirm', communityController.confirmThreat);

router.post('/check', communityController.checkUrl);

export default router;