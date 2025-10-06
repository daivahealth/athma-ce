# 🗄️ Prisma Database Configuration Guide

## 📍 **Where to Configure Database URL**

Prisma reads the database connection from the `DATABASE_URL` environment variable. Here's where and how to configure it:

## 🔧 **Configuration Locations**

### **1. Environment Variables (Recommended)**

Create a `.env` file in your backend root directory:

```bash
# Location: /Users/sajithchandran/aira/zeal/backend/.env
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"
```

### **2. Prisma Schema Configuration**

Your Prisma schema is already configured to use the environment variable:

```prisma
// File: backend/shared/database/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp")]
}
```

## 🎯 **Database URL Format**

### **For Local Development (Docker)**
```
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"
```

### **For Docker Network (Container-to-Container)**
```
DATABASE_URL="postgresql://zeal_user:zeal_password@zeal-postgres:5432/zeal_pms?schema=public"
```

### **For Production**
```
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?schema=public&sslmode=require"
```

## 📋 **Step-by-Step Setup**

### **1. Create Environment File**

Create a `.env` file in the backend directory:

```bash
cd /Users/sajithchandran/aira/zeal/backend
cp config.env.example .env
```

### **2. Update Database URL**

Edit the `.env` file and ensure the `DATABASE_URL` is correct:

```env
# For local development with Docker
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"

# Alternative for container-to-container communication
# DATABASE_URL="postgresql://zeal_user:zeal_password@zeal-postgres:5432/zeal_pms?schema=public"
```

### **3. Generate Prisma Client**

```bash
cd backend/shared/database
npx prisma generate
```

### **4. Run Database Migrations**

```bash
cd backend/shared/database
npx prisma db push
```

## 🔍 **Current Database Status**

Based on your running containers:

| Component | Status | Details |
|-----------|--------|---------|
| PostgreSQL | ✅ Running | `zeal-postgres` on port 5432 |
| Database | ✅ Created | `zeal_pms` with sample data |
| Prisma Schema | ✅ Configured | Ready for client generation |
| Environment | ⚠️ Needs Setup | Create `.env` file |

## 🚀 **Quick Setup Commands**

### **1. Create Environment File**
```bash
cd /Users/sajithchandran/aira/zeal/backend
cat > .env << 'EOF'
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=zeal_pms
POSTGRES_USER=zeal_user
POSTGRES_PASSWORD=zeal_password
NODE_ENV=development
PORT=3002
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
```

### **2. Generate Prisma Client**
```bash
cd /Users/sajithchandran/aira/zeal/backend/shared/database
npx prisma generate
```

### **3. Test Connection**
```bash
cd /Users/sajithchandran/aira/zeal/backend/shared/database
npx prisma db pull
```

## 🔧 **Environment Variables Reference**

### **Required Variables**
```env
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"
```

### **Optional Variables**
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=zeal_pms
POSTGRES_USER=zeal_user
POSTGRES_PASSWORD=zeal_password
```

## 🐛 **Troubleshooting**

### **Connection Issues**

#### **Error: "Can't reach database server"**
- Check if PostgreSQL container is running: `docker ps | grep postgres`
- Verify port 5432 is accessible: `nc -zv localhost 5432`
- Ensure correct hostname in `DATABASE_URL`

#### **Error: "Authentication failed"**
- Verify username and password in `DATABASE_URL`
- Check if database exists: `docker exec zeal-postgres psql -U zeal_user -d zeal_pms -c "SELECT 1;"`

#### **Error: "Database does not exist"**
- Create database: `docker exec zeal-postgres createdb -U zeal_user zeal_pms`
- Or use existing database: `docker exec zeal-postgres psql -U zeal_user -l`

### **Prisma Issues**

#### **Error: "Prisma Client not generated"**
```bash
cd backend/shared/database
npx prisma generate
```

#### **Error: "Schema out of sync"**
```bash
cd backend/shared/database
npx prisma db push
```

## 📊 **Database URL Examples**

### **Local Development**
```env
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"
```

### **Docker Network**
```env
DATABASE_URL="postgresql://zeal_user:zeal_password@zeal-postgres:5432/zeal_pms?schema=public"
```

### **Production (AWS RDS)**
```env
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/zeal_pms?schema=public&sslmode=require"
```

### **Production (Azure Database)**
```env
DATABASE_URL="postgresql://username:password@your-azure-server.postgres.database.azure.com:5432/zeal_pms?schema=public&sslmode=require"
```

## 🎯 **Next Steps**

1. **Create `.env` file** with the correct `DATABASE_URL`
2. **Generate Prisma client** using `npx prisma generate`
3. **Test the connection** using `npx prisma db pull`
4. **Start using Prisma** in your NestJS services

## 📖 **Related Files**

- **Prisma Schema**: `backend/shared/database/prisma/schema.prisma`
- **Environment Example**: `backend/config.env.example`
- **Database Service**: `backend/shared/database/src/prisma.service.ts`
- **Docker Compose**: `docker-compose.yml`

---

**TL;DR:** Create a `.env` file in `backend/` with `DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms?schema=public"` and run `npx prisma generate` in the `backend/shared/database/` directory.







