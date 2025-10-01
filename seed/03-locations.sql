-- Locations Seed Data
-- File: 03-locations.sql
-- Description: Geographic locations for facilities

-- UAE Locations
INSERT INTO locations (id, name, address, city, emirate, country, postal_code, latitude, longitude, timezone, created_at, updated_at) VALUES
-- Dubai Locations
('location-dubai-sheikh-zayed-uuid', 'Sheikh Zayed Road', 'Sheikh Zayed Road, Dubai', 'Dubai', 'Dubai', 'UAE', '12345', 25.2048, 55.2708, 'Asia/Dubai', NOW(), NOW()),
('location-dubai-jbr-uuid', 'Jumeirah Beach Residence', 'JBR, Dubai Marina, Dubai', 'Dubai', 'Dubai', 'UAE', '12346', 25.0772, 55.1308, 'Asia/Dubai', NOW(), NOW()),
('location-dubai-business-bay-uuid', 'Business Bay', 'Business Bay, Dubai', 'Dubai', 'Dubai', 'UAE', '12347', 25.1881, 55.2642, 'Asia/Dubai', NOW(), NOW()),

-- Abu Dhabi Locations
('location-abu-dhabi-corniche-uuid', 'Corniche Road', 'Corniche Road, Abu Dhabi', 'Abu Dhabi', 'Abu Dhabi', 'UAE', '54321', 24.4539, 54.3773, 'Asia/Dubai', NOW(), NOW()),
('location-abu-dhabi-al-reem-uuid', 'Al Reem Island', 'Al Reem Island, Abu Dhabi', 'Abu Dhabi', 'Abu Dhabi', 'UAE', '54322', 24.5000, 54.3833, 'Asia/Dubai', NOW(), NOW()),
('location-abu-dhabi-khalifa-city-uuid', 'Khalifa City', 'Khalifa City, Abu Dhabi', 'Abu Dhabi', 'Abu Dhabi', 'UAE', '54323', 24.4167, 54.5000, 'Asia/Dubai', NOW(), NOW()),

-- Sharjah Locations
('location-sharjah-city-center-uuid', 'Sharjah City Center', 'City Center, Sharjah', 'Sharjah', 'Sharjah', 'UAE', '98765', 25.3573, 55.4033, 'Asia/Dubai', NOW(), NOW()),
('location-sharjah-al-majaz-uuid', 'Al Majaz', 'Al Majaz, Sharjah', 'Sharjah', 'Sharjah', 'UAE', '98766', 25.3667, 55.3833, 'Asia/Dubai', NOW(), NOW()),

-- Ajman Locations
('location-ajman-city-uuid', 'Ajman City', 'Ajman City Center, Ajman', 'Ajman', 'Ajman', 'UAE', '87654', 25.4054, 55.5136, 'Asia/Dubai', NOW(), NOW()),

-- Ras Al Khaimah Locations
('location-rak-city-uuid', 'Ras Al Khaimah City', 'Ras Al Khaimah City Center', 'Ras Al Khaimah', 'Ras Al Khaimah', 'UAE', '76543', 25.7895, 55.9592, 'Asia/Dubai', NOW(), NOW()),

-- Fujairah Locations
('location-fujairah-city-uuid', 'Fujairah City', 'Fujairah City Center', 'Fujairah', 'Fujairah', 'UAE', '65432', 25.1288, 56.3264, 'Asia/Dubai', NOW(), NOW()),

-- Umm Al Quwain Locations
('location-uaq-city-uuid', 'Umm Al Quwain City', 'Umm Al Quwain City Center', 'Umm Al Quwain', 'Umm Al Quwain', 'UAE', '54321', 25.5647, 55.5552, 'Asia/Dubai', NOW(), NOW());
