import mongoose from 'mongoose';

const verifiedDomainSchema = new mongoose.Schema({
  domainName: { type: String, required: true, unique: true },
  entityName: { type: String, required: true },
  category: { type: String, enum: ['telecom', 'banking', 'government', 'ecommerce', 'other'], required: true },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.model('VerifiedDomain', verifiedDomainSchema);