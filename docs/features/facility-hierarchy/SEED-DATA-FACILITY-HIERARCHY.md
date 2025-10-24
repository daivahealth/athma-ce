# Seed Data - Facility Hierarchy

**Date**: October 8, 2025  
**Status**: ✅ **COMPLETE & READY TO EXECUTE**

---

## 📊 **Seed Files Created**

### **New Seed Files:**

1. **`07-departments.sql`** - Creates 8 departments
   - 2 OPD departments (Main Hospital + Downtown Clinic)
   - 1 IPD department (Main Hospital)
   - 5 Support departments (Emergency, Radiology, Lab, Surgery, Pharmacy)

2. **`08-wards.sql`** - Creates 9 wards (IPD only)
   - 2 ICU wards
   - 1 NICU ward
   - 1 PICU ward
   - 3 General wards
   - 1 Isolation ward
   - 1 Maternity ward

3. **`09-beds.sql`** - Creates 109 beds across all wards
   - ICU Ward 1: 10 beds
   - ICU Ward 2: 8 beds
   - NICU: 6 beds
   - PICU: 5 beds
   - General Ward A: 20 beds
   - General Ward B: 20 beds
   - General Ward C: 20 beds
   - Isolation: 5 beds
   - Maternity: 15 beds (10 standard + 5 private)

4. **`10-clinics.sql`** - Creates 12 clinics (OPD only)
   - Main Hospital: 10 specialty clinics
   - Downtown Clinic: 2 general clinics

### **Updated File:**

- **`00-seed-execution-guide.md`** - Updated execution sequence

### **Helper Script:**

- **`seed-facility-hierarchy.sh`** - Quick execution script

---

## 🏥 **Data Summary**

### **Departments (8 total)**

| Department | Code | Type | Facility | Floor | Ext |
|------------|------|------|----------|-------|-----|
| Outpatient Department | OPD | opd | Main Hospital | 1 | 1000 |
| Inpatient Department | IPD | ipd | Main Hospital | 3 | 3000 |
| Emergency Department | ER | emergency | Main Hospital | G | 9999 |
| Radiology Department | RAD | radiology | Main Hospital | 2 | 2000 |
| Laboratory Department | LAB | laboratory | Main Hospital | 1 | 1500 |
| Surgery Department | SURG | surgery | Main Hospital | 4 | 4000 |
| Pharmacy Department | PHARM | pharmacy | Main Hospital | G | 1200 |
| Outpatient Department | OPD | opd | Downtown Clinic | G | 2000 |

### **Wards (9 total - IPD only)**

| Ward | Code | Type | Floor | Total Beds | Nursing Station |
|------|------|------|-------|------------|-----------------|
| ICU Ward 1 | ICU-1 | icu | 3 | 10 | NS-ICU-1 |
| ICU Ward 2 | ICU-2 | icu | 3 | 8 | NS-ICU-2 |
| Neonatal ICU | NICU-1 | nicu | 3 | 6 | NS-NICU-1 |
| Pediatric ICU | PICU-1 | picu | 3 | 5 | NS-PICU-1 |
| General Ward A | GEN-A | general | 4 | 20 | NS-GEN-A |
| General Ward B | GEN-B | general | 4 | 20 | NS-GEN-B |
| General Ward C | GEN-C | general | 5 | 20 | NS-GEN-C |
| Isolation Ward | ISO-1 | isolation | 5 | 5 | NS-ISO-1 |
| Maternity Ward | MAT-1 | maternity | 6 | 15 | NS-MAT-1 |

### **Beds (109 total - All Available)**

| Ward Type | Beds | Features |
|-----------|------|----------|
| ICU | 18 | Oxygen, Monitor, Ventilator, ECG |
| NICU | 6 | Oxygen, Monitor, Ventilator, Incubator, Phototherapy |
| PICU | 5 | Oxygen, Monitor, Ventilator, ECG |
| General | 60 | Oxygen, Call Button |
| Isolation | 5 | Oxygen, Monitor, Negative Pressure, Anteroom |
| Maternity (Standard) | 10 | Oxygen, Monitor, Baby Bassinet, Call Button |
| Maternity (Private) | 5 | Oxygen, Monitor, Baby Bassinet, Private Bathroom, TV, Sofa |

### **Clinics (12 total - OPD only)**

**Main Hospital (10 clinics):**

| Clinic | Code | Specialty | Floor | Rooms |
|--------|------|-----------|-------|-------|
| Cardiology Clinic | CARDIO-1 | cardiology | 1 | 5 |
| Pediatrics Clinic | PEDIA-1 | pediatrics | 1 | 8 |
| General Medicine Clinic | GEN-MED-1 | general_medicine | 1 | 10 |
| Orthopedics Clinic | ORTHO-1 | orthopedics | 1 | 6 |
| Dermatology Clinic | DERM-1 | dermatology | 1 | 4 |
| Ophthalmology Clinic | OPHTHAL-1 | ophthalmology | 1 | 5 |
| ENT Clinic | ENT-1 | ent | 1 | 4 |
| Gynecology Clinic | GYNECO-1 | gynecology | 2 | 6 |
| Neurology Clinic | NEURO-1 | neurology | 2 | 4 |
| Psychiatry Clinic | PSYCH-1 | psychiatry | 2 | 3 |

**Downtown Clinic (2 clinics):**

| Clinic | Code | Specialty | Floor | Rooms |
|--------|------|-----------|-------|-------|
| General Medicine Clinic | GEN-MED-1 | general_medicine | G | 6 |
| Family Medicine Clinic | FAM-MED-1 | family_medicine | G | 4 |

---

## 🚀 **How to Execute**

### **Option 1: Quick Script (Recommended)**
```bash
cd /Users/sajithchandran/aira/zeal/seed
./seed-facility-hierarchy.sh
```

This script will:
- ✅ Check if PostgreSQL container is running
- ✅ Execute all 4 seed files in order
- ✅ Display verification results
- ✅ Show summary statistics

### **Option 2: Manual Execution**
```bash
cd /Users/sajithchandran/aira/zeal/seed

# Execute in order
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 07-departments.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 08-wards.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 09-beds.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 10-clinics.sql
```

### **Option 3: Individual Files**
```bash
# Just departments
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 07-departments.sql

# Departments + Wards
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 07-departments.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 08-wards.sql

# Full hierarchy
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 07-departments.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 08-wards.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 09-beds.sql
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 10-clinics.sql
```

---

## 🧪 **Verification**

### **After Seeding, Verify:**

```bash
# 1. Check facility hierarchy summary
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  f.name as facility,
  COUNT(DISTINCT d.id) as departments,
  COUNT(DISTINCT w.id) as wards,
  COUNT(DISTINCT b.id) as beds,
  COUNT(DISTINCT c.id) as clinics
FROM facilities f
LEFT JOIN departments d ON d.facility_id = f.id
LEFT JOIN wards w ON w.department_id = d.id
LEFT JOIN beds b ON b.ward_id = w.id
LEFT JOIN clinics c ON c.department_id = d.id
WHERE f.tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY f.id, f.name;
"

# Expected output:
# Main Hospital: 7 departments, 9 wards, 109 beds, 10 clinics
# Downtown Clinic: 1 department, 0 wards, 0 beds, 2 clinics

# 2. Check ward bed counts
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT name, ward_type, total_beds, available_beds 
FROM wards 
ORDER BY ward_type, name;
"

# Expected: All wards should have correct bed counts

# 3. Check bed statuses
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  status, 
  COUNT(*) as count 
FROM beds 
GROUP BY status;
"

# Expected: 109 beds with status 'available'

# 4. Check clinics by specialty
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT specialty, COUNT(*) as count 
FROM clinics 
GROUP BY specialty 
ORDER BY count DESC;
"
```

---

## 📋 **Expected Results**

### **After Successful Execution:**

```
Facility Hierarchy:
├─ Main Hospital
│   ├─ Departments: 7
│   │   ├─ OPD → 10 Clinics (55 consultation rooms)
│   │   ├─ IPD → 9 Wards → 109 Beds (all available)
│   │   ├─ Emergency
│   │   ├─ Radiology
│   │   ├─ Laboratory
│   │   ├─ Surgery
│   │   └─ Pharmacy
│
└─ Downtown Clinic
    └─ Departments: 1
        └─ OPD → 2 Clinics (10 consultation rooms)

Total:
- 8 Departments
- 9 Wards (IPD)
- 109 Beds (IPD)
- 12 Clinics (OPD)
- 65 Total Consultation Rooms
```

### **Ward Bed Distribution:**
```
ICU:        18 beds (2 wards)
NICU:        6 beds (1 ward)
PICU:        5 beds (1 ward)
General:    60 beds (3 wards)
Isolation:   5 beds (1 ward)
Maternity:  15 beds (1 ward)
──────────────────────
Total:     109 beds
```

### **Clinic Room Distribution:**
```
Main Hospital OPD:    55 rooms across 10 specialties
Downtown Clinic OPD:  10 rooms across 2 clinics
──────────────────────
Total:                65 consultation rooms
```

---

## 🎯 **Use Cases Enabled**

### **IPD Operations:**
- ✅ Real-time bed availability tracking
- ✅ Patient admission to specific bed
- ✅ Ward occupancy monitoring
- ✅ Bed type filtering (ICU, General, Private, etc.)
- ✅ Multi-ward management

### **OPD Operations:**
- ✅ Specialty-based clinic organization
- ✅ Consultation room management
- ✅ Clinic schedule by specialty
- ✅ Room utilization tracking

### **Department Management:**
- ✅ Department-level operations
- ✅ Head of department assignment
- ✅ Operating hours per department
- ✅ Floor number tracking

---

## 🔄 **Dependencies**

### **Required Seed Files (Must Run First):**
```bash
01-tenants.sql      # Must exist
02-users.sql        # Optional (for head of department)
04-facilities.sql   # Must exist
20-patients.sql     # Optional (for bed assignment testing)
```

### **Execution Order:**
```
1. 07-departments.sql  (requires facilities)
2. 08-wards.sql       (requires departments with type='ipd')
3. 09-beds.sql        (requires wards, auto-updates ward counts)
4. 10-clinics.sql     (requires departments with type='opd')
```

---

## 🧪 **Testing the Seed Data**

### **Test 1: Verify Departments**
```bash
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  d.name,
  d.code,
  d.department_type,
  f.name as facility_name
FROM departments d
JOIN facilities f ON f.id = d.facility_id
ORDER BY f.name, d.code;
"
```

### **Test 2: Verify Ward Hierarchy**
```bash
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  w.name as ward,
  w.total_beds,
  w.available_beds,
  COUNT(b.id) as actual_beds
FROM wards w
LEFT JOIN beds b ON b.ward_id = w.id
GROUP BY w.id, w.name, w.total_beds, w.available_beds
ORDER BY w.name;
"
```

### **Test 3: Verify Bed Features**
```bash
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  w.name as ward,
  b.bed_number,
  b.bed_type,
  b.features,
  b.status
FROM beds b
JOIN wards w ON w.id = b.ward_id
WHERE w.ward_type = 'icu'
ORDER BY b.bed_number
LIMIT 10;
"
```

### **Test 4: Verify Clinics**
```bash
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms -c "
SELECT 
  c.name,
  c.specialty,
  c.total_rooms,
  f.name as facility_name
FROM clinics c
JOIN departments d ON d.id = c.department_id
JOIN facilities f ON f.id = d.facility_id
ORDER BY f.name, c.specialty;
"
```

---

## 📦 **Sample Data Details**

### **Department Types:**
- `opd` - Outpatient Department (2 instances)
- `ipd` - Inpatient Department (1 instance)
- `emergency` - Emergency Department (1 instance)
- `radiology` - Radiology Department (1 instance)
- `laboratory` - Laboratory Department (1 instance)
- `surgery` - Surgery Department (1 instance)
- `pharmacy` - Pharmacy Department (1 instance)

### **Ward Types:**
- `icu` - Intensive Care Unit (2 wards, 18 beds)
- `nicu` - Neonatal ICU (1 ward, 6 beds)
- `picu` - Pediatric ICU (1 ward, 5 beds)
- `general` - General Ward (3 wards, 60 beds)
- `isolation` - Isolation Ward (1 ward, 5 beds)
- `maternity` - Maternity Ward (1 ward, 15 beds)

### **Bed Types:**
- `icu` - ICU Bed (29 beds)
- `standard` - Standard Bed (70 beds)
- `isolation` - Isolation Bed (5 beds)
- `private` - Private Room Bed (5 beds)

### **Clinic Specialties:**
- cardiology (1 clinic, 5 rooms)
- pediatrics (1 clinic, 8 rooms)
- general_medicine (2 clinics, 16 rooms)
- orthopedics (1 clinic, 6 rooms)
- dermatology (1 clinic, 4 rooms)
- ophthalmology (1 clinic, 5 rooms)
- ent (1 clinic, 4 rooms)
- gynecology (1 clinic, 6 rooms)
- neurology (1 clinic, 4 rooms)
- psychiatry (1 clinic, 3 rooms)
- family_medicine (1 clinic, 4 rooms)

---

## 🔧 **Customization**

### **To Add More Beds:**
Edit `09-beds.sql` and add:
```sql
INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status)
VALUES
  (uuid_generate_v4(), 
   'w0000001-0001-0001-0001-000000000001', -- ICU Ward 1
   'ICU-111', 
   'icu', 
   '{"oxygen": true, "monitor": true, "ventilator": true}', 
   'available');

-- Then update ward counts
UPDATE wards 
SET total_beds = (SELECT COUNT(*) FROM beds WHERE ward_id = wards.id),
    available_beds = (SELECT COUNT(*) FROM beds WHERE ward_id = wards.id AND status = 'available');
```

### **To Add More Clinics:**
Edit `10-clinics.sql` and add:
```sql
INSERT INTO clinics (id, department_id, name, code, specialty, floor_number, total_rooms, status)
VALUES
  (uuid_generate_v4(),
   'd0000001-0001-0001-0001-000000000001', -- OPD Department
   'Endocrinology Clinic',
   'ENDO-1',
   'endocrinology',
   '2',
   4,
   'active');
```

### **To Add More Wards:**
Edit `08-wards.sql` and add:
```sql
INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status)
VALUES
  (uuid_generate_v4(),
   'd0000001-0002-0001-0001-000000000001', -- IPD Department
   'Surgical Ward',
   'SURG-1',
   'general',
   '5',
   0,
   0,
   'NS-SURG-1',
   'active');
```

---

## 📈 **Statistics**

### **Bed Capacity:**
- Total Beds: 109
- Average per Ward: ~12 beds
- Largest Ward: General Wards (20 beds each)
- Smallest Ward: PICU (5 beds)
- ICU Capacity: 29 beds (26.6% of total)
- General Capacity: 60 beds (55% of total)

### **Clinic Capacity:**
- Total Clinics: 12
- Total Consultation Rooms: 65
- Average Rooms per Clinic: ~5.4
- Largest Clinic: General Medicine (10 rooms)
- Smallest Clinic: Psychiatry (3 rooms)

### **Operating Hours:**
- 24/7 Departments: IPD, Emergency, Pharmacy
- Extended Hours: OPD (8am-8pm), Radiology
- Standard Hours: Most clinics (8am-5pm)
- Weekend Hours: Reduced (8am-2pm)

---

## ✅ **Post-Seed Checklist**

After running the seed scripts:

- [ ] Verify department count: `SELECT COUNT(*) FROM departments;` → 8
- [ ] Verify ward count: `SELECT COUNT(*) FROM wards;` → 9
- [ ] Verify bed count: `SELECT COUNT(*) FROM beds;` → 109
- [ ] Verify clinic count: `SELECT COUNT(*) FROM clinics;` → 12
- [ ] Verify all beds are available: `SELECT COUNT(*) FROM beds WHERE status = 'available';` → 109
- [ ] Verify ward bed counts match: Check `total_beds` and `available_beds` in all wards
- [ ] Test API endpoints via Postman
- [ ] Verify frontend can fetch departments, wards, beds, and clinics

---

## 🎊 **Summary**

The seed data provides a **realistic healthcare facility setup**:

✅ **Main Hospital** - Full-service hospital with:
- 7 departments (OPD, IPD, ER, Radiology, Lab, Surgery, Pharmacy)
- 9 wards with 109 beds (IPD)
- 10 specialty clinics with 55 consultation rooms (OPD)

✅ **Downtown Clinic** - Small outpatient clinic with:
- 1 OPD department
- 2 general medicine clinics with 10 rooms

**Ready for:**
- Patient admission workflow testing
- Appointment scheduling testing
- Bed assignment/release testing
- Clinic scheduling testing
- Real-time occupancy tracking

---

**Created by**: AI Assistant  
**Date**: October 8, 2025  
**Status**: ✅ **READY TO EXECUTE**
