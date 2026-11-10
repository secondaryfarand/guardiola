import mongoose from 'mongoose';

const reverseScenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['CHAT_SIMULATION', 'MULTIPLE_CHOICE', 'ACTION_PICKER'], required: true },
  difficulty: { type: String, default: 'Interaktif' },
  description: { type: String, required: true },
  targetName: { type: String },
  initialMessage: { type: String },
  templates: [String],
  steps: [
    {
      type: { type: String },
      question: { type: String },
      options: [
        {
          id: String,
          text: String,
          isCorrect: Boolean,
          feedback: String,
          points: Number
        }
      ]
    }
  ]
}, { 
  timestamps: true,
  collection: 'reversescenarios'
});

export default mongoose.model('ReverseScenario', reverseScenarioSchema);