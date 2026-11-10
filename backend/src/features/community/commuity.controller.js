import communityService from './community.service.js';

class CommunityController {
    checkUrl = async (req, res) => {
        try {
            const { target } = req.body;
            const result = await communityService.checkUrlExists(target);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    getReports = async (req, res) => {
        try {
            const data = await communityService.getAllReports();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // createReport = async (req, res) => {
    //     try {
    //         const data = await communityService.handleNewReport(req.body);
    //         res.status(201).json({ success: true, data });
    //     } catch (error) {
    //         res.status(400).json({ success: false, message: error.message });
    //     }
    // }

    // confirmThreat = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const data = await communityService.confirmThreat(id);
    //         res.status(200).json({ success: true, data });
    //     } catch (error) {
    //         res.status(404).json({ success: false, message: error.message });
    //     }
    // }

    createReport = async (req, res) => {
        try {
            const data = await communityService.handleNewReport(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            console.log("❌ [DEBUG CONTROLLER] createReport GAGAL:", error.message);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    confirmThreat = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await communityService.confirmThreat(id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.log("❌ [DEBUG CONTROLLER] confirmThreat GAGAL:", error.message);
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

export default new CommunityController();
