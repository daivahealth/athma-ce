# PMS Service - Practice Management System

This service handles the core Practice Management System functionality for the Zeal platform, including patient management, appointment scheduling, and clinical encounters.

## Features

### Patient Management
- **Patient Registration**: Emirates ID validation with checksum verification
- **Patient Search**: Advanced search with multiple fields and fuzzy matching
- **Patient Profiles**: Comprehensive patient information with translations
- **Medical History**: Complete medical history tracking and summaries
- **Duplicate Detection**: AI-powered duplicate patient identification
- **Patient Merging**: Safe patient record consolidation
- **Consent Management**: UAE PDPL compliant consent tracking
- **Multi-language Support**: Arabic/English translations for patient data

### Appointment Scheduling
- **Multi-resource Scheduling**: Staff, space, and equipment coordination
- **Availability Management**: Real-time availability checking and slot management
- **Recurring Appointments**: Flexible recurring appointment patterns
- **Waitlist Management**: Intelligent waitlist with priority handling
- **Calendar Views**: Day, week, and month calendar interfaces
- **Appointment Types**: Various appointment types with specific configurations
- **Visit Type Classification**: New, revisit, and follow-up visit handling
- **Conflict Detection**: Automatic conflict detection and resolution
- **Resource Utilization**: Staff and space utilization analytics
- **Bulk Operations**: Bulk updates and cancellations
- **Templates**: Appointment templates for common scheduling patterns
- **Reminders**: Multi-channel appointment reminders (SMS, email, push)

### Clinical Encounters
- **Encounter Management**: Complete encounter lifecycle management
- **Clinical Notes**: SOAP notes, progress notes, and assessments
- **Vital Signs**: Comprehensive vital signs tracking and trending
- **Order Management**: Lab, imaging, procedure, and medication orders
- **Walk-in Encounters**: Emergency and walk-in patient handling
- **Encounter Templates**: Predefined encounter templates
- **Clinical Documentation**: Structured clinical documentation
- **Multi-encounter Linking**: Episode-based care management
- **Discharge Planning**: Comprehensive discharge instructions

## API Endpoints

### Patient Management
```
POST   /api/v1/pms/patients                    # Create patient
GET    /api/v1/pms/patients                    # Get patients (paginated)
GET    /api/v1/pms/patients/search             # Search patients
GET    /api/v1/pms/patients/:id                # Get patient by ID
PUT    /api/v1/pms/patients/:id                # Update patient
DELETE /api/v1/pms/patients/:id                # Delete patient
GET    /api/v1/pms/patients/:id/appointments   # Get patient appointments
GET    /api/v1/pms/patients/:id/encounters     # Get patient encounters
GET    /api/v1/pms/patients/:id/medical-history # Get medical history
POST   /api/v1/pms/patients/:id/merge          # Merge patients
GET    /api/v1/pms/patients/:id/duplicates     # Find duplicate patients
POST   /api/v1/pms/patients/:id/consent        # Update consent
GET    /api/v1/pms/patients/:id/translations   # Get translations
POST   /api/v1/pms/patients/:id/translations   # Update translations
```

### Appointment Management
```
POST   /api/v1/pms/appointments                    # Create appointment
GET    /api/v1/pms/appointments                    # Get appointments (paginated)
GET    /api/v1/pms/appointments/search             # Search appointments
GET    /api/v1/pms/appointments/stats              # Get appointment statistics
GET    /api/v1/pms/appointments/analytics          # Get appointment analytics
GET    /api/v1/pms/appointments/:id                # Get appointment by ID
PUT    /api/v1/pms/appointments/:id                # Update appointment
DELETE /api/v1/pms/appointments/:id                # Cancel appointment
POST   /api/v1/pms/appointments/:id/check-in       # Check in appointment
POST   /api/v1/pms/appointments/:id/complete       # Complete appointment
POST   /api/v1/pms/appointments/:id/reschedule     # Reschedule appointment
POST   /api/v1/pms/appointments/check-availability # Check availability
GET    /api/v1/pms/appointments/availability       # Get availability slots
PUT    /api/v1/pms/appointments/bulk-update        # Bulk update appointments
POST   /api/v1/pms/appointments/bulk-cancel        # Bulk cancel appointments
POST   /api/v1/pms/appointments/recurring          # Create recurring appointments
DELETE /api/v1/pms/appointments/recurring/:seriesId # Cancel recurring series
POST   /api/v1/pms/appointments/waitlist           # Add to waitlist
GET    /api/v1/pms/appointments/waitlist           # Get waitlist
PUT    /api/v1/pms/appointments/waitlist/:id       # Update waitlist item
DELETE /api/v1/pms/appointments/waitlist/:id       # Remove from waitlist
GET    /api/v1/pms/appointments/calendar/day/:date  # Day view
GET    /api/v1/pms/appointments/calendar/week/:week # Week view
GET    /api/v1/pms/appointments/calendar/month/:month # Month view
GET    /api/v1/pms/appointments/utilization/staff/:staffId # Staff utilization
GET    /api/v1/pms/appointments/utilization/space/:spaceId # Space utilization
GET    /api/v1/pms/appointments/utilization/facility/:facilityId # Facility utilization
GET    /api/v1/pms/appointments/conflicts           # Get conflicts
GET    /api/v1/pms/appointments/:id/conflicts       # Get appointment conflicts
GET    /api/v1/pms/appointments/templates           # Get templates
POST   /api/v1/pms/appointments/templates           # Create template
POST   /api/v1/pms/appointments/:id/send-reminder   # Send reminder
POST   /api/v1/pms/appointments/send-bulk-reminders # Send bulk reminders
```

### Clinical Encounters
```
POST   /api/v1/pms/encounters                    # Create encounter
GET    /api/v1/pms/encounters                    # Get encounters (paginated)
GET    /api/v1/pms/encounters/search             # Search encounters
GET    /api/v1/pms/encounters/stats              # Get encounter statistics
GET    /api/v1/pms/encounters/:id                # Get encounter by ID
PUT    /api/v1/pms/encounters/:id                # Update encounter
DELETE /api/v1/pms/encounters/:id                # Delete encounter
POST   /api/v1/pms/encounters/:id/start          # Start encounter
POST   /api/v1/pms/encounters/:id/complete       # Complete encounter
POST   /api/v1/pms/encounters/:id/cancel         # Cancel encounter
GET    /api/v1/pms/encounters/:id/notes          # Get clinical notes
POST   /api/v1/pms/encounters/:id/notes          # Create clinical note
PUT    /api/v1/pms/encounters/notes/:noteId      # Update clinical note
DELETE /api/v1/pms/encounters/notes/:noteId      # Delete clinical note
GET    /api/v1/pms/encounters/:id/vitals         # Get vitals
POST   /api/v1/pms/encounters/:id/vitals         # Record vitals
PUT    /api/v1/pms/encounters/vitals/:vitalId    # Update vitals
GET    /api/v1/pms/encounters/:id/orders         # Get orders
POST   /api/v1/pms/encounters/:id/orders         # Create order
PUT    /api/v1/pms/encounters/orders/:orderId    # Update order
DELETE /api/v1/pms/encounters/orders/:orderId    # Cancel order
```

## Data Models

### Patient
- Emirates ID with checksum validation
- Multi-language support with translations
- Comprehensive demographic information
- Emergency contact details
- Insurance information
- Consent tracking for PDPL compliance
- Medical history summaries

### Appointment
- Multi-resource scheduling (staff, space, equipment)
- Flexible appointment types and visit classifications
- Recurring appointment patterns
- Status tracking through appointment lifecycle
- Waitlist management with priority
- Reminder configurations
- Conflict detection and resolution

### Encounter
- Comprehensive encounter documentation
- Clinical notes with templates
- Vital signs tracking
- Order management integration
- Walk-in and emergency encounter support
- Multi-encounter episode linking
- Discharge planning

## Key Features

### Emirates ID Validation
- Format validation (XXX-XXXX-XXXXXXX-X)
- Checksum validation using UAE algorithm
- Duplicate detection and prevention

### Multi-language Support
- Arabic/English translations
- RTL support for Arabic content
- Translation management system

### Resource Management
- Staff availability tracking
- Space and equipment scheduling
- Conflict detection and resolution
- Utilization analytics

### Clinical Workflow
- Structured clinical documentation
- Template-based note creation
- Order management integration
- Episode-based care tracking

### Analytics and Reporting
- Appointment statistics and trends
- Resource utilization metrics
- Clinical encounter analytics
- Performance indicators

## Security and Compliance

### UAE PDPL Compliance
- Patient consent management
- Data access logging
- Right to be forgotten implementation
- Data portability support

### Multi-tenant Architecture
- Complete tenant isolation
- Row-level security (RLS)
- Tenant-specific configurations

### Audit Trail
- Comprehensive audit logging
- Data change tracking
- User action monitoring

## Integration Points

### External Systems
- HIE platforms (NABIDH, Malaffi, Riayati)
- UAE connector integrations
- Clearinghouse connections

### Internal Services
- Authentication service (RBAC/MFA)
- Billing and RCM services
- AI/ML services for clinical assistance
- Notification services

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Redis (for caching)

### Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## Architecture

The PMS service follows NestJS patterns with:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Handle data access
- **DTOs**: Validate request/response data
- **Modules**: Organize functionality

### Database
- PostgreSQL with Prisma ORM
- Row-level security for multi-tenancy
- Comprehensive indexing for performance
- Transaction management for data integrity

### Validation
- Zod schemas for runtime validation
- Comprehensive input validation
- Error handling with user-friendly messages

### Caching
- Redis for session management
- Query result caching
- Real-time availability caching
