import mongoose from 'mongoose';

const heuristicRuleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true, unique: true },
  category: { type: String, enum: ['phishing', 'job_scam', 'giveaway', 'general_spam'], required: true },
  pattern: { type: String, required: true },
  weight: { type: Number, required: true, default: 10 },
  description: { type: String, required: true }
});

export default mongoose.model('HeuristicRule', heuristicRuleSchema);