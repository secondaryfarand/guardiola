import mongoose from 'mongoose';

const ReportedUrlSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  target: { type: String, required: true, unique: true, trim: true },
  ipAddress: { type: String, default: '104.21.78.12 (Cloudflare Inc, US)' },
  category: { type: String, required: true },
  riskLevel: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'High' },
  reportedCount: { type: Number, default: 1 },
  status: { type: String, enum: ['Under Review', 'Verified Global Threat'], default: 'Under Review' },
  description: { type: String, default: '' },
  heuristicNotes: { type: String, default: 'Analisis heuristik awal: Terdeteksi pola domain atau konten mencurigakan.' },
}, { timestamps: true });

export default mongoose.model('ReportedUrl', ReportedUrlSchema);