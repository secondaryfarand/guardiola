import { generateReverseAiChatReply } from '../../utils/aiHelper.js';
import ReverseScenario from '../../models/ReverseScenario.model.js';

export async function getAllReverseScenarios(req, res) {
  try {
    const scenarios = await ReverseScenario.find({});
    res.status(200).json({ success: true, data: scenarios });
  } catch (error) {
    console.error("Gagal mengambil reverseScenario:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data dari database." });
  }
}

// GET: Mengambil detail satu reverseScenario berdasarkan ID/slug untuk ReversePlay
export async function getReverseScenarioById(req, res) {
  try {
    const { id } = req.params;
    const scenario = await ReverseScenario.findOne({ id });

    if (!scenario) {
      return res.status(404).json({ success: false, message: "ReverseScenario tidak ditemukan." });
    }

    res.status(200).json({ success: true, data: scenario });
  } catch (error) {
    console.error("Gagal mengambil detail reverseScenario:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
}


// ai
export async function handleReverseAiChat(req, res) {
  try {
    const { message, chatHistory, scenarioData } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong." });
    }

    // Panggil helper dinamis yang otomatis membaca skenario apa pun
    const aiReply = await generateReverseAiChatReply(chatHistory || [], message, scenarioData);

    res.status(200).json({
      success: true,
      reply: aiReply
    });

  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Gagal memproses simulasi AI karena seluruh key mengalami kendala kuota." 
    });
  }
}