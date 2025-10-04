# Development Commands Reference

This document contains all the essential commands for managing the Zeal PMS development environment.

## 🚀 Quick Start Commands

### Start Both Services
```bash
# Terminal 1 - Backend
cd /Users/sajithchandran/aira/zeal/backend/services/pms
npm run dev

# Terminal 2 - Frontend  
cd /Users/sajithchandran/aira/zeal/frontend
npm run dev
```

## 🛑 Kill Processes

### Kill Backend (PMS Service)
```bash
# Kill the backend process
pkill -f "tsx watch"

# Or more specifically
pkill -f "tsx watch src/index.ts"
```

### Kill Frontend (Next.js)
```bash
# Kill the frontend process
pkill -f "next dev"
```

### Kill Both Services
```bash
# Kill both services at once
pkill -f "tsx watch" && pkill -f "next dev"
```

### Kill All Node.js Processes (Nuclear Option)
```bash
# Kill all Node.js processes (be careful - this kills ALL Node processes)
pkill -f node
```

## 🔍 Check Running Processes

### See What's Running
```bash
# See all running processes
ps aux | grep -E "(tsx|next|node)" | grep -v grep

# See processes on specific ports
lsof -i :3000  # Frontend port
lsof -i :3002  # Backend port
```

### Check by Port
```bash
# Check what's running on port 3000 (frontend)
lsof -i :3000

# Check what's running on port 3002 (backend)
lsof -i :3002
```

## 💀 Force Kill by Port

### Kill by Port Number
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3002 (backend)
lsof -ti:3002 | xargs kill -9
```

### Force Kill Specific Process
```bash
# Find the process ID
ps aux | grep "tsx watch" | grep -v grep

# Kill with force (replace PID with actual process ID)
kill -9 <PID>
```

## 🔄 Complete Restart Sequence

### Clean Restart Backend
```bash
cd /Users/sajithchandran/aira/zeal/backend/services/pms
pkill -f "tsx watch"
npm run dev
```

### Clean Restart Frontend
```bash
cd /Users/sajithchandran/aira/zeal/frontend
pkill -f "next dev"
rm -rf .next  # Clear Next.js cache
npm run dev
```

### Clean Restart Both
```bash
# Kill both services
pkill -f "tsx watch" && pkill -f "next dev"

# Start backend
cd /Users/sajithchandran/aira/zeal/backend/services/pms && npm run dev

# Start frontend (in another terminal)
cd /Users/sajithchandran/aira/zeal/frontend && npm run dev
```

## 🐛 Troubleshooting Commands

### Clear Caches
```bash
# Clear Next.js cache
cd /Users/sajithchandran/aira/zeal/frontend
rm -rf .next

# Clear npm cache
npm cache clean --force

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Commands
```bash
# Start PostgreSQL with Docker
cd /Users/sajithchandran/aira/zeal
docker-compose up -d postgres

# Stop PostgreSQL
docker-compose down

# Check database status
docker-compose ps
```

### Prisma Commands
```bash
# Generate Prisma client
cd /Users/sajithchandran/aira/zeal/backend/services/pms
npx prisma generate

# Push schema to database
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## 📊 Service URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3002
- **API Base**: http://localhost:3002/api/v1/pms
- **Prisma Studio**: http://localhost:5555 (when running)

## 🔧 Development Workflow

### 1. Start Development Environment
```bash
# Terminal 1 - Database
cd /Users/sajithchandran/aira/zeal
docker-compose up -d postgres

# Terminal 2 - Backend
cd /Users/sajithchandran/aira/zeal/backend/services/pms
npm run dev

# Terminal 3 - Frontend
cd /Users/sajithchandran/aira/zeal/frontend
npm run dev
```

### 2. Stop Development Environment
```bash
# Kill all services
pkill -f "tsx watch" && pkill -f "next dev"

# Stop database
cd /Users/sajithchandran/aira/zeal
docker-compose down
```

### 3. Full Reset (Nuclear Option)
```bash
# Kill all processes
pkill -f node

# Stop all containers
docker-compose down

# Clear all caches
cd /Users/sajithchandran/aira/zeal/frontend && rm -rf .next
cd /Users/sajithchandran/aira/zeal/backend && rm -rf node_modules
cd /Users/sajithchandran/aira/zeal/frontend && rm -rf node_modules

# Reinstall dependencies
cd /Users/sajithchandran/aira/zeal/backend && npm install
cd /Users/sajithchandran/aira/zeal/frontend && npm install
```

## 🚨 Emergency Commands

### When Everything is Broken
```bash
# Kill everything
sudo pkill -f node
sudo pkill -f tsx
sudo pkill -f next

# Stop all Docker containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Restart Docker
sudo systemctl restart docker  # Linux
# or
sudo service docker restart    # Linux
# or restart Docker Desktop on macOS/Windows
```

## 📝 Notes

- The `-9` flag forces termination if the process doesn't respond to normal kill signals
- Always use `pkill -f` to match the full command line, not just the process name
- `grep -v grep` excludes the grep process itself from the results
- Use `lsof -ti:PORT` to get just the process ID for a specific port
- The `rm -rf .next` command clears Next.js build cache and can fix many frontend issues

## 🔗 Related Files

- `backend/README.md` - Backend setup instructions
- `frontend/README.md` - Frontend setup instructions
- `docker-compose.yml` - Database configuration
- `package.json` - Dependencies and scripts






