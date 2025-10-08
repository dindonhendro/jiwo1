INSERT INTO sessions (user_id, step, user_message, created_at) VALUES
  ('test-user-001', 1, 'Saya ingin belajar tentang CBT', NOW() - INTERVAL '5 days'),
  ('test-user-001', 2, 'Saya merasa cemas hari ini', NOW() - INTERVAL '4 days'),
  ('test-user-001', 3, 'Saya pikir saya akan gagal dalam ujian', NOW() - INTERVAL '3 days'),
  ('test-user-002', 1, 'Halo, saya butuh bantuan', NOW() - INTERVAL '2 days'),
  ('test-user-002', 2, 'Mood saya sedang buruk', NOW() - INTERVAL '1 day'),
  ('test-user-003', 1, 'Saya merasa tertekan', NOW() - INTERVAL '6 hours'),
  ('test-user-003', 2, 'Saya merasa tidak berharga', NOW() - INTERVAL '3 hours'),
  ('test-user-003', 3, 'Semua orang membenci saya', NOW() - INTERVAL '1 hour'),
  ('test-user-003', 4, 'Mungkin saya terlalu keras pada diri sendiri', NOW() - INTERVAL '30 minutes');
