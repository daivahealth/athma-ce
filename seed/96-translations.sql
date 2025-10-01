-- Translations Seed Data
-- File: 96-translations.sql
-- Description: Multi-language translations for Arabic compliance

-- Patient Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Patient 1 - Arabic Names
('trans-patient-1-first-name-ar-uuid', 'patient', 'patient-demo-1-uuid', 'first_name', 'ar', 'أحمد', NOW(), NOW()),
('trans-patient-1-last-name-ar-uuid', 'patient', 'patient-demo-1-uuid', 'last_name', 'ar', 'محمد', NOW(), NOW()),

-- Demo Patient 2 - Arabic Names
('trans-patient-2-first-name-ar-uuid', 'patient', 'patient-demo-2-uuid', 'first_name', 'ar', 'فاطمة', NOW(), NOW()),
('trans-patient-2-last-name-ar-uuid', 'patient', 'patient-demo-2-uuid', 'last_name', 'ar', 'علي', NOW(), NOW()),

-- Demo Patient 3 - Arabic Names
('trans-patient-3-first-name-ar-uuid', 'patient', 'patient-demo-3-uuid', 'first_name', 'ar', 'عبدالله', NOW(), NOW()),
('trans-patient-3-last-name-ar-uuid', 'patient', 'patient-demo-3-uuid', 'last_name', 'ar', 'الزهراني', NOW(), NOW()),

-- Demo Patient 4 - Arabic Names
('trans-patient-4-first-name-ar-uuid', 'patient', 'patient-demo-4-uuid', 'first_name', 'ar', 'مريم', NOW(), NOW()),
('trans-patient-4-last-name-ar-uuid', 'patient', 'patient-demo-4-uuid', 'last_name', 'ar', 'القحطاني', NOW(), NOW()),

-- Demo Patient 5 - Arabic Names
('trans-patient-5-first-name-ar-uuid', 'patient', 'patient-demo-5-uuid', 'first_name', 'ar', 'خالد', NOW(), NOW()),
('trans-patient-5-last-name-ar-uuid', 'patient', 'patient-demo-5-uuid', 'last_name', 'ar', 'السعيد', NOW(), NOW());

-- Staff Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Senior Physician - Arabic Names
('trans-staff-senior-physician-first-name-ar-uuid', 'staff', 'staff-demo-senior-physician-uuid', 'first_name', 'ar', 'د. محمد', NOW(), NOW()),
('trans-staff-senior-physician-last-name-ar-uuid', 'staff', 'staff-demo-senior-physician-uuid', 'last_name', 'ar', 'الأحمد', NOW(), NOW()),

-- Demo Regular Physician - Arabic Names
('trans-staff-physician-first-name-ar-uuid', 'staff', 'staff-demo-physician-uuid', 'first_name', 'ar', 'د. أحمد', NOW(), NOW()),
('trans-staff-physician-last-name-ar-uuid', 'staff', 'staff-demo-physician-uuid', 'last_name', 'ar', 'المحمد', NOW(), NOW()),

-- Demo Nurse - Arabic Names
('trans-staff-nurse-first-name-ar-uuid', 'staff', 'staff-demo-nurse-uuid', 'first_name', 'ar', 'ممرضة فاطمة', NOW(), NOW()),
('trans-staff-nurse-last-name-ar-uuid', 'staff', 'staff-demo-nurse-uuid', 'last_name', 'ar', 'العلي', NOW(), NOW());

-- Facility Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Clinic - Arabic Names
('trans-facility-demo-clinic-name-ar-uuid', 'facility', 'facility-demo-clinic-uuid', 'name', 'ar', 'عيادة دبي الطبية', NOW(), NOW()),
('trans-facility-demo-clinic-address-ar-uuid', 'facility', 'facility-demo-clinic-uuid', 'address', 'ar', 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة', NOW(), NOW()),

-- Demo Hospital - Arabic Names
('trans-facility-demo-hospital-name-ar-uuid', 'facility', 'facility-demo-hospital-uuid', 'name', 'ar', 'مستشفى أبوظبي العام', NOW(), NOW()),
('trans-facility-demo-hospital-address-ar-uuid', 'facility', 'facility-demo-hospital-uuid', 'address', 'ar', 'شارع الكورنيش، أبوظبي، الإمارات العربية المتحدة', NOW(), NOW());

-- Specialty Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Internal Medicine
('trans-specialty-internal-medicine-name-ar-uuid', 'specialty', 'specialty-internal-medicine-uuid', 'name', 'ar', 'الطب الباطني', NOW(), NOW()),
('trans-specialty-internal-medicine-desc-ar-uuid', 'specialty', 'specialty-internal-medicine-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج الأمراض الداخلية', NOW(), NOW()),

-- Cardiology
('trans-specialty-cardiology-name-ar-uuid', 'specialty', 'specialty-cardiology-uuid', 'name', 'ar', 'أمراض القلب', NOW(), NOW()),
('trans-specialty-cardiology-desc-ar-uuid', 'specialty', 'specialty-cardiology-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض القلب والأوعية الدموية', NOW(), NOW()),

-- Pediatrics
('trans-specialty-pediatrics-name-ar-uuid', 'specialty', 'specialty-pediatrics-uuid', 'name', 'ar', 'طب الأطفال', NOW(), NOW()),
('trans-specialty-pediatrics-desc-ar-uuid', 'specialty', 'specialty-pediatrics-uuid', 'description', 'ar', 'تخصص في رعاية وعلاج الأطفال من الولادة حتى المراهقة', NOW(), NOW()),

-- Orthopedics
('trans-specialty-orthopedics-name-ar-uuid', 'specialty', 'specialty-orthopedics-uuid', 'name', 'ar', 'جراحة العظام', NOW(), NOW()),
('trans-specialty-orthopedics-desc-ar-uuid', 'specialty', 'specialty-orthopedics-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج إصابات وأمراض العظام والمفاصل', NOW(), NOW()),

-- Dermatology
('trans-specialty-dermatology-name-ar-uuid', 'specialty', 'specialty-dermatology-uuid', 'name', 'ar', 'الأمراض الجلدية', NOW(), NOW()),
('trans-specialty-dermatology-desc-ar-uuid', 'specialty', 'specialty-dermatology-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الجلد والشعر والأظافر', NOW(), NOW()),

-- Ophthalmology
('trans-specialty-ophthalmology-name-ar-uuid', 'specialty', 'specialty-ophthalmology-uuid', 'name', 'ar', 'طب العيون', NOW(), NOW()),
('trans-specialty-ophthalmology-desc-ar-uuid', 'specialty', 'specialty-ophthalmology-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض العيون والجراحة', NOW(), NOW()),

-- ENT
('trans-specialty-ent-name-ar-uuid', 'specialty', 'specialty-ent-uuid', 'name', 'ar', 'أنف وأذن وحنجرة', NOW(), NOW()),
('trans-specialty-ent-desc-ar-uuid', 'specialty', 'specialty-ent-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الأنف والأذن والحنجرة', NOW(), NOW()),

-- Gynecology
('trans-specialty-gynecology-name-ar-uuid', 'specialty', 'specialty-gynecology-uuid', 'name', 'ar', 'أمراض النساء', NOW(), NOW()),
('trans-specialty-gynecology-desc-ar-uuid', 'specialty', 'specialty-gynecology-uuid', 'description', 'ar', 'تخصص في رعاية صحة المرأة وأمراض الجهاز التناسلي', NOW(), NOW()),

-- Urology
('trans-specialty-urology-name-ar-uuid', 'specialty', 'specialty-urology-uuid', 'name', 'ar', 'جراحة المسالك البولية', NOW(), NOW()),
('trans-specialty-urology-desc-ar-uuid', 'specialty', 'specialty-urology-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الجهاز البولي والتناسلي الذكري', NOW(), NOW()),

-- Psychiatry
('trans-specialty-psychiatry-name-ar-uuid', 'specialty', 'specialty-psychiatry-uuid', 'name', 'ar', 'الطب النفسي', NOW(), NOW()),
('trans-specialty-psychiatry-desc-ar-uuid', 'specialty', 'specialty-psychiatry-uuid', 'description', 'ar', 'تخصص في تشخيص وعلاج الاضطرابات النفسية والعقلية', NOW(), NOW());

-- Medication Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Paracetamol
('trans-med-paracetamol-name-ar-uuid', 'medication', 'medication-paracetamol-uuid', 'medication_name', 'ar', 'باراسيتامول', NOW(), NOW()),
('trans-med-paracetamol-generic-ar-uuid', 'medication', 'medication-paracetamol-uuid', 'generic_name', 'ar', 'أسيتامينوفين', NOW(), NOW()),

-- Ibuprofen
('trans-med-ibuprofen-name-ar-uuid', 'medication', 'medication-ibuprofen-uuid', 'medication_name', 'ar', 'ايبوبروفين', NOW(), NOW()),
('trans-med-ibuprofen-generic-ar-uuid', 'medication', 'medication-ibuprofen-uuid', 'generic_name', 'ar', 'ايبوبروفين', NOW(), NOW()),

-- Amoxicillin
('trans-med-amoxicillin-name-ar-uuid', 'medication', 'medication-amoxicillin-uuid', 'medication_name', 'ar', 'أموكسيسيلين', NOW(), NOW()),
('trans-med-amoxicillin-generic-ar-uuid', 'medication', 'medication-amoxicillin-uuid', 'generic_name', 'ar', 'أموكسيسيلين', NOW(), NOW()),

-- Metformin
('trans-med-metformin-name-ar-uuid', 'medication', 'medication-metformin-uuid', 'medication_name', 'ar', 'ميتفورمين', NOW(), NOW()),
('trans-med-metformin-generic-ar-uuid', 'medication', 'medication-metformin-uuid', 'generic_name', 'ar', 'ميتفورمين', NOW(), NOW()),

-- Atorvastatin
('trans-med-atorvastatin-name-ar-uuid', 'medication', 'medication-atorvastatin-uuid', 'medication_name', 'ar', 'أتورفاستاتين', NOW(), NOW()),
('trans-med-atorvastatin-generic-ar-uuid', 'medication', 'medication-atorvastatin-uuid', 'generic_name', 'ar', 'أتورفاستاتين', NOW(), NOW());

-- Clinical Notes Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Sample Clinical Note 1 - Arabic Translation
('trans-clinical-note-1-content-ar-uuid', 'clinical_note', 'clinical-note-demo-1-uuid', 'content', 'ar', 'مريض يشتكي من ألم في الصدر. الفحص السريري طبيعي. تم طلب تخطيط القلب والأشعة السينية. التشخيص: ألم في الصدر غير محدد السبب.', NOW(), NOW()),

-- Sample Clinical Note 2 - Arabic Translation
('trans-clinical-note-2-content-ar-uuid', 'clinical_note', 'clinical-note-demo-2-uuid', 'content', 'ar', 'مريضة تعاني من ارتفاع في ضغط الدم. تم قياس الضغط: 150/95. تم وصف دواء خافض للضغط. نصح المريضة بتغيير نمط الحياة.', NOW(), NOW()),

-- Sample Clinical Note 3 - Arabic Translation
('trans-clinical-note-3-content-ar-uuid', 'clinical_note', 'clinical-note-demo-3-uuid', 'content', 'ar', 'طفل يعاني من حمى وسعال. الفحص السريري يظهر التهاب في الحلق. تم وصف مضاد حيوي ومسكنات. التشخيص: التهاب الحلق البكتيري.', NOW(), NOW());

-- Prescription Instructions Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Sample Prescription 1 - Arabic Instructions
('trans-prescription-1-sig-ar-uuid', 'prescription', 'prescription-demo-1-uuid', 'sig', 'ar', 'حبة واحدة كل 8 ساعات مع الطعام', NOW(), NOW()),
('trans-prescription-1-instructions-ar-uuid', 'prescription', 'prescription-demo-1-uuid', 'instructions', 'ar', 'تناول الدواء مع الطعام لتجنب تهيج المعدة. استمر في العلاج لمدة 7 أيام حتى لو تحسنت الأعراض.', NOW(), NOW()),

-- Sample Prescription 2 - Arabic Instructions
('trans-prescription-2-sig-ar-uuid', 'prescription', 'prescription-demo-2-uuid', 'sig', 'ar', 'حبة واحدة صباحاً على معدة فارغة', NOW(), NOW()),
('trans-prescription-2-instructions-ar-uuid', 'prescription', 'prescription-demo-2-uuid', 'instructions', 'ar', 'تناول الدواء صباحاً قبل الإفطار بساعة. راقب مستوى السكر في الدم بانتظام.', NOW(), NOW()),

-- Sample Prescription 3 - Arabic Instructions
('trans-prescription-3-sig-ar-uuid', 'prescription', 'prescription-demo-3-uuid', 'sig', 'ar', 'ملعقة صغيرة كل 6 ساعات', NOW(), NOW()),
('trans-prescription-3-instructions-ar-uuid', 'prescription', 'prescription-demo-3-uuid', 'instructions', 'ar', 'اخلط الدواء مع الماء قبل تناوله. احفظه في الثلاجة بعد الفتح.', NOW(), NOW());
