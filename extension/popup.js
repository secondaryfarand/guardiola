document.getElementById('scanBtn').addEventListener('click', async () => {
  const inputData = document.getElementById('targetInput').value.trim();
  const resultBox = document.getElementById('resultBox');
  const riskBadge = document.getElementById('riskBadge');
  const redFlagsList = document.getElementById('redFlagsList');

  if (!inputData) return;

  const inputType = inputData.includes('http') || inputData.includes('www.') ? 'url' : 'text';

  try {
    const response = await fetch('http://localhost:5000/api/v1/inspector/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputData, inputType })
    });

    const data = await response.json();
    if (data.status === 'success') {
      const res = data.data;
      resultBox.classList.remove('hidden');
      riskBadge.textContent = `${res.riskLevel} (${res.riskScore}%)`;
      riskBadge.style.backgroundColor = res.riskLevel === 'Critical' ? '#dc2626' : '#0C6038';

      redFlagsList.innerHTML = '';
      if (res.redFlags && res.redFlags.length > 0) {
        res.redFlags.forEach(flag => {
          const li = document.createElement('li');
          li.textContent = flag;
          redFlagsList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'Aman dari indikasi ancaman.';
        redFlagsList.appendChild(li);
      }
    }
  } catch (err) {
    alert('Gagal terhubung ke backend The Trust Trap.');
  }
});