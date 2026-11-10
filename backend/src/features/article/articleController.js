import articleService from './articleService.js';

class ArticleController {
  getArticles = async (req, res) => {
    try {
      const pubOnly = req.query.published === 'true';
      const articles = await articleService.getAllArticles({ isPublished: pubOnly });
      res.status(200).json({ success: true, data: articles });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getArticleDetail = async (req, res) => {
    try {
      const article = await articleService.getArticleBySlug(req.params.slug);
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const newArticle = await articleService.createArticle(req.body);
      res.status(201).json({ success: true, message: 'Artikel berhasil dibuat', data: newArticle });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const updatedArticle = await articleService.updateArticle(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui', data: updatedArticle });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      await articleService.deleteArticle(req.params.id);
      res.status(200).json({ success: true, message: 'Artikel berhasil dihapus' });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  addComment = async (req, res) => {
    try {
      const { id } = req.params; // ID Artikel
      const { name, comment } = req.body;

      const updatedArticle = await articleService.addCommentToArticle(id, { name, comment });
      
      // Mengambil komentar terbaru yang baru saja di-push
      const latestComment = updatedArticle.comments[updatedArticle.comments.length - 1];

      res.status(201).json({ 
        success: true, 
        message: 'Komentar berhasil ditambahkan', 
        data: latestComment 
      });
    } catch (error) {
        console.error("DEBUG ERROR 400:", error.message);
        res.status(400).json({ success: false, message: error.message });    }
  };
  toggleLike = async (req, res) => {
    try {
      const { id } = req.params;
      const { increment } = req.body; // true untuk like, false untuk unlike

      const updatedArticle = await articleService.toggleArticleLike(id, increment);
      
      res.status(200).json({ 
        success: true, 
        message: increment ? 'Artikel disukai' : 'Suka dibatalkan', 
        likes: updatedArticle.likes 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

export default new ArticleController();