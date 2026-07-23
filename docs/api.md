# CareFlow REST API Documentation

**Base URL:** `https://api.careflow.in/v1`  
**Authentication:** Bearer JWT token  
**Format:** JSON  
**Version:** 1.0.0

---

## Authentication

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "priya.sharma@careflow.in",
  "password": "Doctor@123"
}
```

**Response 200:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "name": "Dr. Priya Sharma",
    "email": "priya.sharma@careflow.in",
    "role": "doctor",
    "department": "Cardiology"
  }
}
```

**Response 401:**
```json
{ "success": false, "error": "Invalid credentials" }
```

---

## Patients

### GET /patients
List all active patient encounters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status (waiting, in_triage, etc.) |
| triage_level | string | Filter by triage level (critical, high, medium, low) |
| department | string | Filter by department |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |

**Response 200:**
```json
{
  "data": [
    {
      "encounterId": "uuid",
      "mrn": "MRN-2024-001",
      "patientName": "Rajesh Kumar",
      "age": 58,
      "gender": "Male",
      "triageLevel": "critical",
      "riskScore": 94,
      "status": "in_diagnostics",
      "department": "Cardiology",
      "assignedDoctor": "Dr. Priya Sharma",
      "admissionDate": "2024-07-20T08:15:00Z",
      "estimatedWaitMinutes": 5
    }
  ],
  "pagination": {
    "page": 1, "limit": 20, "total": 247, "pages": 13
  }
}
```

### POST /patients/register
Register a new patient.

**Request:**
```json
{
  "name": "John Doe",
  "dateOfBirth": "1985-06-15",
  "gender": "Male",
  "phone": "+91-9876543210",
  "email": "john.doe@email.com",
  "bloodGroup": "O+",
  "allergies": ["Penicillin"],
  "symptoms": ["Chest Pain", "Shortness of Breath"],
  "vitals": {
    "bloodPressureSys": 160,
    "bloodPressureDia": 100,
    "heartRate": 108,
    "temperatureCelsius": 37.8,
    "oxygenSaturation": 92,
    "respiratoryRate": 22
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "patientId": "uuid",
  "encounterId": "uuid",
  "mrn": "MRN-2024-248"
}
```

### GET /patients/:id
Get detailed patient record.

### PATCH /patients/:encounterId/status
Update patient status.

**Request:**
```json
{ "status": "with_doctor", "doctorId": "uuid" }
```

---

## AI Triage

### POST /triage/predict
Run AI triage prediction.

**Request:**
```json
{
  "encounterId": "uuid",
  "vitals": {
    "bloodPressureSys": 160,
    "bloodPressureDia": 100,
    "heartRate": 108,
    "temperatureCelsius": 37.8,
    "oxygenSaturation": 92,
    "respiratoryRate": 22
  },
  "symptoms": ["Chest Pain", "Shortness of Breath", "Dizziness"],
  "age": 58
}
```

**Response 200:**
```json
{
  "triageLevel": "critical",
  "riskScore": 94,
  "confidencePercent": 97,
  "recommendedDepartment": "Cardiology",
  "recommendedDiagnostics": ["ECG", "CT_Scan", "Blood_Test"],
  "predictedWaitMinutes": 5,
  "featureContributions": [
    { "feature": "Systolic BP", "value": "160 mmHg", "contribution": 0.88, "direction": "risk_up" },
    { "feature": "Heart Rate", "value": "108 bpm", "contribution": 0.48, "direction": "risk_up" },
    { "feature": "SpO2", "value": "92%", "contribution": 0.54, "direction": "risk_up" }
  ],
  "modelVersion": "CareFlow-Triage-v3.2",
  "generatedAt": "2024-07-20T08:15:30Z"
}
```

---

## Diagnostics

### GET /diagnostics/machines
Get machine status and utilization.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "MRI-01",
      "type": "MRI",
      "status": "operational",
      "utilizationPct": 92,
      "scheduledToday": 11,
      "nextAvailable": "2024-07-20T14:30:00Z"
    }
  ]
}
```

### POST /diagnostics/allocate
Auto-allocate diagnostic slots for a patient.

**Request:**
```json
{
  "encounterId": "uuid",
  "diagnostics": ["ECG", "CT_Scan", "Blood_Test"],
  "urgency": "critical"
}
```

**Response 201:**
```json
{
  "allocations": [
    {
      "slotId": "uuid",
      "diagnosticType": "ECG",
      "machine": "ECG-01",
      "startTime": "2024-07-20T08:25:00Z",
      "endTime": "2024-07-20T08:40:00Z"
    },
    {
      "slotId": "uuid",
      "diagnosticType": "CT_Scan",
      "machine": "CT-01",
      "startTime": "2024-07-20T08:45:00Z",
      "endTime": "2024-07-20T09:15:00Z"
    }
  ]
}
```

### GET /diagnostics/slots
Get scheduled slots with filters.

---

## Analytics

### GET /analytics/kpis
Get current KPI values.

**Response 200:**
```json
{
  "patientsToday": 247,
  "criticalPatients": 18,
  "avgWaitTimeMin": 24,
  "mriUtilizationPct": 87,
  "labUtilizationPct": 74,
  "emergencyQueueLength": 12,
  "revenueToday": 2840000,
  "predictedDelays": 5,
  "updatedAt": "2024-07-20T11:59:00Z"
}
```

### GET /analytics/inflow
Get patient inflow time series.

### GET /analytics/department-load
Get real-time department load.

---

## Notifications

### GET /notifications
Get user notifications.

**Query:** `?unread=true&category=patient&limit=20`

### PATCH /notifications/:id/read
Mark notification as read.

### POST /notifications
Create a new notification (admin/system only).

---

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Request body validation failed |
| 401 | UNAUTHORIZED | Invalid or expired token |
| 403 | FORBIDDEN | Insufficient role permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Scheduling conflict detected |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST /triage/predict | 60/min per user |
| POST /diagnostics/allocate | 30/min per user |
| GET /analytics/* | 120/min per user |
| All other endpoints | 300/min per user |

---

## Swagger UI

Available at: `https://api.careflow.in/v1/docs`

OpenAPI specification: `https://api.careflow.in/v1/openapi.json`
