console.log("[The Trust Trap] Content script aktif dengan sistem aman tab baru!");

function processLinkClick(event, targetUrl) {
  // Abaikan link internal, javascript, atau localhost
  if (
    targetUrl.startsWith('javascript:') || 
    targetUrl.startsWith('chrome://') || 
    targetUrl.includes('localhost:5173') || 
    targetUrl.includes('localhost:5000')
  ) {
    return;
  }

  // Cegah aksi bawaan browser
  event.preventDefault();
  event.stopPropagation();

  const linkElement = event.target.closest('a');
  const isNewTab = 
    (linkElement && linkElement.target === '_blank') || 
    event.ctrlKey || 
    event.metaKey || 
    event.button === 1;

  if (isNewTab) {
    // Minta background.js membukakan tab baru secara aman
    chrome.runtime.sendMessage({ action: 'openInspectNewTab', targetUrl: targetUrl });
  } else {
    // Buka di tab yang sama
    const inspectUrl = `http://localhost:5173/?inspect=${encodeURIComponent(targetUrl)}`;
    window.location.href = inspectUrl;
  }
}

// Tangkap klik biasa & target="_blank"
document.addEventListener('click', (event) => {
  const linkElement = event.target.closest('a');
  if (!linkElement || !linkElement.href) return;
  processLinkClick(event, linkElement.href);
}, true);

// Tangkap Middle-Click (klik roda mouse / auxclick)
document.addEventListener('auxclick', (event) => {
  if (event.button === 1) {
    const linkElement = event.target.closest('a');
    if (!linkElement || !linkElement.href) return;
    processLinkClick(event, linkElement.href);
  }
}, true);


// console.log("[The Trust Trap] Smart Guardian aktif dan memantau keamanan tautan.");

// async function handleLinkClick(event) {
//   const linkElement = event.target.closest('a');
//   if (!linkElement || !linkElement.href) return;

//   const targetUrl = linkElement.href;

//   // Abaikan link internal, javascript, atau localhost
//   if (
//     targetUrl.startsWith('javascript:') || 
//     targetUrl.startsWith('chrome://') || 
//     targetUrl.includes('localhost:5173') || 
//     targetUrl.includes('localhost:5000')
//   ) {
//     return;
//   }

//   // Tunda navigasi sementara untuk memeriksa ke backend secara asinkron
//   event.preventDefault();

//   const isNewTab = 
//     linkElement.target === '_blank' || 
//     event.ctrlKey || 
//     event.metaKey || 
//     event.button === 1;

//   try {
//     // Panggil backend secara diam-diam untuk memindai URL
//     const response = await fetch('http://localhost:5000/api/v1/inspector/scan', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ inputData: targetUrl, inputType: 'url' })
//     });

//     const data = await response.json();
    
//     if (data.status === 'success') {
//       const { riskScore, riskLevel } = data.data;

//       // TENTUKAN AMBANG BATAS (THRESHOLD)
//       // Misalnya: Jika skor >= 40 (Medium, High, Critical), redirect ke web kita untuk dicegah
//       if (riskScore >= 40 || riskLevel === 'High' || riskLevel === 'Critical') {
//         const warningUrl = `http://localhost:5173/?inspect=${encodeURIComponent(targetUrl)}`;
        
//         if (isNewTab) {
//           window.open(warningUrl, '_blank');
//         } else {
//           window.location.href = warningUrl;
//         }
//         return;
//       }
//     }

//     // JIKA AMAN (Skor < 40): Lanjutkan navigasi normal seperti biasa!
//     console.log("[The Trust Trap] Tautan aman, melanjutkan navigasi:", targetUrl);
//     if (isNewTab) {
//       window.open(targetUrl, '_blank');
//     } else {
//       window.location.href = targetUrl;
//     }

//   } catch (err) {
//     console.error("[The Trust Trap] Gagal menghubungi backend, mengizinkan navigasi:", err);
//     // Fallback jika backend mati: biarkan user tetap bisa browsing
//     if (isNewTab) {
//       window.open(targetUrl, '_blank');
//     } else {
//       window.location.href = targetUrl;
//     }
//   }
// }

// // Tangkap klik biasa & target="_blank"
// document.addEventListener('click', (event) => {
//   handleLinkClick(event);
// }, true);

// // Tangkap Middle-Click (klik roda mouse)
// document.addEventListener('auxclick', (event) => {
//   if (event.button === 1) {
//     handleLinkClick(event);
//   }
// }, true);