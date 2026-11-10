import ReportedUrl from '../../models/reportedUrl.model.js';
import CommunityReport from '../../models/communityReport.model.js';

class CommunityRepository {
    async findUrlByTarget(target) {
        return await ReportedUrl.findOne({ target: target.trim() });
    }

    async createUrl(data) {
        const randomId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
        const newUrl = new ReportedUrl({ ...data, reportId: randomId });
        return await newUrl.save();
    }

    async incrementReportCount(urlId) {
        const updatedUrl = await ReportedUrl.findByIdAndUpdate(
            urlId, { 
                $inc: { reportedCount: 1 } 
            },{ returnDocument: 'after' }
        );
        if (!updatedUrl) return null;
        if (updatedUrl.reportedCount >= 10 && updatedUrl.status !== 'Verified Global Threat') {
            updatedUrl.status = 'Verified Global Threat';
            await updatedUrl.save();
        }
        return updatedUrl;
    }

    async createInteraction(interactionData) {
        const interaction = new CommunityReport(interactionData);
        return await interaction.save();
    }

    // --- Fungsi Lama yang Dipertahankan Namanya ---
    async findAll() {
        // Mengambil data dari tabel utama ReportedUrl
        return await ReportedUrl.find().sort({ createdAt: -1 });
    }

    async create(data) {
        // Fallback untuk create standar
        const randomId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
        const newReport = new ReportedUrl({ ...data, reportId: randomId });
        return await newReport.save();
    }

    async findByReportId(reportId) {
        return await ReportedUrl.findOne({ reportId });
    }

    async updateCountAndStatus(reportId) {
        const updatedReport = await ReportedUrl.findOneAndUpdate(
            { reportId },
            { $inc: { reportedCount: 1 } },
            { returnDocument: 'after' }
        );

        if (!updatedReport) return null;

        if (updatedReport.reportedCount >= 10 && updatedReport.status !== 'Verified Global Threat') {
            updatedReport.status = 'Verified Global Threat';
            await updatedReport.save();
        }
        return updatedReport;
    }
}

export default new CommunityRepository();