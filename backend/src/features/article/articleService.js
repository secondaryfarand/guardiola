import articleRepository from './articleRepository.js';

class ArticleService {
  async getAllArticles(query = {}) {
    const filter = query.isPublished ? { isPublished: true } : {};
    return await articleRepository.findAll(filter);
  }

  async getArticleBySlug(slug) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) throw new Error('Artikel tidak ditemukan');
    return article;
  }

  async createArticle(articleData) {
    if (!articleData.slug && articleData.title) {
      articleData.slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    return await articleRepository.create(articleData);
  }

  async updateArticle(id, updateData) {
    const article = await articleRepository.update(id, updateData);
    if (!article) throw new Error('Artikel tidak ditemukan untuk diperbarui');
    return article;
  }

  async deleteArticle(id) {
    const article = await articleRepository.delete(id);
    if (!article) throw new Error('Artikel tidak ditemukan untuk dihapus');
    return article;
  }

  async addCommentToArticle(articleId, commentData) {
    const updatedArticle = await articleRepository.addComment(articleId, commentData);
    if (!updatedArticle) throw new Error('Artikel tidak ditemukan untuk diberi komentar');
    return updatedArticle;
  }
    async toggleArticleLike(articleId, increment) {
        const updatedArticle = await articleRepository.toggleLike(articleId, increment);
        if (!updatedArticle) throw new Error('Artikel tidak ditemukan');
        return updatedArticle;
    }
}

export default new ArticleService();