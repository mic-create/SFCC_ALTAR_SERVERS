/* SFCC Altar Servers Attendance System — database/seed.sql */
-- Seed default super admin user (Password: Admin@SFCC2026!)
-- Hash calculated via bcrypt (rounds: 12)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'System Administrator',
  'admin@sfcc-altarservers.org',
  '$2b$12$K8p5gqKxY8aH.9vK7eP6u.S7qgH2b0F3vM7j.pX1C3E5g7I9k0L2m',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Seed Sample Members
INSERT INTO members (member_id, full_name, class_level, status) VALUES
('AS001', 'Emmanuel Okonkwo', 'SS3', 'ACTIVE'),
('AS002', 'Gabriel Adebayo', 'SS2', 'ACTIVE'),
('AS003', 'Michael Chidubem', 'JSS3', 'ACTIVE'),
('AS004', 'Raphael Nnamdi', 'SS1', 'ACTIVE'),
('AS005', 'Francis Xavier', 'JSS2', 'ACTIVE')
ON CONFLICT (member_id) DO NOTHING;