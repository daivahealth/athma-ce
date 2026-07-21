-- Oncology Catalog Seed Data
-- Schema: plugin_oncology  |  DB: zeal_clinical
-- Tenant: 11111111-1111-1111-1111-111111111111
-- Idempotent: ON CONFLICT DO NOTHING on all inserts

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    CREATE EXTENSION "uuid-ossp";
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. CANCER TYPES
-- ──────────────────────────────────────────────────────────────────────────────
INSERT INTO plugin_oncology.oncology_cancer_type_master
  (id, tenant_id, code, name, category, description, active, created_at, updated_at)
VALUES
  -- ── Solid Tumor: Breast ──────────────────────────────────────────────────
  (uuid_from_text('onco_ct_breast'),         '11111111-1111-1111-1111-111111111111'::uuid, 'BREAST_CA',         'Breast Cancer',                      'Solid Tumor',  'Malignant neoplasm of the breast (all subtypes)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_breast_her2'),    '11111111-1111-1111-1111-111111111111'::uuid, 'BREAST_HER2',       'Breast Cancer – HER2+',               'Solid Tumor',  'HER2-positive breast cancer', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_breast_tnbc'),    '11111111-1111-1111-1111-111111111111'::uuid, 'BREAST_TNBC',       'Breast Cancer – Triple Negative',     'Solid Tumor',  'ER-/PR-/HER2- breast cancer (TNBC)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_breast_hr_pos'),  '11111111-1111-1111-1111-111111111111'::uuid, 'BREAST_HR_POS',     'Breast Cancer – HR+/HER2-',           'Solid Tumor',  'Hormone receptor-positive, HER2-negative breast cancer', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_breast_male'),    '11111111-1111-1111-1111-111111111111'::uuid, 'BREAST_MALE',       'Male Breast Cancer',                  'Solid Tumor',  'Breast cancer occurring in male patients', true, NOW(), NOW()),

  -- ── Solid Tumor: Lung ────────────────────────────────────────────────────
  (uuid_from_text('onco_ct_nsclc'),          '11111111-1111-1111-1111-111111111111'::uuid, 'NSCLC',             'Non-Small Cell Lung Cancer (NSCLC)',  'Solid Tumor',  'Lung adenocarcinoma, squamous cell, large cell (non-small cell)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_nsclc_adeno'),    '11111111-1111-1111-1111-111111111111'::uuid, 'NSCLC_ADENO',       'NSCLC – Adenocarcinoma',              'Solid Tumor',  'Lung adenocarcinoma subtype', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_nsclc_sq'),       '11111111-1111-1111-1111-111111111111'::uuid, 'NSCLC_SQ',          'NSCLC – Squamous Cell Carcinoma',     'Solid Tumor',  'Squamous cell carcinoma of the lung', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_sclc'),           '11111111-1111-1111-1111-111111111111'::uuid, 'SCLC',              'Small Cell Lung Cancer (SCLC)',       'Solid Tumor',  'Neuroendocrine carcinoma of the lung with high mitotic rate', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_lung_net'),       '11111111-1111-1111-1111-111111111111'::uuid, 'LUNG_NET',          'Lung Carcinoid / NET',                'Solid Tumor',  'Typical and atypical lung carcinoid tumors', true, NOW(), NOW()),

  -- ── Solid Tumor: Gastrointestinal ────────────────────────────────────────
  (uuid_from_text('onco_ct_crc'),            '11111111-1111-1111-1111-111111111111'::uuid, 'CRC',               'Colorectal Cancer (CRC)',             'Solid Tumor',  'Malignant neoplasm of colon and/or rectum', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_colon'),          '11111111-1111-1111-1111-111111111111'::uuid, 'COLON_CA',          'Colon Cancer',                        'Solid Tumor',  'Malignant neoplasm of the colon', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_rectal'),         '11111111-1111-1111-1111-111111111111'::uuid, 'RECTAL_CA',         'Rectal Cancer',                       'Solid Tumor',  'Malignant neoplasm of the rectum', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gastric'),        '11111111-1111-1111-1111-111111111111'::uuid, 'GASTRIC_CA',        'Gastric Cancer',                      'Solid Tumor',  'Malignant neoplasm of the stomach', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gej'),            '11111111-1111-1111-1111-111111111111'::uuid, 'GEJ_CA',            'Gastroesophageal Junction (GEJ) Cancer','Solid Tumor', 'Cancer of the gastroesophageal junction (Siewert I–III)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_esophageal'),     '11111111-1111-1111-1111-111111111111'::uuid, 'ESOPHAGEAL_CA',     'Esophageal Cancer',                   'Solid Tumor',  'Squamous cell carcinoma and adenocarcinoma of the esophagus', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_pancreatic'),     '11111111-1111-1111-1111-111111111111'::uuid, 'PANCREATIC_CA',     'Pancreatic Cancer',                   'Solid Tumor',  'Ductal adenocarcinoma of the pancreas', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_hcc'),            '11111111-1111-1111-1111-111111111111'::uuid, 'HCC',               'Hepatocellular Carcinoma (HCC)',      'Solid Tumor',  'Primary liver cancer arising from hepatocytes', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_cca'),            '11111111-1111-1111-1111-111111111111'::uuid, 'CHOLANGIOCARCINOMA', 'Cholangiocarcinoma (Bile Duct)',      'Solid Tumor',  'Intrahepatic, perihilar, and distal cholangiocarcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gallbladder'),    '11111111-1111-1111-1111-111111111111'::uuid, 'GALLBLADDER_CA',    'Gallbladder Cancer',                  'Solid Tumor',  'Malignant neoplasm of the gallbladder', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_anal'),           '11111111-1111-1111-1111-111111111111'::uuid, 'ANAL_CA',           'Anal Cancer',                         'Solid Tumor',  'Squamous cell carcinoma of the anal canal', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_small_int'),      '11111111-1111-1111-1111-111111111111'::uuid, 'SMALL_INT_CA',      'Small Intestine Cancer',              'Solid Tumor',  'Adenocarcinoma and other malignancies of the small intestine', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gist'),           '11111111-1111-1111-1111-111111111111'::uuid, 'GIST',              'Gastrointestinal Stromal Tumor (GIST)','Solid Tumor', 'KIT/PDGFRA-mutant mesenchymal tumor of the GI tract', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gi_net'),         '11111111-1111-1111-1111-111111111111'::uuid, 'GI_NET',            'GI Neuroendocrine Tumor (NET)',       'Solid Tumor',  'Well-differentiated neuroendocrine tumor of GI tract', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_peritoneal'),     '11111111-1111-1111-1111-111111111111'::uuid, 'PERITONEAL_CA',     'Peritoneal Carcinomatosis / Mesothelioma','Solid Tumor','Primary peritoneal carcinoma or peritoneal spread', true, NOW(), NOW()),

  -- ── Solid Tumor: Genitourinary ───────────────────────────────────────────
  (uuid_from_text('onco_ct_prostate'),       '11111111-1111-1111-1111-111111111111'::uuid, 'PROSTATE_CA',       'Prostate Cancer',                     'Solid Tumor',  'Adenocarcinoma of the prostate gland', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_rcc'),            '11111111-1111-1111-1111-111111111111'::uuid, 'RCC',               'Renal Cell Carcinoma (RCC)',          'Solid Tumor',  'Clear cell and non-clear cell renal cell carcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_bladder'),        '11111111-1111-1111-1111-111111111111'::uuid, 'BLADDER_CA',        'Bladder Cancer',                      'Solid Tumor',  'Urothelial carcinoma of the bladder', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_urothelial'),     '11111111-1111-1111-1111-111111111111'::uuid, 'UROTHELIAL_CA',     'Urothelial Carcinoma (Upper Tract)',   'Solid Tumor',  'Transitional cell carcinoma of the renal pelvis or ureter', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_testicular'),     '11111111-1111-1111-1111-111111111111'::uuid, 'TESTICULAR_CA',     'Testicular Cancer',                   'Solid Tumor',  'Seminoma and non-seminomatous germ cell tumors (NSGCT)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_penile'),         '11111111-1111-1111-1111-111111111111'::uuid, 'PENILE_CA',         'Penile Cancer',                       'Solid Tumor',  'Squamous cell carcinoma of the penis', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_adrenal'),        '11111111-1111-1111-1111-111111111111'::uuid, 'ADRENAL_CA',        'Adrenocortical Carcinoma',            'Solid Tumor',  'Malignant neoplasm of the adrenal cortex', true, NOW(), NOW()),

  -- ── Solid Tumor: Gynecologic ─────────────────────────────────────────────
  (uuid_from_text('onco_ct_cervical'),       '11111111-1111-1111-1111-111111111111'::uuid, 'CERVICAL_CA',       'Cervical Cancer',                     'Solid Tumor',  'Squamous cell carcinoma and adenocarcinoma of the cervix', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_ovarian'),        '11111111-1111-1111-1111-111111111111'::uuid, 'OVARIAN_CA',        'Ovarian Cancer',                      'Solid Tumor',  'Epithelial ovarian cancer including fallopian tube and peritoneum', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_endometrial'),    '11111111-1111-1111-1111-111111111111'::uuid, 'ENDOMETRIAL_CA',    'Endometrial / Uterine Cancer',        'Solid Tumor',  'Adenocarcinoma of the uterine endometrium', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_vulvar'),         '11111111-1111-1111-1111-111111111111'::uuid, 'VULVAR_CA',         'Vulvar Cancer',                       'Solid Tumor',  'Squamous cell carcinoma of the vulva', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_vaginal'),        '11111111-1111-1111-1111-111111111111'::uuid, 'VAGINAL_CA',        'Vaginal Cancer',                      'Solid Tumor',  'Primary squamous cell carcinoma of the vagina', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_gestational'),    '11111111-1111-1111-1111-111111111111'::uuid, 'GTD',               'Gestational Trophoblastic Disease',   'Solid Tumor',  'Choriocarcinoma, molar pregnancy, and related tumors', true, NOW(), NOW()),

  -- ── Solid Tumor: Head & Neck ─────────────────────────────────────────────
  (uuid_from_text('onco_ct_hnscc'),          '11111111-1111-1111-1111-111111111111'::uuid, 'HNSCC',             'Head & Neck Squamous Cell Carcinoma (HNSCC)','Solid Tumor','Oral cavity, oropharynx, hypopharynx, larynx SCC', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_npc'),            '11111111-1111-1111-1111-111111111111'::uuid, 'NPC',               'Nasopharyngeal Carcinoma (NPC)',      'Solid Tumor',  'EBV-associated carcinoma of the nasopharynx', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_salivary'),       '11111111-1111-1111-1111-111111111111'::uuid, 'SALIVARY_CA',       'Salivary Gland Carcinoma',            'Solid Tumor',  'Mucoepidermoid and adenoid cystic carcinoma of salivary glands', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_thyroid'),        '11111111-1111-1111-1111-111111111111'::uuid, 'THYROID_CA',        'Thyroid Cancer',                      'Solid Tumor',  'Papillary, follicular, medullary, and anaplastic thyroid cancers', true, NOW(), NOW()),

  -- ── Solid Tumor: Thoracic (non-lung) ─────────────────────────────────────
  (uuid_from_text('onco_ct_mesothelioma'),   '11111111-1111-1111-1111-111111111111'::uuid, 'MESOTHELIOMA',      'Malignant Mesothelioma',              'Solid Tumor',  'Pleural, peritoneal, and pericardial mesothelioma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_thymoma'),        '11111111-1111-1111-1111-111111111111'::uuid, 'THYMOMA',           'Thymoma / Thymic Carcinoma',          'Solid Tumor',  'Epithelial tumors of the thymus (WHO types A–C)', true, NOW(), NOW()),

  -- ── Solid Tumor: Musculoskeletal ─────────────────────────────────────────
  (uuid_from_text('onco_ct_osteosarcoma'),   '11111111-1111-1111-1111-111111111111'::uuid, 'OSTEOSARCOMA',      'Osteosarcoma',                        'Solid Tumor',  'Primary malignant bone tumor with osteoid production', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_ewing'),          '11111111-1111-1111-1111-111111111111'::uuid, 'EWING_SARCOMA',     'Ewing Sarcoma',                       'Solid Tumor',  'EWSR1-rearranged small round cell tumor of bone and soft tissue', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_chondrosarcoma'), '11111111-1111-1111-1111-111111111111'::uuid, 'CHONDROSARCOMA',    'Chondrosarcoma',                      'Solid Tumor',  'Malignant cartilage-forming tumor of bone', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_sts'),            '11111111-1111-1111-1111-111111111111'::uuid, 'STS',               'Soft Tissue Sarcoma (STS)',           'Solid Tumor',  'Leiomyosarcoma, liposarcoma, synovial sarcoma, and others', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_rhabdomyo'),      '11111111-1111-1111-1111-111111111111'::uuid, 'RHABDOMYOSARCOMA',  'Rhabdomyosarcoma',                    'Solid Tumor',  'Skeletal muscle-derived malignancy, primarily pediatric', true, NOW(), NOW()),

  -- ── Solid Tumor: Endocrine / Other ───────────────────────────────────────
  (uuid_from_text('onco_ct_pnet'),           '11111111-1111-1111-1111-111111111111'::uuid, 'PNET',              'Pancreatic NET',                      'Solid Tumor',  'Well-differentiated neuroendocrine tumor of the pancreas', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_pheo'),           '11111111-1111-1111-1111-111111111111'::uuid, 'PHEOCHROMOCYTOMA',  'Pheochromocytoma / Paraganglioma',    'Solid Tumor',  'Catecholamine-secreting chromaffin cell tumor', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_merkel'),         '11111111-1111-1111-1111-111111111111'::uuid, 'MERKEL_CELL',       'Merkel Cell Carcinoma',               'Solid Tumor',  'Neuroendocrine carcinoma of the skin (Merkel cell)', true, NOW(), NOW()),

  -- ── CNS ──────────────────────────────────────────────────────────────────
  (uuid_from_text('onco_ct_gbm'),            '11111111-1111-1111-1111-111111111111'::uuid, 'GBM',               'Glioblastoma Multiforme (GBM)',       'CNS',          'WHO Grade IV astrocytoma, IDH-wild type', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_astrocytoma'),    '11111111-1111-1111-1111-111111111111'::uuid, 'ASTROCYTOMA',       'Astrocytoma (Grade II–III)',           'CNS',          'IDH-mutant diffuse astrocytoma (WHO 2021)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_oligodendro'),    '11111111-1111-1111-1111-111111111111'::uuid, 'OLIGODENDROGLIOMA', 'Oligodendroglioma',                   'CNS',          'IDH-mutant, 1p/19q co-deleted glioma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_meningioma'),     '11111111-1111-1111-1111-111111111111'::uuid, 'MENINGIOMA',        'Meningioma (Atypical/Malignant)',      'CNS',          'WHO Grade II–III meningioma requiring treatment', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_medulloblasto'),  '11111111-1111-1111-1111-111111111111'::uuid, 'MEDULLOBLASTOMA',   'Medulloblastoma',                     'CNS',          'Embryonal tumor of the cerebellum, predominantly pediatric', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_ependymoma'),     '11111111-1111-1111-1111-111111111111'::uuid, 'EPENDYMOMA',        'Ependymoma',                          'CNS',          'Ependymal cell tumor of ventricular system or spinal cord', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_brain_meta'),     '11111111-1111-1111-1111-111111111111'::uuid, 'BRAIN_METS',        'Brain Metastases',                    'CNS',          'Secondary malignancy of the brain (metastatic)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_pbtl'),           '11111111-1111-1111-1111-111111111111'::uuid, 'PCNSL',             'Primary CNS Lymphoma (PCNSL)',        'CNS',          'Diffuse large B-cell lymphoma confined to the CNS', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_spinal_cord'),    '11111111-1111-1111-1111-111111111111'::uuid, 'SPINAL_CORD_CA',    'Spinal Cord Tumor',                   'CNS',          'Intramedullary and extramedullary spinal cord neoplasms', true, NOW(), NOW()),

  -- ── Hematologic: Acute Leukemia ──────────────────────────────────────────
  (uuid_from_text('onco_ct_aml'),            '11111111-1111-1111-1111-111111111111'::uuid, 'AML',               'Acute Myeloid Leukemia (AML)',        'Hematologic',  'Clonal expansion of myeloid blasts; ≥20% blasts in marrow/blood', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_apl'),            '11111111-1111-1111-1111-111111111111'::uuid, 'APL',               'Acute Promyelocytic Leukemia (APL)',  'Hematologic',  'PML-RARA fusion; treated with ATRA + arsenic trioxide', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_all'),            '11111111-1111-1111-1111-111111111111'::uuid, 'ALL',               'Acute Lymphoblastic Leukemia (ALL)',  'Hematologic',  'B-cell and T-cell precursor ALL', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_all_b'),          '11111111-1111-1111-1111-111111111111'::uuid, 'ALL_B',             'B-Cell ALL',                          'Hematologic',  'B-precursor ALL including Ph+ (BCR-ABL1) and Ph-like', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_all_t'),          '11111111-1111-1111-1111-111111111111'::uuid, 'ALL_T',             'T-Cell ALL',                          'Hematologic',  'T-precursor acute lymphoblastic leukemia', true, NOW(), NOW()),

  -- ── Hematologic: Chronic Leukemia ────────────────────────────────────────
  (uuid_from_text('onco_ct_cml'),            '11111111-1111-1111-1111-111111111111'::uuid, 'CML',               'Chronic Myeloid Leukemia (CML)',      'Hematologic',  'BCR-ABL1 (Philadelphia chromosome) fusion; treated with TKIs', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_cll'),            '11111111-1111-1111-1111-111111111111'::uuid, 'CLL',               'Chronic Lymphocytic Leukemia (CLL)', 'Hematologic',  'Small lymphocytic lymphoma / CLL continuum', true, NOW(), NOW()),

  -- ── Hematologic: Lymphoma ─────────────────────────────────────────────────
  (uuid_from_text('onco_ct_hl'),             '11111111-1111-1111-1111-111111111111'::uuid, 'HODGKIN_LYMPHOMA',  'Hodgkin Lymphoma',                    'Hematologic',  'Classical HL (nodular sclerosis, mixed cellularity) and NLPHL', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_dlbcl'),          '11111111-1111-1111-1111-111111111111'::uuid, 'DLBCL',             'Diffuse Large B-Cell Lymphoma (DLBCL)','Hematologic', 'Most common aggressive non-Hodgkin B-cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_fl'),             '11111111-1111-1111-1111-111111111111'::uuid, 'FOLLICULAR_LYMPH',  'Follicular Lymphoma',                 'Hematologic',  'Indolent B-cell lymphoma with BCL2 rearrangement', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_mcl'),            '11111111-1111-1111-1111-111111111111'::uuid, 'MANTLE_CELL_LYMPH', 'Mantle Cell Lymphoma (MCL)',          'Hematologic',  'Cyclin D1-overexpressing B-cell lymphoma (CCND1-IGH)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_burkitt'),        '11111111-1111-1111-1111-111111111111'::uuid, 'BURKITT_LYMPHOMA',  'Burkitt Lymphoma',                    'Hematologic',  'Highly aggressive MYC-driven B-cell lymphoma (EBV-associated)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_mzl'),            '11111111-1111-1111-1111-111111111111'::uuid, 'MZL',               'Marginal Zone Lymphoma (MZL)',        'Hematologic',  'MALT, nodal, and splenic marginal zone lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_tcell_lymph'),    '11111111-1111-1111-1111-111111111111'::uuid, 'TCELL_LYMPHOMA',    'Peripheral T-Cell Lymphoma (PTCL)',   'Hematologic',  'Heterogeneous group of mature T-cell lymphomas', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_alcl'),           '11111111-1111-1111-1111-111111111111'::uuid, 'ALCL',              'Anaplastic Large Cell Lymphoma (ALCL)','Hematologic', 'ALK+ and ALK- systemic anaplastic large cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_nkt_lymph'),      '11111111-1111-1111-1111-111111111111'::uuid, 'NKT_LYMPHOMA',      'NK/T-Cell Lymphoma (Nasal-type)',     'Hematologic',  'EBV-positive extranodal NK/T-cell lymphoma, nasal type', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_ctcl'),           '11111111-1111-1111-1111-111111111111'::uuid, 'CTCL',              'Cutaneous T-Cell Lymphoma (CTCL)',    'Hematologic',  'Mycosis fungoides, Sézary syndrome, and variants', true, NOW(), NOW()),

  -- ── Hematologic: Plasma Cell / Myeloma ───────────────────────────────────
  (uuid_from_text('onco_ct_myeloma'),        '11111111-1111-1111-1111-111111111111'::uuid, 'MULTIPLE_MYELOMA',  'Multiple Myeloma',                    'Hematologic',  'Clonal plasma cell disorder with M-protein and end-organ damage', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_smm'),            '11111111-1111-1111-1111-111111111111'::uuid, 'SMM',               'Smoldering Multiple Myeloma (SMM)',   'Hematologic',  'Intermediate between MGUS and symptomatic multiple myeloma', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_waldenstrom'),    '11111111-1111-1111-1111-111111111111'::uuid, 'WALDENSTROM',       'Waldenström Macroglobulinemia',       'Hematologic',  'IgM-secreting lymphoplasmacytic lymphoma with MYD88 L265P', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_amyloidosis'),    '11111111-1111-1111-1111-111111111111'::uuid, 'AL_AMYLOIDOSIS',    'AL Amyloidosis',                      'Hematologic',  'Light-chain amyloidosis from clonal plasma cells', true, NOW(), NOW()),

  -- ── Hematologic: Myeloid Disorders ───────────────────────────────────────
  (uuid_from_text('onco_ct_mds'),            '11111111-1111-1111-1111-111111111111'::uuid, 'MDS',               'Myelodysplastic Syndrome (MDS)',      'Hematologic',  'Clonal marrow failure disorder with dysplasia and cytopenias', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_mpn'),            '11111111-1111-1111-1111-111111111111'::uuid, 'MPN',               'Myeloproliferative Neoplasm (MPN)',   'Hematologic',  'Polycythemia vera, ET, primary myelofibrosis (JAK2-driven)', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_mf'),             '11111111-1111-1111-1111-111111111111'::uuid, 'MYELOFIBROSIS',     'Primary Myelofibrosis',               'Hematologic',  'JAK2/CALR/MPL-driven myeloproliferative disorder with fibrosis', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_et'),             '11111111-1111-1111-1111-111111111111'::uuid, 'ESSENTIAL_THROMB',  'Essential Thrombocythemia (ET)',      'Hematologic',  'JAK2/CALR/MPL-driven MPN with thrombocytosis', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_pv'),             '11111111-1111-1111-1111-111111111111'::uuid, 'POLYCYTHEMIA_VERA', 'Polycythemia Vera (PV)',               'Hematologic',  'JAK2 V617F-driven MPN with erythrocytosis', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_cmml'),           '11111111-1111-1111-1111-111111111111'::uuid, 'CMML',              'Chronic Myelomonocytic Leukemia (CMML)','Hematologic','Overlap MDS/MPN with monocytosis', true, NOW(), NOW()),

  -- ── Skin ─────────────────────────────────────────────────────────────────
  (uuid_from_text('onco_ct_melanoma'),       '11111111-1111-1111-1111-111111111111'::uuid, 'MELANOMA',          'Malignant Melanoma',                  'Skin',         'Malignancy arising from melanocytes; BRAF/NRAS/NF1-driven', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_bcc'),            '11111111-1111-1111-1111-111111111111'::uuid, 'BCC',               'Basal Cell Carcinoma (BCC)',          'Skin',         'Most common human malignancy; locally invasive; Hedgehog pathway', true, NOW(), NOW()),
  (uuid_from_text('onco_ct_cscc'),           '11111111-1111-1111-1111-111111111111'::uuid, 'CSCC',              'Cutaneous Squamous Cell Carcinoma',   'Skin',         'UV-induced squamous cell carcinoma of the skin', true, NOW(), NOW())

ON CONFLICT (tenant_id, code) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. PRIMARY SITES  (ICD-O-3 topography codes)
-- ──────────────────────────────────────────────────────────────────────────────
INSERT INTO plugin_oncology.oncology_primary_site_master
  (id, tenant_id, icdo_site_code, icdo_site_name, body_system, laterality_applicable, mapping_type, active, created_at, updated_at)
VALUES
  -- Breast
  (uuid_from_text('onco_ps_c50'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C50',   'Breast',                                    'Breast',              true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c500'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C50.0', 'Nipple',                                    'Breast',              true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c501'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C50.1', 'Central portion of breast',                 'Breast',              true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c504'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C50.4', 'Upper-outer quadrant of breast',            'Breast',              true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c509'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C50.9', 'Breast, NOS',                               'Breast',              true,  'subsite',   true, NOW(), NOW()),
  -- Lung & Thorax
  (uuid_from_text('onco_ps_c34'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C34',   'Bronchus and Lung',                         'Respiratory',         true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c340'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C34.0', 'Main bronchus',                             'Respiratory',         true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c341'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C34.1', 'Upper lobe, bronchus or lung',              'Respiratory',         true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c342'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C34.2', 'Middle lobe, bronchus or lung',             'Respiratory',         false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c343'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C34.3', 'Lower lobe, bronchus or lung',              'Respiratory',         true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c381'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C38.1', 'Heart',                                     'Cardiovascular',      false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c384'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C38.4', 'Pleura, NOS',                               'Respiratory',         false, 'primary',   true, NOW(), NOW()),
  -- Gastrointestinal
  (uuid_from_text('onco_ps_c15'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C15',   'Esophagus',                                 'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c16'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C16',   'Stomach',                                   'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c17'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C17',   'Small Intestine',                           'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c18'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C18',   'Colon',                                     'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c180'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C18.0', 'Cecum',                                     'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c182'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C18.2', 'Ascending colon',                           'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c184'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C18.4', 'Transverse colon',                          'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c186'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C18.6', 'Descending colon',                          'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c187'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C18.7', 'Sigmoid colon',                             'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c19'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C19',   'Rectosigmoid Junction',                     'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c20'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C20',   'Rectum, NOS',                               'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c21'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C21',   'Anus and Anal Canal',                       'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c22'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C22',   'Liver and Intrahepatic Bile Ducts',         'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c23'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C23',   'Gallbladder',                               'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c24'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C24',   'Other and Unspecified Parts of Biliary Tract','Gastrointestinal',  false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c25'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C25',   'Pancreas',                                  'Gastrointestinal',    false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c250'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C25.0', 'Head of pancreas',                          'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c251'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C25.1', 'Body of pancreas',                          'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c252'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C25.2', 'Tail of pancreas',                          'Gastrointestinal',    false, 'subsite',   true, NOW(), NOW()),
  -- Genitourinary
  (uuid_from_text('onco_ps_c61'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C61',   'Prostate Gland',                            'Genitourinary',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c62'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C62',   'Testis',                                    'Genitourinary',       true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c63'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C63',   'Other and Unspecified Male Genital Organs',  'Genitourinary',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c64'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C64',   'Kidney, NOS',                               'Genitourinary',       true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c65'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C65',   'Renal Pelvis',                              'Genitourinary',       true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c66'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C66',   'Ureter',                                    'Genitourinary',       true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c67'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C67',   'Bladder, NOS',                              'Genitourinary',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c68'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C68',   'Other and Unspecified Urinary Organs',      'Genitourinary',       false, 'primary',   true, NOW(), NOW()),
  -- Gynecologic
  (uuid_from_text('onco_ps_c51'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C51',   'Vulva',                                     'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c52'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C52',   'Vagina',                                    'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c53'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C53',   'Cervix Uteri',                              'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c54'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C54',   'Corpus Uteri (Endometrium)',                 'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c55'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C55',   'Uterus, NOS',                               'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c56'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C56',   'Ovary',                                     'Gynecologic',         true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c57'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C57',   'Other and Unspecified Female Genital Organs','Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c58'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C58',   'Placenta',                                  'Gynecologic',         false, 'primary',   true, NOW(), NOW()),
  -- Head & Neck
  (uuid_from_text('onco_ps_c00'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C00',   'Lip',                                       'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c01'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C01',   'Base of Tongue',                            'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c02'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C02',   'Other and Unspecified Parts of Tongue',     'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c03'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C03',   'Gum',                                       'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c04'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C04',   'Floor of Mouth',                            'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c05'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C05',   'Palate',                                    'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c06'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C06',   'Other and Unspecified Parts of Mouth',      'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c07'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C07',   'Parotid Gland',                             'Head and Neck',       true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c08'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C08',   'Other and Unspecified Major Salivary Glands','Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c09'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C09',   'Tonsil',                                    'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c10'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C10',   'Oropharynx',                                'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c11'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C11',   'Nasopharynx',                               'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c12'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C12',   'Pyriform Sinus',                            'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c13'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C13',   'Hypopharynx',                               'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c14'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C14',   'Other and Ill-defined Sites in Lip, OC, Pharynx','Head and Neck', false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c30'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C30',   'Nasal Cavity and Middle Ear',               'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c31'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C31',   'Accessory Sinuses',                         'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c32'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C32',   'Larynx',                                    'Head and Neck',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c73'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C73',   'Thyroid Gland',                             'Endocrine',           false, 'primary',   true, NOW(), NOW()),
  -- CNS
  (uuid_from_text('onco_ps_c70'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C70',   'Meninges',                                  'CNS',                 false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c71'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C71',   'Brain',                                     'CNS',                 false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c710'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.0', 'Cerebrum (excl. lobes and ventricles)',      'CNS',                 false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c711'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.1', 'Frontal lobe',                              'CNS',                 true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c712'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.2', 'Temporal lobe',                             'CNS',                 true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c713'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.3', 'Parietal lobe',                             'CNS',                 true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c714'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.4', 'Occipital lobe',                            'CNS',                 true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c716'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.6', 'Cerebellum, NOS',                           'CNS',                 false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c717'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C71.7', 'Brain stem',                                'CNS',                 false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c72'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C72',   'Spinal Cord, Cranial Nerves, Other CNS',    'CNS',                 false, 'primary',   true, NOW(), NOW()),
  -- Endocrine
  (uuid_from_text('onco_ps_c74'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C74',   'Adrenal Gland',                             'Endocrine',           true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c75'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C75',   'Other Endocrine Glands and Related Structures','Endocrine',        false, 'primary',   true, NOW(), NOW()),
  -- Skin
  (uuid_from_text('onco_ps_c44'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C44',   'Other and Unspecified Parts of Skin',       'Skin',                false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c440'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.0', 'Skin of lip, NOS',                          'Skin',                false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c443'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.3', 'Skin of other and unspecified parts of face','Skin',              false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c444'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.4', 'Skin of scalp and neck',                    'Skin',                false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c445'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.5', 'Skin of trunk',                             'Skin',                false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c446'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.6', 'Skin of upper limb and shoulder',           'Skin',                true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c447'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C44.7', 'Skin of lower limb and hip',                'Skin',                true,  'subsite',   true, NOW(), NOW()),
  -- Bone & Soft Tissue
  (uuid_from_text('onco_ps_c40'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C40',   'Bone, Articular Cartilage of Limbs',        'Musculoskeletal',     true,  'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c41'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C41',   'Bone, Articular Cartilage, Other',          'Musculoskeletal',     false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c47'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C47',   'Peripheral Nerves and ANS',                 'Musculoskeletal',     false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c48'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C48',   'Retroperitoneum and Peritoneum',             'Musculoskeletal',     false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c49'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C49',   'Connective, Subcutaneous and Other Soft Tissue','Musculoskeletal',  false, 'primary',   true, NOW(), NOW()),
  -- Lymphatic / Hematopoietic (generalized sites for lymphoma/leukemia)
  (uuid_from_text('onco_ps_c42'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C42',   'Hematopoietic and Reticuloendothelial System','Hematologic',       false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c420'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C42.0', 'Blood',                                     'Hematologic',         false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c421'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C42.1', 'Bone Marrow',                               'Hematologic',         false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c422'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C42.2', 'Spleen',                                    'Hematologic',         false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c423'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C42.3', 'Reticuloendothelial System, NOS',           'Hematologic',         false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c770'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C77.0', 'Lymph Nodes of Head, Face, and Neck',       'Lymphatic',           false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c772'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C77.2', 'Intra-abdominal Lymph Nodes',               'Lymphatic',           false, 'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c773'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C77.3', 'Axillary and Arm Lymph Nodes',              'Lymphatic',           true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c774'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C77.4', 'Inguinal and Leg Lymph Nodes',              'Lymphatic',           true,  'subsite',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c775'),  '11111111-1111-1111-1111-111111111111'::uuid, 'C77.5', 'Intrapelvic Lymph Nodes',                   'Lymphatic',           false, 'subsite',   true, NOW(), NOW()),
  -- Unknown / Other
  (uuid_from_text('onco_ps_c80'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C80',   'Unknown Primary Site',                      'Unknown',             false, 'primary',   true, NOW(), NOW()),
  (uuid_from_text('onco_ps_c76'),   '11111111-1111-1111-1111-111111111111'::uuid, 'C76',   'Other and Ill-defined Sites',               'Other',               false, 'primary',   true, NOW(), NOW())

ON CONFLICT (tenant_id, icdo_site_code) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. HISTOLOGIES  (ICD-O-3 morphology codes, behaviour /3 = malignant)
-- ──────────────────────────────────────────────────────────────────────────────
INSERT INTO plugin_oncology.oncology_histology_master
  (id, tenant_id, morphology_code, morphology_name, behavior_code, behavior_name, description, active, created_at, updated_at)
VALUES
  -- Epithelial / Carcinoma
  (uuid_from_text('onco_h_8010'), '11111111-1111-1111-1111-111111111111'::uuid, '8010/3', 'Carcinoma, NOS',                              '/3', 'Malignant', 'Generic carcinoma, not otherwise specified', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8020'), '11111111-1111-1111-1111-111111111111'::uuid, '8020/3', 'Carcinoma, undifferentiated',                 '/3', 'Malignant', 'Undifferentiated / anaplastic carcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8041'), '11111111-1111-1111-1111-111111111111'::uuid, '8041/3', 'Small cell carcinoma, NOS',                  '/3', 'Malignant', 'Neuroendocrine small cell carcinoma (lung and other)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8070'), '11111111-1111-1111-1111-111111111111'::uuid, '8070/3', 'Squamous cell carcinoma, NOS',               '/3', 'Malignant', 'Keratinising and non-keratinising squamous cell carcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8071'), '11111111-1111-1111-1111-111111111111'::uuid, '8071/3', 'Squamous cell carcinoma, keratinizing',      '/3', 'Malignant', 'Well-differentiated keratinizing squamous cell carcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8072'), '11111111-1111-1111-1111-111111111111'::uuid, '8072/3', 'Squamous cell carcinoma, large cell, nonkeratinizing','/3','Malignant','Non-keratinizing large cell SCC', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8083'), '11111111-1111-1111-1111-111111111111'::uuid, '8083/3', 'Basaloid squamous cell carcinoma',           '/3', 'Malignant', 'Aggressive SCC variant with basaloid features', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8140'), '11111111-1111-1111-1111-111111111111'::uuid, '8140/3', 'Adenocarcinoma, NOS',                        '/3', 'Malignant', 'Glandular carcinoma, not otherwise specified', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8141'), '11111111-1111-1111-1111-111111111111'::uuid, '8141/3', 'Scirrhous adenocarcinoma',                   '/3', 'Malignant', 'Adenocarcinoma with dense desmoplastic stroma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8144'), '11111111-1111-1111-1111-111111111111'::uuid, '8144/3', 'Adenocarcinoma, intestinal type',            '/3', 'Malignant', 'Lauren intestinal-type adenocarcinoma (gastric)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8145'), '11111111-1111-1111-1111-111111111111'::uuid, '8145/3', 'Carcinoma, diffuse type',                    '/3', 'Malignant', 'Lauren diffuse-type (signet ring cell) gastric carcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8210'), '11111111-1111-1111-1111-111111111111'::uuid, '8210/3', 'Adenocarcinoma in adenomatous polyp',        '/3', 'Malignant', 'Invasive adenocarcinoma arising in colorectal adenomatous polyp', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8230'), '11111111-1111-1111-1111-111111111111'::uuid, '8230/3', 'Solid carcinoma, NOS',                       '/3', 'Malignant', 'Poorly differentiated solid-pattern adenocarcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8240'), '11111111-1111-1111-1111-111111111111'::uuid, '8240/3', 'Carcinoid tumor, NOS',                       '/3', 'Malignant', 'Well-differentiated neuroendocrine tumor (carcinoid), malignant', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8246'), '11111111-1111-1111-1111-111111111111'::uuid, '8246/3', 'Neuroendocrine carcinoma, NOS',              '/3', 'Malignant', 'Poorly differentiated neuroendocrine carcinoma (large cell)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8255'), '11111111-1111-1111-1111-111111111111'::uuid, '8255/3', 'Adenocarcinoma with mixed subtypes',         '/3', 'Malignant', 'Lung adenocarcinoma with mixed acinar/lepidic/papillary patterns', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8260'), '11111111-1111-1111-1111-111111111111'::uuid, '8260/3', 'Papillary adenocarcinoma, NOS',              '/3', 'Malignant', 'Adenocarcinoma with predominantly papillary architecture', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8290'), '11111111-1111-1111-1111-111111111111'::uuid, '8290/3', 'Oxyphilic adenocarcinoma',                   '/3', 'Malignant', 'Oncocytic (Hürthle cell) carcinoma of thyroid', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8310'), '11111111-1111-1111-1111-111111111111'::uuid, '8310/3', 'Clear cell adenocarcinoma, NOS',             '/3', 'Malignant', 'Renal clear cell, ovarian or other clear cell adenocarcinoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8380'), '11111111-1111-1111-1111-111111111111'::uuid, '8380/3', 'Endometrioid adenocarcinoma',                '/3', 'Malignant', 'Endometrioid adenocarcinoma (uterus, ovary)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8440'), '11111111-1111-1111-1111-111111111111'::uuid, '8440/3', 'Cystadenocarcinoma, NOS',                    '/3', 'Malignant', 'Malignant cystic epithelial tumor (ovary/pancreas)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8441'), '11111111-1111-1111-1111-111111111111'::uuid, '8441/3', 'Serous cystadenocarcinoma, NOS',             '/3', 'Malignant', 'High-grade serous carcinoma (ovarian/peritoneal)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8480'), '11111111-1111-1111-1111-111111111111'::uuid, '8480/3', 'Mucinous adenocarcinoma',                    '/3', 'Malignant', 'Adenocarcinoma with mucinous differentiation (colon, ovary, lung)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8490'), '11111111-1111-1111-1111-111111111111'::uuid, '8490/3', 'Signet ring cell carcinoma',                 '/3', 'Malignant', 'Mucin-filled signet ring cells, gastric diffuse type', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8500'), '11111111-1111-1111-1111-111111111111'::uuid, '8500/3', 'Infiltrating duct carcinoma, NOS',           '/3', 'Malignant', 'Invasive ductal carcinoma of the breast (NST)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8503'), '11111111-1111-1111-1111-111111111111'::uuid, '8503/3', 'Intraductal papillary adenocarcinoma',       '/3', 'Malignant', 'Invasive papillary carcinoma of the breast', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8510'), '11111111-1111-1111-1111-111111111111'::uuid, '8510/3', 'Medullary carcinoma, NOS',                   '/3', 'Malignant', 'Medullary carcinoma of the breast or thyroid', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8520'), '11111111-1111-1111-1111-111111111111'::uuid, '8520/3', 'Lobular carcinoma, NOS',                     '/3', 'Malignant', 'Invasive lobular carcinoma of the breast', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8560'), '11111111-1111-1111-1111-111111111111'::uuid, '8560/3', 'Adenosquamous carcinoma',                    '/3', 'Malignant', 'Biphasic carcinoma with glandular and squamous elements', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8574'), '11111111-1111-1111-1111-111111111111'::uuid, '8574/3', 'Adenocarcinoma with neuroendocrine differentiation','/3','Malignant','Mixed adenocarcinoma-NE tumor', true, NOW(), NOW()),
  -- Transitional Cell / Urothelial
  (uuid_from_text('onco_h_8120'), '11111111-1111-1111-1111-111111111111'::uuid, '8120/3', 'Transitional cell carcinoma, NOS',           '/3', 'Malignant', 'Urothelial carcinoma of the bladder, renal pelvis, or ureter', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8130'), '11111111-1111-1111-1111-111111111111'::uuid, '8130/3', 'Papillary transitional cell carcinoma',      '/3', 'Malignant', 'Papillary urothelial carcinoma, high grade', true, NOW(), NOW()),
  -- Gliomas / CNS
  (uuid_from_text('onco_h_9380'), '11111111-1111-1111-1111-111111111111'::uuid, '9380/3', 'Glioma, malignant',                          '/3', 'Malignant', 'Generic malignant glioma designation', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9400'), '11111111-1111-1111-1111-111111111111'::uuid, '9400/3', 'Astrocytoma, NOS',                           '/3', 'Malignant', 'IDH-mutant diffuse astrocytoma (WHO 2021)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9401'), '11111111-1111-1111-1111-111111111111'::uuid, '9401/3', 'Astrocytoma, anaplastic',                    '/3', 'Malignant', 'WHO Grade III anaplastic astrocytoma (IDH-mutant)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9440'), '11111111-1111-1111-1111-111111111111'::uuid, '9440/3', 'Glioblastoma, NOS',                          '/3', 'Malignant', 'WHO Grade IV glioblastoma, IDH-wild type', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9450'), '11111111-1111-1111-1111-111111111111'::uuid, '9450/3', 'Oligodendroglioma, NOS',                     '/3', 'Malignant', 'IDH-mutant, 1p/19q co-deleted oligodendroglioma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9451'), '11111111-1111-1111-1111-111111111111'::uuid, '9451/3', 'Oligodendroglioma, anaplastic',              '/3', 'Malignant', 'WHO Grade III anaplastic oligodendroglioma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9530'), '11111111-1111-1111-1111-111111111111'::uuid, '9530/3', 'Meningioma, malignant',                      '/3', 'Malignant', 'WHO Grade III anaplastic meningioma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9471'), '11111111-1111-1111-1111-111111111111'::uuid, '9471/3', 'Medulloblastoma, NOS',                       '/3', 'Malignant', 'WHO Grade IV embryonal cerebellar tumor', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9391'), '11111111-1111-1111-1111-111111111111'::uuid, '9391/3', 'Ependymoma, anaplastic',                     '/3', 'Malignant', 'WHO Grade III anaplastic ependymoma', true, NOW(), NOW()),
  -- Lymphoma / Hematopoietic
  (uuid_from_text('onco_h_9650'), '11111111-1111-1111-1111-111111111111'::uuid, '9650/3', 'Hodgkin lymphoma, NOS',                      '/3', 'Malignant', 'Classical Hodgkin lymphoma (all subtypes)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9663'), '11111111-1111-1111-1111-111111111111'::uuid, '9663/3', 'Hodgkin lymphoma, nodular sclerosis',        '/3', 'Malignant', 'Classical HL, nodular sclerosis subtype (most common)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9680'), '11111111-1111-1111-1111-111111111111'::uuid, '9680/3', 'Malignant lymphoma, large B-cell, diffuse', '/3', 'Malignant', 'Diffuse large B-cell lymphoma (DLBCL)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9690'), '11111111-1111-1111-1111-111111111111'::uuid, '9690/3', 'Follicular lymphoma, NOS',                   '/3', 'Malignant', 'Indolent follicular B-cell lymphoma (grade 1–3A)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9673'), '11111111-1111-1111-1111-111111111111'::uuid, '9673/3', 'Mantle cell lymphoma',                       '/3', 'Malignant', 'Cyclin D1/CCND1-IGH t(11;14) B-cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9687'), '11111111-1111-1111-1111-111111111111'::uuid, '9687/3', 'Burkitt lymphoma, NOS',                      '/3', 'Malignant', 'Highly aggressive MYC-driven B-cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9699'), '11111111-1111-1111-1111-111111111111'::uuid, '9699/3', 'Marginal zone B-cell lymphoma, NOS',         '/3', 'Malignant', 'MALT, nodal, and splenic marginal zone lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9702'), '11111111-1111-1111-1111-111111111111'::uuid, '9702/3', 'T-cell lymphoma, NOS',                       '/3', 'Malignant', 'Peripheral T-cell lymphoma, not otherwise specified', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9714'), '11111111-1111-1111-1111-111111111111'::uuid, '9714/3', 'Anaplastic large cell lymphoma, T cell',    '/3', 'Malignant', 'ALK+ or ALK- anaplastic large cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9719'), '11111111-1111-1111-1111-111111111111'::uuid, '9719/3', 'NK/T-cell lymphoma, nasal and nasal type',   '/3', 'Malignant', 'EBV-positive extranodal NK/T-cell lymphoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9700'), '11111111-1111-1111-1111-111111111111'::uuid, '9700/3', 'Mycosis fungoides',                          '/3', 'Malignant', 'Primary cutaneous T-cell lymphoma (Mycosis fungoides)', true, NOW(), NOW()),
  -- Leukemia
  (uuid_from_text('onco_h_9861'), '11111111-1111-1111-1111-111111111111'::uuid, '9861/3', 'Acute myeloid leukemia, NOS',                '/3', 'Malignant', 'AML with ≥20% blasts (not otherwise classified)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9866'), '11111111-1111-1111-1111-111111111111'::uuid, '9866/3', 'Acute promyelocytic leukemia, t(15;17)',      '/3', 'Malignant', 'PML-RARA fusion acute promyelocytic leukemia', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9811'), '11111111-1111-1111-1111-111111111111'::uuid, '9811/3', 'B lymphoblastic leukemia/lymphoma, NOS',     '/3', 'Malignant', 'B-cell precursor ALL (B-ALL)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9837'), '11111111-1111-1111-1111-111111111111'::uuid, '9837/3', 'T lymphoblastic leukemia/lymphoma',          '/3', 'Malignant', 'T-cell precursor ALL (T-ALL)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9875'), '11111111-1111-1111-1111-111111111111'::uuid, '9875/3', 'Chronic myelogenous leukemia, BCR-ABL1',     '/3', 'Malignant', 'Philadelphia chromosome-positive CML', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9823'), '11111111-1111-1111-1111-111111111111'::uuid, '9823/3', 'Chronic lymphocytic leukemia / small lymphocytic lymphoma','/3','Malignant','CLL/SLL, CD5+CD23+ indolent B-cell disease', true, NOW(), NOW()),
  -- Myeloma / Plasma Cell
  (uuid_from_text('onco_h_9732'), '11111111-1111-1111-1111-111111111111'::uuid, '9732/3', 'Multiple myeloma',                           '/3', 'Malignant', 'Clonal plasma cell myeloma with M-protein', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9671'), '11111111-1111-1111-1111-111111111111'::uuid, '9671/3', 'Lymphoplasmacytic lymphoma',                  '/3', 'Malignant', 'IgM-secreting lymphoma (Waldenström)', true, NOW(), NOW()),
  -- Myeloid
  (uuid_from_text('onco_h_9980'), '11111111-1111-1111-1111-111111111111'::uuid, '9980/3', 'Refractory anemia',                          '/3', 'Malignant', 'MDS – refractory anemia (RCMD)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9975'), '11111111-1111-1111-1111-111111111111'::uuid, '9975/3', 'Myelodysplastic/myeloproliferative neoplasm, NOS','/3','Malignant','Overlap MDS/MPN including CMML', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9961'), '11111111-1111-1111-1111-111111111111'::uuid, '9961/3', 'Polycythemia vera',                          '/3', 'Malignant', 'JAK2 V617F-driven erythrocytosis MPN', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9962'), '11111111-1111-1111-1111-111111111111'::uuid, '9962/3', 'Essential thrombocythemia',                  '/3', 'Malignant', 'JAK2/CALR/MPL-driven thrombocytosis MPN', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9961mf'), '11111111-1111-1111-1111-111111111111'::uuid, '9961/3-MF', 'Primary myelofibrosis',                '/3', 'Malignant', 'JAK2/CALR-driven bone marrow fibrosis MPN', true, NOW(), NOW()),
  -- Melanoma
  (uuid_from_text('onco_h_8720'), '11111111-1111-1111-1111-111111111111'::uuid, '8720/3', 'Malignant melanoma, NOS',                    '/3', 'Malignant', 'Cutaneous melanoma arising from melanocytes', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8721'), '11111111-1111-1111-1111-111111111111'::uuid, '8721/3', 'Nodular melanoma',                           '/3', 'Malignant', 'Aggressive vertical growth phase melanoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8743'), '11111111-1111-1111-1111-111111111111'::uuid, '8743/3', 'Superficial spreading melanoma',             '/3', 'Malignant', 'Most common subtype; horizontal radial growth phase', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8744'), '11111111-1111-1111-1111-111111111111'::uuid, '8744/3', 'Acral lentiginous melanoma',                 '/3', 'Malignant', 'Subungual / palmoplantar melanoma; common in Asian populations', true, NOW(), NOW()),
  -- Sarcoma
  (uuid_from_text('onco_h_8800'), '11111111-1111-1111-1111-111111111111'::uuid, '8800/3', 'Sarcoma, NOS',                               '/3', 'Malignant', 'Malignant mesenchymal tumor, not otherwise specified', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8890'), '11111111-1111-1111-1111-111111111111'::uuid, '8890/3', 'Leiomyosarcoma, NOS',                        '/3', 'Malignant', 'Smooth muscle sarcoma (uterus, retroperitoneum, extremity)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8850'), '11111111-1111-1111-1111-111111111111'::uuid, '8850/3', 'Liposarcoma, NOS',                           '/3', 'Malignant', 'Adipocytic malignancy (WDLPS, DDLPS, MRC, PLS)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9120'), '11111111-1111-1111-1111-111111111111'::uuid, '9120/3', 'Hemangiosarcoma',                            '/3', 'Malignant', 'Angiosarcoma of soft tissue or liver', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9180'), '11111111-1111-1111-1111-111111111111'::uuid, '9180/3', 'Osteosarcoma, NOS',                          '/3', 'Malignant', 'Primary malignant bone-forming tumor', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9220'), '11111111-1111-1111-1111-111111111111'::uuid, '9220/3', 'Chondrosarcoma, NOS',                        '/3', 'Malignant', 'Malignant cartilage-forming tumor', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9260'), '11111111-1111-1111-1111-111111111111'::uuid, '9260/3', 'Ewing sarcoma',                              '/3', 'Malignant', 'EWSR1-rearranged small round cell bone/soft tissue tumor', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8910'), '11111111-1111-1111-1111-111111111111'::uuid, '8910/3', 'Embryonal rhabdomyosarcoma',                 '/3', 'Malignant', 'Childhood skeletal muscle sarcoma (embryonal subtype)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8920'), '11111111-1111-1111-1111-111111111111'::uuid, '8920/3', 'Alveolar rhabdomyosarcoma',                  '/3', 'Malignant', 'PAX-FOXO1 fusion rhabdomyosarcoma', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9040'), '11111111-1111-1111-1111-111111111111'::uuid, '9040/3', 'Synovial sarcoma, NOS',                      '/3', 'Malignant', 'SS18-SSX fusion spindle cell sarcoma', true, NOW(), NOW()),
  -- GIST / Stromal
  (uuid_from_text('onco_h_8936'), '11111111-1111-1111-1111-111111111111'::uuid, '8936/3', 'Gastrointestinal stromal sarcoma',           '/3', 'Malignant', 'KIT/PDGFRA-mutant GI stromal tumor, malignant', true, NOW(), NOW()),
  -- Germ Cell
  (uuid_from_text('onco_h_9060'), '11111111-1111-1111-1111-111111111111'::uuid, '9060/3', 'Dysgerminoma',                               '/3', 'Malignant', 'Ovarian malignant germ cell tumor (dysgerminoma)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9061'), '11111111-1111-1111-1111-111111111111'::uuid, '9061/3', 'Seminoma, NOS',                              '/3', 'Malignant', 'Pure testicular seminoma (classical subtype)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9070'), '11111111-1111-1111-1111-111111111111'::uuid, '9070/3', 'Embryonal carcinoma, NOS',                   '/3', 'Malignant', 'Non-seminomatous germ cell tumor (NSGCT) component', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9100'), '11111111-1111-1111-1111-111111111111'::uuid, '9100/3', 'Choriocarcinoma, NOS',                       '/3', 'Malignant', 'Malignant trophoblastic tumor (gestational or primary gonadal)', true, NOW(), NOW()),
  -- Thyroid
  (uuid_from_text('onco_h_8260t'), '11111111-1111-1111-1111-111111111111'::uuid, '8260/3-T', 'Papillary thyroid carcinoma',             '/3', 'Malignant', 'Most common thyroid malignancy; BRAF V600E and RET/PTC fusions', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8330'), '11111111-1111-1111-1111-111111111111'::uuid, '8330/3', 'Follicular adenocarcinoma, NOS',             '/3', 'Malignant', 'Follicular thyroid carcinoma (minimally/widely invasive)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8345'), '11111111-1111-1111-1111-111111111111'::uuid, '8345/3', 'Medullary carcinoma with amyloid stroma',    '/3', 'Malignant', 'C-cell derived MTC; RET mutations; calcitonin marker', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8020t'), '11111111-1111-1111-1111-111111111111'::uuid, '8020/3-T', 'Anaplastic thyroid carcinoma',            '/3', 'Malignant', 'WHO Grade IV; TP53/TERT-driven; rapidly fatal', true, NOW(), NOW()),
  -- Mesothelioma
  (uuid_from_text('onco_h_9050'), '11111111-1111-1111-1111-111111111111'::uuid, '9050/3', 'Mesothelioma, NOS',                          '/3', 'Malignant', 'Malignant mesothelioma (pleural, peritoneal, pericardial)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_9052'), '11111111-1111-1111-1111-111111111111'::uuid, '9052/3', 'Epithelioid mesothelioma',                   '/3', 'Malignant', 'Most common and better-prognosis mesothelioma subtype', true, NOW(), NOW()),
  -- Carcinoma BCC / SCC
  (uuid_from_text('onco_h_8090'), '11111111-1111-1111-1111-111111111111'::uuid, '8090/3', 'Basal cell carcinoma, NOS',                  '/3', 'Malignant', 'UV-induced Hedgehog pathway-driven skin carcinoma', true, NOW(), NOW()),
  -- Neuroendocrine / PNET
  (uuid_from_text('onco_h_8150'), '11111111-1111-1111-1111-111111111111'::uuid, '8150/3', 'Islet cell carcinoma',                       '/3', 'Malignant', 'Malignant pancreatic islet cell tumor (functional/non-functional)', true, NOW(), NOW()),
  (uuid_from_text('onco_h_8156'), '11111111-1111-1111-1111-111111111111'::uuid, '8156/3', 'Verner-Morrison syndrome / VIPoma',          '/3', 'Malignant', 'VIP-secreting pancreatic NET with watery diarrhea', true, NOW(), NOW())

ON CONFLICT (tenant_id, morphology_code) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. CANCER TYPE ↔ PRIMARY SITE MAPPINGS  (representative defaults)
-- ──────────────────────────────────────────────────────────────────────────────
INSERT INTO plugin_oncology.oncology_cancer_type_site_mapping
  (id, tenant_id, cancer_type_id, primary_site_id, is_default, active, created_at, updated_at)
VALUES
  -- Breast Cancer → C50 (primary), C50.9 default
  (uuid_from_text('onco_map_breast_c50'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_breast'),      uuid_from_text('onco_ps_c50'),   false, true, NOW(), NOW()),
  (uuid_from_text('onco_map_breast_c509'),  '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_breast'),      uuid_from_text('onco_ps_c509'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_bher2_c509'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_breast_her2'), uuid_from_text('onco_ps_c509'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_btnbc_c509'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_breast_tnbc'), uuid_from_text('onco_ps_c509'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_bhrp_c509'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_breast_hr_pos'),uuid_from_text('onco_ps_c509'), true,  true, NOW(), NOW()),
  -- NSCLC / SCLC → C34
  (uuid_from_text('onco_map_nsclc_c34'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_nsclc'),       uuid_from_text('onco_ps_c34'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_nsclc_adeno_c341'), '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_nsclc_adeno'), uuid_from_text('onco_ps_c341'), true, true, NOW(), NOW()),
  (uuid_from_text('onco_map_nsclc_sq_c34'), '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_nsclc_sq'),    uuid_from_text('onco_ps_c34'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_sclc_c34'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_sclc'),        uuid_from_text('onco_ps_c34'),   true,  true, NOW(), NOW()),
  -- Colorectal → C18/C19/C20
  (uuid_from_text('onco_map_colon_c18'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_colon'),       uuid_from_text('onco_ps_c18'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_rectal_c20'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_rectal'),      uuid_from_text('onco_ps_c20'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_crc_c19'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_crc'),         uuid_from_text('onco_ps_c19'),   true,  true, NOW(), NOW()),
  -- Gastric → C16
  (uuid_from_text('onco_map_gastric_c16'),  '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_gastric'),     uuid_from_text('onco_ps_c16'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_gej_c16'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_gej'),         uuid_from_text('onco_ps_c16'),   true,  true, NOW(), NOW()),
  -- Esophageal → C15
  (uuid_from_text('onco_map_esoph_c15'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_esophageal'),  uuid_from_text('onco_ps_c15'),   true,  true, NOW(), NOW()),
  -- Pancreatic → C25 / C25.0
  (uuid_from_text('onco_map_panc_c25'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_pancreatic'),  uuid_from_text('onco_ps_c25'),   false, true, NOW(), NOW()),
  (uuid_from_text('onco_map_panc_c250'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_pancreatic'),  uuid_from_text('onco_ps_c250'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_pnet_c25'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_pnet'),        uuid_from_text('onco_ps_c25'),   true,  true, NOW(), NOW()),
  -- HCC / CCA → C22
  (uuid_from_text('onco_map_hcc_c22'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_hcc'),         uuid_from_text('onco_ps_c22'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_cca_c22'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cca'),         uuid_from_text('onco_ps_c22'),   false, true, NOW(), NOW()),
  (uuid_from_text('onco_map_cca_c24'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cca'),         uuid_from_text('onco_ps_c24'),   true,  true, NOW(), NOW()),
  -- Gallbladder → C23
  (uuid_from_text('onco_map_gall_c23'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_gallbladder'), uuid_from_text('onco_ps_c23'),   true,  true, NOW(), NOW()),
  -- Anal → C21
  (uuid_from_text('onco_map_anal_c21'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_anal'),        uuid_from_text('onco_ps_c21'),   true,  true, NOW(), NOW()),
  -- Prostate → C61
  (uuid_from_text('onco_map_pros_c61'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_prostate'),    uuid_from_text('onco_ps_c61'),   true,  true, NOW(), NOW()),
  -- RCC → C64
  (uuid_from_text('onco_map_rcc_c64'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_rcc'),         uuid_from_text('onco_ps_c64'),   true,  true, NOW(), NOW()),
  -- Bladder → C67
  (uuid_from_text('onco_map_blad_c67'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_bladder'),     uuid_from_text('onco_ps_c67'),   true,  true, NOW(), NOW()),
  -- Urothelial → C65/C66
  (uuid_from_text('onco_map_uro_c65'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_urothelial'),  uuid_from_text('onco_ps_c65'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_uro_c66'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_urothelial'),  uuid_from_text('onco_ps_c66'),   false, true, NOW(), NOW()),
  -- Testicular → C62
  (uuid_from_text('onco_map_test_c62'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_testicular'),  uuid_from_text('onco_ps_c62'),   true,  true, NOW(), NOW()),
  -- Gynecologic
  (uuid_from_text('onco_map_cerv_c53'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cervical'),    uuid_from_text('onco_ps_c53'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_ovar_c56'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_ovarian'),     uuid_from_text('onco_ps_c56'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_endo_c54'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_endometrial'), uuid_from_text('onco_ps_c54'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_vulv_c51'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_vulvar'),      uuid_from_text('onco_ps_c51'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_vagi_c52'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_vaginal'),     uuid_from_text('onco_ps_c52'),   true,  true, NOW(), NOW()),
  -- Head & Neck
  (uuid_from_text('onco_map_hnscc_c10'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_hnscc'),       uuid_from_text('onco_ps_c10'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_hnscc_c32'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_hnscc'),       uuid_from_text('onco_ps_c32'),   false, true, NOW(), NOW()),
  (uuid_from_text('onco_map_npc_c11'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_npc'),         uuid_from_text('onco_ps_c11'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_thyroid_c73'),  '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_thyroid'),     uuid_from_text('onco_ps_c73'),   true,  true, NOW(), NOW()),
  -- CNS
  (uuid_from_text('onco_map_gbm_c71'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_gbm'),         uuid_from_text('onco_ps_c71'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_astro_c71'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_astrocytoma'), uuid_from_text('onco_ps_c71'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_oligo_c71'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_oligodendro'), uuid_from_text('onco_ps_c71'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_mening_c70'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_meningioma'),  uuid_from_text('onco_ps_c70'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_medull_c716'),  '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_medulloblasto'),uuid_from_text('onco_ps_c716'), true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_epend_c72'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_ependymoma'),  uuid_from_text('onco_ps_c72'),   true,  true, NOW(), NOW()),
  -- Hematologic → C42.1 (bone marrow) or C42.0 (blood) or C42.2 (spleen)
  (uuid_from_text('onco_map_aml_c421'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_aml'),         uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_all_c421'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_all'),         uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_cml_c421'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cml'),         uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_cll_c420'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cll'),         uuid_from_text('onco_ps_c420'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_myeloma_c421'), '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_myeloma'),     uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_mds_c421'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_mds'),         uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_mpn_c421'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_mpn'),         uuid_from_text('onco_ps_c421'),  true,  true, NOW(), NOW()),
  -- Lymphoma → lymph node sites
  (uuid_from_text('onco_map_hl_c770'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_hl'),          uuid_from_text('onco_ps_c770'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_dlbcl_c770'),   '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_dlbcl'),       uuid_from_text('onco_ps_c770'),  true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_fl_c770'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_fl'),          uuid_from_text('onco_ps_c770'),  true,  true, NOW(), NOW()),
  -- Skin → C44
  (uuid_from_text('onco_map_mel_c44'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_melanoma'),    uuid_from_text('onco_ps_c44'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_bcc_c44'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_bcc'),         uuid_from_text('onco_ps_c44'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_cscc_c44'),     '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_cscc'),        uuid_from_text('onco_ps_c44'),   true,  true, NOW(), NOW()),
  -- Sarcoma / Bone → C49 / C40 / C41
  (uuid_from_text('onco_map_sts_c49'),      '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_sts'),         uuid_from_text('onco_ps_c49'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_osteo_c40'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_osteosarcoma'),uuid_from_text('onco_ps_c40'),   true,  true, NOW(), NOW()),
  (uuid_from_text('onco_map_ewing_c40'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_ewing'),       uuid_from_text('onco_ps_c40'),   true,  true, NOW(), NOW()),
  -- Mesothelioma → C38.4
  (uuid_from_text('onco_map_meso_c384'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_mesothelioma'),uuid_from_text('onco_ps_c384'),  true,  true, NOW(), NOW()),
  -- Adrenal → C74
  (uuid_from_text('onco_map_adren_c74'),    '11111111-1111-1111-1111-111111111111'::uuid, uuid_from_text('onco_ct_adrenal'),     uuid_from_text('onco_ps_c74'),   true,  true, NOW(), NOW())

ON CONFLICT (tenant_id, cancer_type_id, primary_site_id) DO NOTHING;
