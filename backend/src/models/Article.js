import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header1', 'header2', 'header3', 'paragraph', 'image', 'warning_box', 'list'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  url: {
    type: String, 
    default: null
  },
  public_id: {
    type: String,
    default: null
  }
}, { _id: false });

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama pengomentar wajib diisi'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Isi komentar wajib diisi'],
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul artikel wajib diisi'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Impersonation', 'JobScam', 'Phishing Link', 'General Fraud', 'EduTips'],
    required: true
  },
  thumbnail: {
    url: { type: String, default: null },
    public_id: { type: String, default: null }
  },
  summary: {
    type: String,
    required: [true, 'Ringkasan artikel wajib diisi'],
    maxlength: 300
  },
  contentBlocks: [contentBlockSchema],
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema], 
  author: {
    type: String,
    default: 'The Trust Trap Team'
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);
export default Article;