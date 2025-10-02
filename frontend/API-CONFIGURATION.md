# Frontend API Configuration

## Backend Server Configuration

The frontend is configured to connect to the backend server running on **localhost:3002**.

### Configuration Files

1. **API Client** (`src/lib/api.ts`)
   - Base URL: `http://localhost:3002/api`
   - Environment variable: `NEXT_PUBLIC_API_BASE_URL`
   - Fallback: `http://localhost:3002/api`

2. **Query Functions** (`src/lib/query.ts`)
   - Uses `realApi` functions that call the backend
   - Falls back to `mockApi` if backend is unavailable
   - Error handling with console logging

### Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api

# Frontend Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### API Endpoints

The frontend expects the following backend endpoints:

#### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

#### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

#### Claims
- `GET /api/claims` - Get all claims
- `GET /api/claims/:id` - Get claim by ID
- `POST /api/claims` - Create new claim
- `PUT /api/claims/:id` - Update claim
- `DELETE /api/claims/:id` - Delete claim

#### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/stats` - Get dashboard statistics

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### Data Format

The frontend expects the following data formats:

#### Patients
```typescript
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
```

#### Appointments
```typescript
interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: string;
}
```

#### Claims
```typescript
interface Claim {
  id: string;
  claimNumber: string;
  patientName: string;
  payer: string;
  amount: number;
  status: 'submitted' | 'accepted' | 'denied' | 'pending';
  dateOfService: string;
}
```

#### Dashboard KPIs
```typescript
interface DashboardKPIs {
  admissions: number;
  collections: number;
  arDays: number;
  denialRate: number;
}
```

### Error Handling

- API calls include try-catch blocks
- Failed requests fall back to mock data
- Console errors are logged for debugging
- React Query handles retries and caching

### Development vs Production

- **Development**: Uses mock data as fallback when backend is unavailable
- **Production**: Should always connect to the backend API
- **Environment**: Configure via `NEXT_PUBLIC_API_BASE_URL`

### Testing

To test the API connection:

1. Start the backend server on port 3002
2. Start the frontend server on port 3000
3. Check browser console for API calls
4. Verify data loads from backend instead of mocks

### Troubleshooting

1. **404 Errors**: Check if backend server is running on port 3002
2. **CORS Issues**: Ensure backend allows requests from localhost:3000
3. **Data Not Loading**: Check browser console for API errors
4. **Fallback to Mocks**: Backend is unavailable, check server status
