import mongoose from 'mongoose';

const CommunityReportSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReportedUrl', required: true },
  reporterName: { type: String, default: 'Anonymous / Guest' },
  actionType: { type: String, enum: ['NEW_REPORT', 'CONFIRM_THREAT'], default: 'NEW_REPORT' },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('CommunityReport', CommunityReportSchema);