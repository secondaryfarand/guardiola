import inspectorService from './inspector.service.js';

class InspectorController {
  async scanThreat(req, res, next) {
    try {
      const { inputData, inputType } = req.body;

      if (!inputData || !inputType) {
        return res.status(400).json({
          status: 'fail',
          message: 'Parameter inputData dan inputType wajib diisi.'
        });
      }

      if (!['url', 'text'].includes(inputType)) {
        return res.status(400).json({
          status: 'fail',
          message: "inputType harus bernilai 'url' atau 'text'."
        });
      }

      const analysisResult = await inspectorService.analyzeInput(inputData, inputType);

      return res.status(200).json({
        status: 'success',
        message: 'Analisis ancaman berhasil dilakukan.',
        data: analysisResult
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InspectorController();