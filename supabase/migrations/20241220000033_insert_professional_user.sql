INSERT INTO professionals (id, name, full_name, email, specialization, is_available)
VALUES ('3712aba0-4bbf-4345-9050-02d792b4504c', 'Professional', 'Professional User', 'professional@example.com', 'General', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  specialization = EXCLUDED.specialization,
  is_available = EXCLUDED.is_available;