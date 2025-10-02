# 🐘 pgAdmin Connection Guide for Zeal PostgreSQL

## ✅ **pgAdmin is Running Successfully!**

pgAdmin has been successfully deployed and is accessible at: **http://localhost:8080**

## 🔐 **pgAdmin Login Credentials**

### **Admin Login**
- **Email**: `admin@zeal.com`
- **Password**: `zeal_admin`

## 🗄️ **PostgreSQL Connection Details**

### **Zeal PMS Database Connection**
- **Host**: `zeal-postgres` (when connecting from within Docker network)
- **Port**: `5432`
- **Database**: `zeal_pms`
- **Username**: `zeal_user`
- **Password**: `zeal_password`

### **External Connection (from pgAdmin running on host)**
- **Host**: `localhost` or `127.0.0.1`
- **Port**: `5432`
- **Database**: `zeal_pms`
- **Username**: `zeal_user`
- **Password**: `zeal_password`

### **Alternative Connection (if localhost doesn't work)**
- **Host**: `172.21.0.1` (Docker bridge gateway)
- **Port**: `5432`
- **Database**: `zeal_pms`
- **Username**: `zeal_user`
- **Password**: `zeal_password`

## 📋 **Step-by-Step Connection Guide**

### **1. Access pgAdmin**
1. Open your web browser
2. Navigate to: `http://localhost:8080`
3. Login with:
   - Email: `admin@zeal.com`
   - Password: `zeal_admin`

### **2. Add New Server**
1. Right-click on "Servers" in the left panel
2. Select "Register" → "Server..."
3. Fill in the connection details:

#### **General Tab**
- **Name**: `Zeal PMS Database`

#### **Connection Tab**
- **Host name/address**: `localhost` (or `127.0.0.1`)
- **Port**: `5432`
- **Maintenance database**: `zeal_pms`
- **Username**: `zeal_user`
- **Password**: `zeal_password`

#### **Advanced Tab** (Optional)
- **DB restriction**: `zeal_pms`

### **3. Test Connection**
1. Click "Save" to test the connection
2. If successful, you'll see the database in the left panel
3. Expand to explore tables and data

## 🗂️ **Database Structure**

Once connected, you'll see:

### **Databases**
- `zeal_pms` - Main PMS database

### **Schemas**
- `public` - Main application schema
- `audit` - Audit logging schema

### **Tables in `public` Schema**
- `patients` - Patient information
- `appointments` - Appointment scheduling
- `audit.audit_log` - Change tracking

### **Sample Data**
- **3 Patients** with UAE Emirates IDs
- **1 Appointment** linked to a patient
- **Audit logs** for all changes

## 🔍 **Useful Queries to Try**

### **View All Patients**
```sql
SELECT * FROM patients ORDER BY created_at DESC;
```

### **View All Appointments**
```sql
SELECT 
    a.*,
    p.first_name,
    p.last_name,
    p.emirates_id
FROM appointments a
JOIN patients p ON a.patient_id = p.id
ORDER BY a.start_time DESC;
```

### **Database Statistics**
```sql
SELECT 
    (SELECT COUNT(*) FROM patients WHERE is_active = true) as total_patients,
    (SELECT COUNT(*) FROM appointments) as total_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') as scheduled_appointments;
```

### **View Audit Logs**
```sql
SELECT * FROM audit.audit_log ORDER BY changed_at DESC LIMIT 10;
```

## 🛠️ **Troubleshooting**

### **Connection Issues**

#### **If "localhost" host doesn't work:**
Try these alternatives:
1. `127.0.0.1`
2. `172.21.0.1` (Docker bridge gateway)
3. `zeal-postgres` (if connecting from within Docker network)
4. `host.docker.internal` (if on Mac/Windows)

#### **If port 5432 is busy:**
Check what's using the port:
```bash
docker ps | grep postgres
```

You should see:
- `zeal-postgres` on port 5432
- `supabase_db_*` on port 54322

#### **If authentication fails:**
Verify the credentials:
```bash
docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT current_user, current_database();"
```

### **Common Solutions**

#### **1. Check Container Status**
```bash
docker ps | grep -E "(postgres|pgadmin)"
```

#### **2. Check Container Logs**
```bash
docker logs zeal-postgres
docker logs zeal-pgadmin
```

#### **3. Restart Services**
```bash
cd /Users/sajithchandran/aira/zeal
docker-compose restart postgres pgadmin
```

#### **4. Test Direct Connection**
```bash
docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT version();"
```

## 🎯 **Quick Test Commands**

### **Test pgAdmin Access**
```bash
curl -s http://localhost:8080 | grep -i "pgadmin"
```

### **Test PostgreSQL Connection**
```bash
docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT 'Connection successful!' as status;"
```

### **View Database Info**
```bash
docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT get_database_info();"
```

## 📊 **Current Database Status**

Based on the running service, your database contains:
- ✅ **4 Patients** (including the one created via API)
- ✅ **1 Appointment** (scheduled for tomorrow)
- ✅ **Audit logs** for all changes
- ✅ **Indexes** for optimal performance
- ✅ **Sample data** with realistic UAE information

## 🚀 **Next Steps**

Once connected to pgAdmin, you can:
1. **Explore the schema** and understand the data structure
2. **Run custom queries** for analysis and reporting
3. **Monitor database performance** and query execution
4. **Backup and restore** data as needed
5. **Manage users and permissions** for different environments

## 🎉 **Success Indicators**

You'll know the connection is working when:
- ✅ pgAdmin loads at `http://localhost:8080`
- ✅ You can login with the provided credentials
- ✅ The "Zeal PMS Database" server appears in the left panel
- ✅ You can expand and see the `zeal_pms` database
- ✅ You can see the `patients` and `appointments` tables
- ✅ You can run queries and see the sample data

**Your PostgreSQL database is now fully accessible through pgAdmin!** 🎉
