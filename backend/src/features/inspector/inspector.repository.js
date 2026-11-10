import ThreatLog from '../../models/threatLog.model.js';
import HeuristicRule from '../../models/heuristicRule.model.js';
import VerifiedDomain from '../../models/verifiedDomain.model.js';

class InspectorRepository {
  async saveThreatLog(logData) {
    const log = new ThreatLog(logData);
    return await log.save();
  }

  async getAllRules() {
    return await HeuristicRule.find({});
  }

  async seedDefaultRules(rules) {
    for (const rule of rules) {
      await HeuristicRule.findOneAndUpdate(
        { ruleName: rule.ruleName },
        rule,
        { upsert: true, returnDocument: 'after' }
      );
    }
  }

  // Fungsi baru untuk mengecek whitelist domain resmi
  async findVerifiedDomain(domain) {
    return await VerifiedDomain.findOne({ domainName: domain });
  }

  async seedDefaultVerifiedDomains(domains) {
    for (const item of domains) {
      await VerifiedDomain.findOneAndUpdate(
        { domainName: item.domainName },
        item,
        { upsert: true, returnDocument: 'after' }
      );
    }
  }
}

export default new InspectorRepository();