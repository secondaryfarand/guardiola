import communityRepository from './community.repository.js';

class CommunityService {
    async checkUrlExists(target) {
        const existing = await communityRepository.findUrlByTarget(target);
        return existing ? { exists: true, data: existing } : { exists: false };
    }

    async getAllReports() {
        return await communityRepository.findAll();
    }

    async handleNewReport(bodyData) {
        const { target, category, description, reporterName } = bodyData;
        if (!target || !category) {
            throw new Error('Target URL dan Kategori wajib diisi!');
        }

        let urlDoc = await communityRepository.findUrlByTarget(target);

        if (urlDoc) {
            // Pastikan hanya di-increment sekali per request valid
            urlDoc = await communityRepository.incrementReportCount(urlDoc._id);
            await communityRepository.createInteraction({
                urlId: urlDoc._id,
                reporterName: reporterName || 'Anonymous / Guest',
                actionType: 'CONFIRM_THREAT',
                description: description || ''
            });
        } else {
            urlDoc = await communityRepository.createUrl({ target, category, description });
            await communityRepository.createInteraction({
                urlId: urlDoc._id,
                reporterName: reporterName || 'Anonymous / Guest',
                actionType: 'NEW_REPORT',
                description
            });
        }

        return urlDoc;
    }

    async confirmThreat(reportId) {
        const urlDoc = await communityRepository.findByReportId(reportId);
        if (!urlDoc) {
            throw new Error('Laporan tidak ditemukan!');
        }

        const updated = await communityRepository.incrementReportCount(urlDoc._id);
        
        // Catat sebagai interaksi upvote
        await communityRepository.createInteraction({
            urlId: updated._id,
            reporterName: 'Anonymous / Guest',
            actionType: 'CONFIRM_THREAT',
            description: ''
        });

        return updated;
    }
}

export default new CommunityService();