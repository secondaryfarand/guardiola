import mongoose from 'mongoose';

const threatLogSchema = new mongoose.Schema({
  inputData: { type: String, required: true },
  inputType: { type: String, enum: ['url', 'text'], required: true },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['Safe', 'Low', 'Medium', 'High', 'Critical'], required: true },
  redFlags: [{ type: String }],
  matchedRules: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ThreatLog', threatLogSchema);