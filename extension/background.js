console.log("Status API webNavigation:", chrome.webNavigation);
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Hanya amankan frame utama

  const targetUrl = details.url;

  // Lewati pengecekan untuk localhost atau halaman internal ekstensi
  if (targetUrl.includes('localhost') || targetUrl.startsWith('chrome-extension://')) {
    return;
  }

  try {
    // 1. Panggil API Backend Inspector Anda
    const response = await fetch('http://localhost:5000/api/v1/inspector/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputData: targetUrl,
        inputType: 'url',
        extractedUrl: targetUrl
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      const { riskLevel, riskScore } = result.data;

      // 🌟 KUNCI UTAMA: Hanya redirect jika level risikonya High atau Critical
      if (riskLevel === 'High' || riskLevel === 'Critical') {
        
        // Arahkan ke halaman web Inspector Anda dengan menyertakan parameter target URL
        const warningGatewayUrl = `http://localhost:5173/?inspect=${encodeURIComponent(targetUrl)}`;
        
        // Alihkan (redirect) tab pengguna ke halaman warning gateway
        chrome.tabs.update(details.tabId, { url: warningGatewayUrl });
        
      } else {
        // Jika Safe, Low, atau Medium, biarkan pengguna lanjut mengakses situs tanpa gangguan
        console.log(`Tautan aman/rendah (${riskLevel} - ${riskScore}%). Navigasi diizinkan:`, targetUrl);
      }
    }
  } catch (error) {
    console.error('Gagal menghubungkan ekstensi ke backend inspector:', error);
  }
}, { url: [{ schemes: ['http', 'https'] }] });
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "inspectWithTrustTrap",
//     title: "Periksa dengan The Trust Trap",
//     contexts: ["selection", "link"]
//   });
// });

// chrome.contextMenus.onClicked.addListener((info) => {
//   const target = info.linkUrl || info.selectionText;
//   if (target) {
//     chrome.tabs.create({ url: `http://localhost:5173/?inspect=${encodeURIComponent(target)}` });
//   }
// });