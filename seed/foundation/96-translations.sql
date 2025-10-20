-- Translations Seed Data
-- File: 96-translations.sql
-- Description: Multi-language translations for Arabic compliance

-- Patient Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Patient 1 - Arabic Names
(uuid_from_text('trans-patient-1-first-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-1-uuid'), 'first_name', 'ar', 'أحمد', NOW(), NOW()),
(uuid_from_text('trans-patient-1-last-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-1-uuid'), 'last_name', 'ar', 'محمد', NOW(), NOW()),

-- Demo Patient 2 - Arabic Names
(uuid_from_text('trans-patient-2-first-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-2-uuid'), 'first_name', 'ar', 'فاطمة', NOW(), NOW()),
(uuid_from_text('trans-patient-2-last-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-2-uuid'), 'last_name', 'ar', 'علي', NOW(), NOW()),

-- Demo Patient 3 - Arabic Names
(uuid_from_text('trans-patient-3-first-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-3-uuid'), 'first_name', 'ar', 'عبدالله', NOW(), NOW()),
(uuid_from_text('trans-patient-3-last-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-3-uuid'), 'last_name', 'ar', 'الزهراني', NOW(), NOW()),

-- Demo Patient 4 - Arabic Names
(uuid_from_text('trans-patient-4-first-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-4-uuid'), 'first_name', 'ar', 'مريم', NOW(), NOW()),
(uuid_from_text('trans-patient-4-last-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-4-uuid'), 'last_name', 'ar', 'القحطاني', NOW(), NOW()),

-- Demo Patient 5 - Arabic Names
(uuid_from_text('trans-patient-5-first-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-5-uuid'), 'first_name', 'ar', 'خالد', NOW(), NOW()),
(uuid_from_text('trans-patient-5-last-name-ar-uuid'), 'patient', uuid_from_text('patient-demo-5-uuid'), 'last_name', 'ar', 'السعيد', NOW(), NOW());

-- Staff Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Senior Physician - Arabic Names
(uuid_from_text('trans-staff-senior-physician-first-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-senior-physician-uuid'), 'first_name', 'ar', 'د. محمد', NOW(), NOW()),
(uuid_from_text('trans-staff-senior-physician-last-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-senior-physician-uuid'), 'last_name', 'ar', 'الأحمد', NOW(), NOW()),

-- Demo Regular Physician - Arabic Names
(uuid_from_text('trans-staff-physician-first-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-physician-uuid'), 'first_name', 'ar', 'د. أحمد', NOW(), NOW()),
(uuid_from_text('trans-staff-physician-last-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-physician-uuid'), 'last_name', 'ar', 'المحمد', NOW(), NOW()),

-- Demo Nurse - Arabic Names
(uuid_from_text('trans-staff-nurse-first-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-nurse-uuid'), 'first_name', 'ar', 'ممرضة فاطمة', NOW(), NOW()),
(uuid_from_text('trans-staff-nurse-last-name-ar-uuid'), 'staff', uuid_from_text('staff-demo-nurse-uuid'), 'last_name', 'ar', 'العلي', NOW(), NOW());

-- Facility Name Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Demo Clinic - Arabic Names
(uuid_from_text('trans-facility-demo-clinic-name-ar-uuid'), 'facility', uuid_from_text('facility-demo-clinic-uuid'), 'name', 'ar', 'عيادة دبي الطبية', NOW(), NOW()),
(uuid_from_text('trans-facility-demo-clinic-address-ar-uuid'), 'facility', uuid_from_text('facility-demo-clinic-uuid'), 'address', 'ar', 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة', NOW(), NOW()),

-- Demo Hospital - Arabic Names
(uuid_from_text('trans-facility-demo-hospital-name-ar-uuid'), 'facility', uuid_from_text('facility-demo-hospital-uuid'), 'name', 'ar', 'مستشفى أبوظبي العام', NOW(), NOW()),
(uuid_from_text('trans-facility-demo-hospital-address-ar-uuid'), 'facility', uuid_from_text('facility-demo-hospital-uuid'), 'address', 'ar', 'شارع الكورنيش، أبوظبي، الإمارات العربية المتحدة', NOW(), NOW());

-- Specialty Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Internal Medicine
(uuid_from_text('trans-specialty-internal-medicine-name-ar-uuid'), 'specialty', uuid_from_text('specialty-internal-medicine-uuid'), 'name', 'ar', 'الطب الباطني', NOW(), NOW()),
(uuid_from_text('trans-specialty-internal-medicine-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-internal-medicine-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج الأمراض الداخلية', NOW(), NOW()),

-- Cardiology
(uuid_from_text('trans-specialty-cardiology-name-ar-uuid'), 'specialty', uuid_from_text('specialty-cardiology-uuid'), 'name', 'ar', 'أمراض القلب', NOW(), NOW()),
(uuid_from_text('trans-specialty-cardiology-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-cardiology-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض القلب والأوعية الدموية', NOW(), NOW()),

-- Pediatrics
(uuid_from_text('trans-specialty-pediatrics-name-ar-uuid'), 'specialty', uuid_from_text('specialty-pediatrics-uuid'), 'name', 'ar', 'طب الأطفال', NOW(), NOW()),
(uuid_from_text('trans-specialty-pediatrics-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-pediatrics-uuid'), 'description', 'ar', 'تخصص في رعاية وعلاج الأطفال من الولادة حتى المراهقة', NOW(), NOW()),

-- Orthopedics
(uuid_from_text('trans-specialty-orthopedics-name-ar-uuid'), 'specialty', uuid_from_text('specialty-orthopedics-uuid'), 'name', 'ar', 'جراحة العظام', NOW(), NOW()),
(uuid_from_text('trans-specialty-orthopedics-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-orthopedics-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج إصابات وأمراض العظام والمفاصل', NOW(), NOW()),

-- Dermatology
(uuid_from_text('trans-specialty-dermatology-name-ar-uuid'), 'specialty', uuid_from_text('specialty-dermatology-uuid'), 'name', 'ar', 'الأمراض الجلدية', NOW(), NOW()),
(uuid_from_text('trans-specialty-dermatology-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-dermatology-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الجلد والشعر والأظافر', NOW(), NOW()),

-- Ophthalmology
(uuid_from_text('trans-specialty-ophthalmology-name-ar-uuid'), 'specialty', uuid_from_text('specialty-ophthalmology-uuid'), 'name', 'ar', 'طب العيون', NOW(), NOW()),
(uuid_from_text('trans-specialty-ophthalmology-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-ophthalmology-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض العيون والجراحة', NOW(), NOW()),

-- ENT
(uuid_from_text('trans-specialty-ent-name-ar-uuid'), 'specialty', uuid_from_text('specialty-ent-uuid'), 'name', 'ar', 'أنف وأذن وحنجرة', NOW(), NOW()),
(uuid_from_text('trans-specialty-ent-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-ent-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الأنف والأذن والحنجرة', NOW(), NOW()),

-- Gynecology
(uuid_from_text('trans-specialty-gynecology-name-ar-uuid'), 'specialty', uuid_from_text('specialty-gynecology-uuid'), 'name', 'ar', 'أمراض النساء', NOW(), NOW()),
(uuid_from_text('trans-specialty-gynecology-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-gynecology-uuid'), 'description', 'ar', 'تخصص في رعاية صحة المرأة وأمراض الجهاز التناسلي', NOW(), NOW()),

-- Urology
(uuid_from_text('trans-specialty-urology-name-ar-uuid'), 'specialty', uuid_from_text('specialty-urology-uuid'), 'name', 'ar', 'جراحة المسالك البولية', NOW(), NOW()),
(uuid_from_text('trans-specialty-urology-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-urology-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج أمراض الجهاز البولي والتناسلي الذكري', NOW(), NOW()),

-- Psychiatry
(uuid_from_text('trans-specialty-psychiatry-name-ar-uuid'), 'specialty', uuid_from_text('specialty-psychiatry-uuid'), 'name', 'ar', 'الطب النفسي', NOW(), NOW()),
(uuid_from_text('trans-specialty-psychiatry-desc-ar-uuid'), 'specialty', uuid_from_text('specialty-psychiatry-uuid'), 'description', 'ar', 'تخصص في تشخيص وعلاج الاضطرابات النفسية والعقلية', NOW(), NOW());

-- Medication Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Paracetamol
(uuid_from_text('trans-med-paracetamol-name-ar-uuid'), 'medication', uuid_from_text('medication-paracetamol-uuid'), 'medication_name', 'ar', 'باراسيتامول', NOW(), NOW()),
(uuid_from_text('trans-med-paracetamol-generic-ar-uuid'), 'medication', uuid_from_text('medication-paracetamol-uuid'), 'generic_name', 'ar', 'أسيتامينوفين', NOW(), NOW()),

-- Ibuprofen
(uuid_from_text('trans-med-ibuprofen-name-ar-uuid'), 'medication', uuid_from_text('medication-ibuprofen-uuid'), 'medication_name', 'ar', 'ايبوبروفين', NOW(), NOW()),
(uuid_from_text('trans-med-ibuprofen-generic-ar-uuid'), 'medication', uuid_from_text('medication-ibuprofen-uuid'), 'generic_name', 'ar', 'ايبوبروفين', NOW(), NOW()),

-- Amoxicillin
(uuid_from_text('trans-med-amoxicillin-name-ar-uuid'), 'medication', uuid_from_text('medication-amoxicillin-uuid'), 'medication_name', 'ar', 'أموكسيسيلين', NOW(), NOW()),
(uuid_from_text('trans-med-amoxicillin-generic-ar-uuid'), 'medication', uuid_from_text('medication-amoxicillin-uuid'), 'generic_name', 'ar', 'أموكسيسيلين', NOW(), NOW()),

-- Metformin
(uuid_from_text('trans-med-metformin-name-ar-uuid'), 'medication', uuid_from_text('medication-metformin-uuid'), 'medication_name', 'ar', 'ميتفورمين', NOW(), NOW()),
(uuid_from_text('trans-med-metformin-generic-ar-uuid'), 'medication', uuid_from_text('medication-metformin-uuid'), 'generic_name', 'ar', 'ميتفورمين', NOW(), NOW()),

-- Atorvastatin
(uuid_from_text('trans-med-atorvastatin-name-ar-uuid'), 'medication', uuid_from_text('medication-atorvastatin-uuid'), 'medication_name', 'ar', 'أتورفاستاتين', NOW(), NOW()),
(uuid_from_text('trans-med-atorvastatin-generic-ar-uuid'), 'medication', uuid_from_text('medication-atorvastatin-uuid'), 'generic_name', 'ar', 'أتورفاستاتين', NOW(), NOW());

-- Clinical Notes Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Sample Clinical Note 1 - Arabic Translation
(uuid_from_text('trans-clinical-note-1-content-ar-uuid'), 'clinical_note', uuid_from_text('clinical-note-demo-1-uuid'), 'content', 'ar', 'مريض يشتكي من ألم في الصدر. الفحص السريري طبيعي. تم طلب تخطيط القلب والأشعة السينية. التشخيص: ألم في الصدر غير محدد السبب.', NOW(), NOW()),

-- Sample Clinical Note 2 - Arabic Translation
(uuid_from_text('trans-clinical-note-2-content-ar-uuid'), 'clinical_note', uuid_from_text('clinical-note-demo-2-uuid'), 'content', 'ar', 'مريضة تعاني من ارتفاع في ضغط الدم. تم قياس الضغط: 150/95. تم وصف دواء خافض للضغط. نصح المريضة بتغيير نمط الحياة.', NOW(), NOW()),

-- Sample Clinical Note 3 - Arabic Translation
(uuid_from_text('trans-clinical-note-3-content-ar-uuid'), 'clinical_note', uuid_from_text('clinical-note-demo-3-uuid'), 'content', 'ar', 'طفل يعاني من حمى وسعال. الفحص السريري يظهر التهاب في الحلق. تم وصف مضاد حيوي ومسكنات. التشخيص: التهاب الحلق البكتيري.', NOW(), NOW());

-- Prescription Instructions Translations (Arabic)
INSERT INTO translations (id, entity_type, entity_id, field_name, language_code, translated_text, created_at, updated_at) VALUES
-- Sample Prescription 1 - Arabic Instructions
(uuid_from_text('trans-prescription-1-sig-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-1-uuid'), 'sig', 'ar', 'حبة واحدة كل 8 ساعات مع الطعام', NOW(), NOW()),
(uuid_from_text('trans-prescription-1-instructions-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-1-uuid'), 'instructions', 'ar', 'تناول الدواء مع الطعام لتجنب تهيج المعدة. استمر في العلاج لمدة 7 أيام حتى لو تحسنت الأعراض.', NOW(), NOW()),

-- Sample Prescription 2 - Arabic Instructions
(uuid_from_text('trans-prescription-2-sig-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-2-uuid'), 'sig', 'ar', 'حبة واحدة صباحاً على معدة فارغة', NOW(), NOW()),
(uuid_from_text('trans-prescription-2-instructions-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-2-uuid'), 'instructions', 'ar', 'تناول الدواء صباحاً قبل الإفطار بساعة. راقب مستوى السكر في الدم بانتظام.', NOW(), NOW()),

-- Sample Prescription 3 - Arabic Instructions
(uuid_from_text('trans-prescription-3-sig-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-3-uuid'), 'sig', 'ar', 'ملعقة صغيرة كل 6 ساعات', NOW(), NOW()),
(uuid_from_text('trans-prescription-3-instructions-ar-uuid'), 'prescription', uuid_from_text('prescription-demo-3-uuid'), 'instructions', 'ar', 'اخلط الدواء مع الماء قبل تناوله. احفظه في الثلاجة بعد الفتح.', NOW(), NOW());
