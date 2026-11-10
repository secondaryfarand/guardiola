import Article from '../../models/Article.js';

class ArticleRepository {
  async findAll(filter = {}) {
    return await Article.find(filter).sort({ createdAt: -1 });
  }

  async findBySlug(slug) {
    return await Article.findOne({ slug });
  }

  async findById(id) {
    return await Article.findById(id);
  }

  async create(articleData) {
    const article = new Article(articleData);
    return await article.save();
  }

  async update(id, updateData) {
    return await Article.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await Article.findByIdAndDelete(id);
  }

  async addComment(articleId, commentData) {
      return await Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: commentData } },
      { new: true, runValidators: true }
      );
  }    
  async toggleLike(articleId, increment = true) {
    const value = increment ? 1 : -1;
    return await Article.findByIdAndUpdate(
      articleId,
      { $inc: { likes: value } },
      { new: true }
    );
  }
}


export default new ArticleRepository();