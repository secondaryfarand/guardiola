# Guardiola - Guardian Online & Community Platform

Guardiola adalah platform web berbasis MERN Stack (MongoDB, Express.js, React, Node.js) yang dirancang untuk meningkatkan kesadaran keamanan siber (*cybersecurity*), menyediakan alat inspeksi URL secara *real-time*, simulasi scam interaktif, serta wadah pelaporan ancaman komunitas.

---

## Fitur Utama (Key Features)

1. **Real-Time URL Inspection**
   * Memeriksa dan menganalisis keamanan tautan web secara instan untuk mendeteksi indikasi phishing, malware, atau tautan berbahaya lainnya.
2. **Interactive Scam Simulator**
   * Modul edukasi gamifikasi yang mensimulasikan berbagai skenario penipuan digital (*social engineering* & *phishing*) guna melatih kewaspadaan pengguna.
3. **Pusat Edukasi & Literasi Siber (/edukasi)**
   * Kumpulan artikel, panduan keamanan, dan materi edukatif seputar praktik terbaik dalam menjaga keamanan data pribadi dan korporat.
4. **Community Threat Reporting**
   * Fitur pelaporan kolaboratif di mana pengguna dapat melaporkan dan memantau ancaman kejahatan siber yang sedang marak di komunitas.
5. **Clean & Minimalist UI Design**
   * Antarmuka modern dengan estetika *Clean White* dipadukan dengan aksen *Bright Red* yang intuitif, mendukung pengalaman pengguna yang responsif dan nyaman.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, React Router, CSS Modules / Modern Styling.
* **Backend**: Node.js, Express.js (RESTful API, Vercel Serverless Functions).
* **Database**: MongoDB & Mongoose.
* **Deployment**: Vercel (Monorepo Architecture with multi-service routing).

Cara menjalankan Project 
1. git clone https://github.com/secondaryfarand/guardiola.git
2. cd guardiola

Setup backend : 
1. cd backend
2. npm install
3. npm run dev

Setup frontend : 
1. cd frontend
2. npm install
3. npm run dev

Menjalankan Extension di lokal : 
1. Download file zip dan ekstrak ekstensi disini : https://drive.google.com/drive/folders/1UOcS31oJ2RAZYi8J5IGctJB-6nBI57_c?usp=sharing 
2. Buka Google Chrome dan ketik chrome://extensions/ di address bar.
3. Aktifkan Developer mode (Mode pengembang) di pojok kanan atas.
4. Klik tombol Load unpacked di pojok kiri atas.
5. Pilih folder direktori ekstensi Guardiola.
6. Selesai! Ekstensi langsung terpasang dan dapat di uji.

Contoh link yang dapat diuji : 
1. https://menang-giveaway.com
2. https://bit.ly/hadiah-palsu-tes.xyz
3. http://bit.ly/login-verifikasi-akun-bri
4. http://4.3.2.1.11.2.bit.ly/login-verifikasi-akun-bri

Contoh berupa teks : 
1. "SELAMAT! 🎉 Nomor WhatsApp Anda terpilih sebagai pemenang utama undian berhadiah uang tunai Rp 10.000.000 dari program gebyar akhir tahun. Segera klaim hadiah Anda sebelum masa berlaku habis dalam 1x24 jam melalui link resmi berikut: https://bit.ly/klaim-hadiah-pemenang-resmi"

