import inspectorRepository from './inspector.repository.js';

class InspectorService {
  constructor() {
    this.initDefaultRules();
    this.initDefaultWhitelist();
  }

  async initDefaultRules() {
    const defaultRules = [
      // Kategori 1: Psikologi & Urgensi
      { 
        ruleName: 'Urgency Trigger', 
        category: 'behavioral', 
        pattern: 'segera|urgent|limited time|dalam waktu 1x24 jam|sekarang juga', 
        weight: 15, 
        description: 'Tekanan psikologis mendesak.' 
      },
      { 
        ruleName: 'Fear & Threat Tactic', 
        category: 'behavioral', 
        pattern: 'akun diblokir|suspended|terdeteksi aktivitas mencurigakan|segera konfirmasi', 
        weight: 20, 
        description: 'Taktik menakut-nakuti pengguna agar panik.' 
      },

      // Kategori 2: Umpan & Penipuan Komersial
      { 
        ruleName: 'Fake Giveaway', 
        category: 'giveaway', 
        pattern: 'selamat anda menang|hadiah tunai|claim voucher|free balance|undian berhadiah', 
        weight: 25, 
        description: 'Indikasi penipuan hadiah fiktif.' 
      },
      { 
        ruleName: 'Job Scam / Administrative Fee', 
        category: 'job_scam', 
        pattern: 'biaya administrasi|deposit awal|training fee|kirim cv ke whatsapp|akomodasi tiket', 
        weight: 25, 
        description: 'Lowongan kerja fiktif berkedok biaya.' 
      },

      // Kategori 3: Pencurian Kredensial & Autentikasi Palsu
      { 
        ruleName: 'Credential Harvesting Pattern', 
        category: 'phishing', 
        pattern: 'verify account|login ulang|konfirmasi data|update password|signin-auth|validate-id', 
        weight: 30, 
        description: 'Pola halaman login atau verifikasi palsu.' 
      },
      { 
        ruleName: 'Financial / Banking Trap', 
        category: 'phishing', 
        pattern: 'internet-banking|m-banking|bri-bripoin|bca-login|mandiri-aktivasi', 
        weight: 35, 
        description: 'Pelesetan atau peniruan entitas perbankan.' 
      },

      // Kategori 4: Infrastruktur & Pola Teknis URL
      { 
        ruleName: 'Suspicious TLD Extension', 
        category: 'infrastructure', 
        pattern: '\\.(xyz|top|ru|tk|gq|cn|buzz|Work|click)$', 
        weight: 20, 
        description: 'Penggunaan TLD yang sering disalahgunakan untuk spam/phishing.' 
      },
      { 
        ruleName: 'URL Shortener Gateway', 
        category: 'infrastructure', 
        pattern: 'bit\\.ly|tinyurl|t\\.co|short\\.url|wa\\.link/\\w+', 
        weight: 15, 
        description: 'Penyingkat tautan yang menyembunyikan destinasi asli.' 
      },
      { 
        ruleName: 'IP Address as Hostname', 
        category: 'infrastructure', 
        pattern: '^https?:\\/\\/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', 
        weight: 40, 
        description: 'Penggunaan alamat IP langsung alih-alih domain resmi.' 
      },
      { 
        ruleName: 'Official Domain Verification', 
        category: 'whitelist', 
        pattern: '(tokopedia\\.com|shopee\\.co\\.id|bca\\.co\\.id|mandiri\\.co\\.id|gov\\.id|ac\\.id)', 
        weight: -40, // Mengurangi bobot risiko secara signifikan jika domainnya terbukti resmi!
        description: 'Domain institusi atau e-commerce resmi yang tervalidasi.' 
      },
      { 
        ruleName: 'Suspicious Free Hosting Subdomain', 
        category: 'infrastructure', 
        pattern: '(blogspot\\.com|wordpress\\.com|github\\.io|vercel\\.app|netlify\\.app)\\/.*(bca|dana|shopee|gopay|bri|hadiah|win)', 
        weight: 35, // Sangat berbahaya karena brand besar memakai hosting gratisan
        description: 'Brand terkenal menggunakan subdomain/hosting gratis pihak ketiga.' 
      },
      { 
        ruleName: 'Financial Extortion Trap (Minta Biaya/Transfer Duluan)', 
        category: 'behavioral', 
        pattern: 'transfer dulu|bayar pajak|biaya administrasi di awal|talangi|pajak ditanggung pemenang', 
        weight: 45, // Ciri mutlak penipuan hadiah/loker karena instansi resmi tidak pernah minta fee di depan
        description: 'Modus klasik meminta korban mengirimkan sejumlah uang terlebih dahulu.' 
      }
    ];
    await inspectorRepository.seedDefaultRules(defaultRules);
  }

  async initDefaultWhitelist() {
    const defaultDomains = [
      { domainName: 'telkomsel.com', entityName: 'PT Telkomsel Indonesia', category: 'telecom' },
      { domainName: 'bca.co.id', entityName: 'Bank Central Asia', category: 'banking' },
      { domainName: 'tokopedia.com', entityName: 'Tokopedia', category: 'ecommerce' }
    ];
    await inspectorRepository.seedDefaultVerifiedDomains(defaultDomains);
  }

  // Fungsi helper untuk mengekstrak domain dari string URL/teks
  extractDomain(input) {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
    const match = input.match(urlRegex);
    return match ? match[1].toLowerCase() : null;
  }

  async analyzeInput(inputData, inputType, extractedUrl = null) {
    const rules = await inspectorRepository.getAllRules();
    
    let textScore = 0;
    let urlScore = 0;
    const redFlags = [];
    const matchedRules = [];

    const lowerInput = inputData.toLowerCase();
    const targetUrlToCheck = extractedUrl || (inputType === 'url' ? inputData : '');

    // 1. Analisis Rule Psikologis / Teks Chat (Social Engineering)
    for (const rule of rules) {
      // Filter rule yang berfokus pada psikologis/teks (atau evaluasi semua rule pada teks utama)
      try {
        const regex = new RegExp(rule.pattern, 'i');
        
        // Evaluasi pada teks utama (pesan chat)
        if (rule.category !== 'infrastructure' && regex.test(lowerInput)) {
          textScore += rule.weight;
          redFlags.push(`[Teks] ${rule.description}`);
          matchedRules.push(rule.ruleName);
        }
      } catch (err) {
        console.error(`Error rule text:`, err.message);
      }
    }

    // 2. Analisis Karakteristik Tautan / URL (jika ada URL atau extractedUrl)
    if (targetUrlToCheck) {
      const lowerUrl = targetUrlToCheck.toLowerCase();
      for (const rule of rules) {
        try {
          const regex = new RegExp(rule.pattern, 'i');
          // Evaluasi khusus aturan infrastruktur atau domain pada URL
          if ((rule.category === 'infrastructure' || rule.category === 'phishing') && regex.test(lowerUrl)) {
            urlScore += rule.weight;
            redFlags.push(`[URL] ${rule.description}`);
            if (!matchedRules.includes(rule.ruleName)) matchedRules.push(rule.ruleName);
          }
        } catch (err) {
          console.error(`Error rule url:`, err.message);
        }
      }
    }

    // 3. Penggabungan Bobot Skor Akhir (Weighted Composite Score)
    // Misal: Kombinasi proporsional antara ancaman teks psikologis dan ancaman URL
    let totalScore = textScore + urlScore;
    let riskScore = Math.min(totalScore, 100);

    // 4. Penentuan Level Risiko Akhir
    let riskLevel = 'Safe';
    if (riskScore >= 75) riskLevel = 'Critical';
    else if (riskScore >= 50) riskLevel = 'High';
    else if (riskScore >= 25) riskLevel = 'Medium';
    else if (riskScore > 0) riskLevel = 'Low';

    const threatLogData = { inputData, inputType, riskScore, riskLevel, redFlags, matchedRules };
    const savedLog = await inspectorRepository.saveThreatLog(threatLogData);

    return {
      id: savedLog._id,
      riskScore,
      riskLevel,
      redFlags,
      matchedRules,
      analyzedAt: savedLog.createdAt
    };
  }
}

export default new InspectorService();