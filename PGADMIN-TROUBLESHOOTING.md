# pgAdmin Connection Troubleshooting

> **Heads-up:** The single `zeal_pms` database has been replaced by four domain databases (`zeal_foundation`, `zeal_clinical`, `zeal_rcm`, `zeal_analytics`). When the examples below mention `zeal_pms`, substitute the database that matches the service you are investigating.

## 🔍 **Your Error:**
```
connection failed: connection to server at "127.0.0.1", port 5432 failed: Connection refused
Is the server running on that host and accepting TCP/IP connections?
```

## ✅ **Verification Results:**

### PostgreSQL Container Status
- ✅ Container `zeal-postgres` is **running and healthy**
- ✅ Port 5432 is **exposed and accessible**
- ✅ Network `nc -zv 127.0.0.1 5432` **succeeds**
- ✅ Docker internal connection **works**
- ✅ Current database has **4 patients and 1 appointment**

### Network Configuration
- Docker network: `zeal_zeal-network`
- Container IP: `172.21.0.2`
- Gateway: `172.21.0.1`
- Port mapping: `0.0.0.0:5432 -> 5432/tcp`

## 🎯 **Solution: Use the Correct Host in pgAdmin**

### **Why "127.0.0.1" might not work:**
pgAdmin is running **inside a Docker container** (`zeal-pgadmin`). When it tries to connect to `127.0.0.1`, it's looking for PostgreSQL **inside its own container**, not on the host machine.

### **Correct Connection Settings:**

Since both pgAdmin and PostgreSQL are in the **same Docker network** (`zeal_zeal-network`), use the **container name** as the host:

#### **Connection Tab in pgAdmin**
```
Host name/address:  zeal-postgres
Port:              5432
Maintenance database: zeal_pms
Username:          zeal_user
Password:          zeal_password
```

### **Alternative: Use Docker Network Gateway**
```
Host name/address:  172.21.0.1
Port:              5432
Maintenance database: zeal_pms
Username:          zeal_user
Password:          zeal_password
```

## 📋 **Step-by-Step Fix:**

### **Option 1: Connect via Container Name (RECOMMENDED)**
1. Open pgAdmin at http://localhost:8080
2. Login with:
   - Email: `admin@zeal.com`
   - Password: `zeal_admin`
3. Right-click "Servers" → "Register" → "Server..."
4. **General Tab:**
   - Name: `Zeal PMS Database`
5. **Connection Tab:**
   - Host: `zeal-postgres` ← **USE THIS**
   - Port: `5432`
   - Database: `zeal_pms`
   - Username: `zeal_user`
   - Password: `zeal_password`
6. Click "Save"

### **Option 2: Connect via Docker Gateway IP**
Use `172.21.0.1` instead of `zeal-postgres` in step 5 above.

### **Option 3: Connect via Container IP (least recommended)**
Use `172.21.0.2` instead of `zeal-postgres` in step 5 above.

## 🧪 **Verify the Connection Works:**

From terminal, test the connection:
```bash
# Test from inside the PostgreSQL container (this works)
docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT current_database(), current_user;"

# Test network connectivity
nc -zv 127.0.0.1 5432  # Should succeed

# Check Docker network
docker network inspect zeal_zeal-network | grep -A 5 "zeal-postgres\|zeal-pgadmin"
```

## 🐛 **Why This Happens:**

Docker containers have their own network namespace. When pgAdmin (running in `zeal-pgadmin` container) tries to connect to `127.0.0.1`:
- It looks for PostgreSQL **inside its own container**
- It does NOT look at the host machine's localhost
- It does NOT see other containers on the same network

The correct approach:
- Use **container name** (`zeal-postgres`) for inter-container communication
- Use **host machine's localhost** only when connecting from outside Docker

## 📊 **Current Status:**

Your infrastructure is working correctly:

| Component | Status | Details |
|-----------|--------|---------|
| PostgreSQL | ✅ Running | `zeal-postgres` on port 5432 |
| pgAdmin | ✅ Running | `zeal-pgadmin` on port 8080 |
| PMS Service | ✅ Running | Connected and serving on port 3002 |
| Network | ✅ Working | Port 5432 is accessible |
| Database | ✅ Populated | 4 patients, 1 appointment |

The issue is just the **connection string** in pgAdmin.

## 🎉 **Expected Result:**

Once you use `zeal-postgres` as the host:
- ✅ pgAdmin will connect successfully
- ✅ You'll see the `zeal_pms` database
- ✅ You'll see `patients` and `appointments` tables
- ✅ You can run queries and see the sample data

## 🔗 **Quick Reference:**

### pgAdmin Access
- URL: http://localhost:8080
- Email: `admin@zeal.com`
- Password: `zeal_admin`

### PostgreSQL Connection (from pgAdmin)
- Host: `zeal-postgres` ← **IMPORTANT**
- Port: `5432`
- Database: `zeal_pms`
- Username: `zeal_user`
- Password: `zeal_password`

### PMS Service API
- Health: http://localhost:3002/health
- Patients: http://localhost:3002/api/v1/pms/patients
- Appointments: http://localhost:3002/api/v1/pms/appointments

---

**TL;DR:** Use `zeal-postgres` as the hostname in pgAdmin, not `127.0.0.1` or `localhost`.






