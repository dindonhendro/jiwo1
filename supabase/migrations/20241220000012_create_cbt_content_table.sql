CREATE TABLE IF NOT EXISTS cbt_content (
  id SERIAL PRIMARY KEY,
  step INT NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  examples TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cbt_content (step, title, prompt_text, examples) VALUES
(1, 'Psychoeducation',
 'CBT (Cognitive Behavioral Therapy) adalah metode terapi yang membantu memahami hubungan antara **pikiran, perasaan, dan perilaku**. Pikiran negatif dapat memengaruhi emosi dan tindakan kita. Dalam sesi ini, kita akan belajar mengenali pikiran tersebut, menantangnya, dan mencari cara berpikir yang lebih seimbang. Apakah kamu siap memulai?',
 NULL),

(2, 'Mood Check-in',
 'Mari kita mulai dengan memeriksa suasana hati kamu. Dari skala **1 sampai 10**, berapa tingkat mood kamu sekarang? (1 = sangat buruk, 10 = sangat baik).',
 NULL),

(3, 'Identify Thought',
 'Sekarang, coba pikirkan momen terakhir kamu merasa tidak enak atau cemas. **Apa pikiran otomatis** yang muncul di kepala kamu saat itu?',
 NULL),

(4, 'Challenge Thought',
 'Bagus, kita sudah tahu pikiran otomatisnya. Sekarang mari kita tantang pikiran itu: - Apa bukti yang **mendukung** pikiran ini? - Apa bukti yang **menentangnya**?',
 'Contoh: Pikiran: "Saya gagal, jadi saya tidak berguna." 
  Bukti mendukung: Saya memang gagal di ujian terakhir. 
  Bukti menentang: Saya pernah berhasil di ujian sebelumnya, dan teman saya menganggap saya pintar.'),

(5, 'Reframe',
 'Sekarang coba kita lihat lagi. Jika seorang temanmu punya pikiran itu, apa yang akan kamu katakan padanya? Coba tuliskan cara melihat situasi ini dengan lebih **seimbang atau positif**.',
 'Contoh: Pikiran otomatis: "Saya akan selalu gagal." 
  Reframe: "Saya pernah gagal, tapi juga pernah berhasil. Kegagalan hari ini bukan berarti selamanya."'),

(6, 'Behavioral Experiment / Homework',
 'Untuk latihan, mari coba tulis **thought diary** hari ini: - Situasi yang terjadi - Pikiran otomatis - Perasaan (0–100%) - Bukti mendukung / menolak - Pikiran baru yang lebih seimbang. Apakah kamu mau mulai menulisnya?',
 NULL),

(7, 'Track Progress',
 'Bagaimana perkembangan kamu selama seminggu terakhir? Apakah ada perubahan mood, cara berpikir, atau aktivitas yang terasa lebih baik dibanding sebelumnya?',
 NULL),

(8, 'Relapse Prevention',
 'Ingat, pikiran negatif bisa muncul lagi di masa depan. Apa strategi yang menurutmu bisa kamu gunakan jika pikiran itu muncul kembali? Contoh: berbicara dengan teman, melakukan aktivitas menyenangkan, atau menulis ulang pikiran.',
 NULL),

(9, 'Closing / Reflection',
 'Bagus sekali! Kamu sudah menyelesaikan latihan CBT hari ini. Ingat bahwa perubahan butuh waktu, tapi setiap langkah kecil itu penting. Apa satu hal positif yang kamu pelajari dari sesi hari ini?',
 NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE cbt_content;
