// Simple working PMS service demonstration
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const patients = [
  {
    id: '1',
    emiratesId: '784-1234-1234567-1',
    firstName: 'Ahmed',
    lastName: 'Al-Rashid',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    phoneNumber: '+971501234567',
    email: 'ahmed@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    emiratesId: '784-5678-7654321-2',
    firstName: 'Fatima',
    lastName: 'Al-Zahra',
    dateOfBirth: '1985-03-22',
    gender: 'female',
    phoneNumber: '+971507654321',
    email: 'fatima@example.com',
    createdAt: new Date().toISOString(),
  }
];

const appointments = [
  {
    id: '1',
    patientId: '1',
    staffId: '1',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'scheduled',
    appointmentType: 'consultation',
    createdAt: new Date().toISOString(),
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'PMS Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Patient routes
app.get('/api/v1/pms/patients', (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  
  let filteredPatients = patients;
  
  if (search) {
    filteredPatients = patients.filter(patient => 
      patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
      patient.emiratesId.includes(search)
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedPatients,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredPatients.length,
      totalPages: Math.ceil(filteredPatients.length / limit),
      hasNext: endIndex < filteredPatients.length,
      hasPrev: page > 1
    }
  });
});

app.get('/api/v1/pms/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  res.json(patient);
});

app.post('/api/v1/pms/patients', (req, res) => {
  const { emiratesId, firstName, lastName, dateOfBirth, gender, phoneNumber, email } = req.body;
  
  // Simple validation
  if (!emiratesId || !firstName || !lastName || !dateOfBirth || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if Emirates ID already exists
  if (patients.some(p => p.emiratesId === emiratesId)) {
    return res.status(409).json({ error: 'Patient with this Emirates ID already exists' });
  }
  
  const newPatient = {
    id: (patients.length + 1).toString(),
    emiratesId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    createdAt: new Date().toISOString(),
  };
  
  patients.push(newPatient);
  
  res.status(201).json(newPatient);
});

// Appointment routes
app.get('/api/v1/pms/appointments', (req, res) => {
  const { page = 1, limit = 20, patientId, status } = req.query;
  
  let filteredAppointments = appointments;
  
  if (patientId) {
    filteredAppointments = appointments.filter(apt => apt.patientId === patientId);
  }
  
  if (status) {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
  
  // Include patient details
  const appointmentsWithPatients = paginatedAppointments.map(apt => ({
    ...apt,
    patient: patients.find(p => p.id === apt.patientId)
  }));
  
  res.json({
    data: appointmentsWithPatients,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredAppointments.length,
      totalPages: Math.ceil(filteredAppointments.length / limit),
      hasNext: endIndex < filteredAppointments.length,
      hasPrev: page > 1
    }
  });
});

app.post('/api/v1/pms/appointments', (req, res) => {
  const { patientId, staffId, startTime, endTime, appointmentType } = req.body;
  
  // Simple validation
  if (!patientId || !staffId || !startTime || !endTime || !appointmentType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if patient exists
  if (!patients.some(p => p.id === patientId)) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  const newAppointment = {
    id: (appointments.length + 1).toString(),
    patientId,
    staffId,
    startTime,
    endTime,
    appointmentType,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  
  appointments.push(newAppointment);
  
  res.status(201).json(newAppointment);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PMS Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Patients API: http://localhost:${PORT}/api/v1/pms/patients`);
  console.log(`📅 Appointments API: http://localhost:${PORT}/api/v1/pms/appointments`);
});

module.exports = app;



