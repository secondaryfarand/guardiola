import express from 'express';
import articleController from '../features/article/articleController.js';

const router = express.Router();

// PUBLIC
router.get('/', articleController.getArticles);
router.get('/:slug', articleController.getArticleDetail);
router.post('/:id/comments', articleController.addComment); 
router.put('/:id/like', articleController.toggleLike); 

// ADMIN MANAGEMENT 
router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.remove);

export default router;