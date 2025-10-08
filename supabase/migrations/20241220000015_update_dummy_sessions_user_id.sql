DELETE FROM sessions WHERE user_id IN ('test-user-001', 'test-user-002', 'test-user-003');

INSERT INTO sessions (user_id, step, user_message, created_at) VALUES
  ('1e510782-ad6a-41a2-933f-16786469385d', 1, 'Saya ingin belajar tentang CBT', NOW() - INTERVAL '5 days'),
  ('1e510782-ad6a-41a2-933f-16786469385d', 2, 'Saya merasa cemas hari ini', NOW() - INTERVAL '4 days'),
  ('1e510782-ad6a-41a2-933f-16786469385d', 3, 'Saya pikir saya akan gagal dalam ujian', NOW() - INTERVAL '3 days'),
  ('1e510782-ad6a-41a2-933f-16786469385d', 4, 'Mungkin saya terlalu keras pada diri sendiri', NOW() - INTERVAL '2 days'),
  ('1e510782-ad6a-41a2-933f-16786469385d', 5, 'Saya akan mencoba berpikir lebih positif', NOW() - INTERVAL '1 day');
