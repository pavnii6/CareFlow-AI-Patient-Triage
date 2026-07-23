-- =============================================================
-- CareFlow PostgreSQL Database Schema v1.0
-- Apollo Hospitals Enterprise Edition
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS & AUTH ─────────────────────────────────────────────

CREATE TABLE roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('hospital_director', 'Full access to all modules including executive dashboard'),
  ('doctor',            'Clinical access: patients, triage, diagnostics'),
  ('triage_nurse',      'Patient registration, AI triage, queue management'),
  ('lab_technician',    'Diagnostic scheduling, machine management, results'),
  ('administrator',     'System administration, reports, user management');

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id      INTEGER REFERENCES roles(id),
  department   VARCHAR(100),
  avatar_initials VARCHAR(5),
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  last_login   TIMESTAMPTZ
);

CREATE TABLE user_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash   VARCHAR(255) NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PATIENTS ─────────────────────────────────────────────────

CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mrn             VARCHAR(30) NOT NULL UNIQUE,  -- Medical Record Number
  name            VARCHAR(200) NOT NULL,
  date_of_birth   DATE NOT NULL,
  gender          VARCHAR(10) CHECK (gender IN ('Male','Female','Other')),
  phone           VARCHAR(20),
  email           VARCHAR(255),
  address         TEXT,
  blood_group     VARCHAR(5),
  allergies       TEXT[],  -- Array of allergy strings
  insurance_id    VARCHAR(50),
  emergency_contact_name  VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patient_encounters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID REFERENCES patients(id),
  encounter_type  VARCHAR(50) DEFAULT 'emergency',  -- emergency, outpatient, inpatient
  admission_date  TIMESTAMPTZ NOT NULL,
  discharge_date  TIMESTAMPTZ,
  status          VARCHAR(30) CHECK (status IN ('waiting','in_triage','in_diagnostics','with_doctor','admitted','discharged','transferred')),
  department      VARCHAR(100),
  assigned_doctor_id UUID REFERENCES users(id),
  notes           TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patient_vitals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id        UUID REFERENCES patient_encounters(id),
  recorded_at         TIMESTAMPTZ DEFAULT NOW(),
  recorded_by         UUID REFERENCES users(id),
  blood_pressure_sys  SMALLINT,
  blood_pressure_dia  SMALLINT,
  heart_rate          SMALLINT,
  temperature_celsius DECIMAL(4,1),
  oxygen_saturation   SMALLINT,
  respiratory_rate    SMALLINT,
  weight_kg           DECIMAL(5,1),
  height_cm           DECIMAL(5,1),
  pain_score          SMALLINT CHECK (pain_score BETWEEN 0 AND 10)
);

CREATE TABLE patient_symptoms (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id UUID REFERENCES patient_encounters(id),
  symptom      VARCHAR(200) NOT NULL,
  severity     VARCHAR(20) CHECK (severity IN ('mild','moderate','severe')),
  onset        VARCHAR(50),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AI TRIAGE ─────────────────────────────────────────────────

CREATE TABLE triage_predictions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id          UUID REFERENCES patient_encounters(id),
  triage_level          VARCHAR(10) CHECK (triage_level IN ('critical','high','medium','low')),
  risk_score            SMALLINT CHECK (risk_score BETWEEN 0 AND 100),
  confidence_percent    SMALLINT,
  recommended_dept      VARCHAR(100),
  predicted_wait_min    SMALLINT,
  model_version         VARCHAR(50),
  feature_contributions JSONB,   -- Explainability data
  nurse_override        BOOLEAN DEFAULT FALSE,
  override_reason       TEXT,
  overridden_by         UUID REFERENCES users(id),
  generated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recommended_diagnostics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id   UUID REFERENCES triage_predictions(id),
  diagnostic_type VARCHAR(50),
  priority        SMALLINT DEFAULT 1,
  scheduled       BOOLEAN DEFAULT FALSE
);

-- ─── DIAGNOSTICS & MACHINES ────────────────────────────────────

CREATE TABLE diagnostic_machines (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100) NOT NULL,
  type           VARCHAR(50) NOT NULL,  -- MRI, CT_Scan, X_Ray, etc.
  department     VARCHAR(100),
  status         VARCHAR(20) CHECK (status IN ('operational','maintenance','offline')),
  location       VARCHAR(200),
  maintenance_due DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE diagnostic_slots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id     UUID REFERENCES diagnostic_machines(id),
  encounter_id   UUID REFERENCES patient_encounters(id),
  diagnostic_type VARCHAR(50) NOT NULL,
  start_time     TIMESTAMPTZ NOT NULL,
  end_time       TIMESTAMPTZ NOT NULL,
  status         VARCHAR(20) CHECK (status IN ('available','scheduled','in_progress','completed','cancelled')),
  technician_id  UUID REFERENCES users(id),
  result_notes   TEXT,
  report_url     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    machine_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  )
);

CREATE TABLE diagnostic_results (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id      UUID REFERENCES diagnostic_slots(id),
  result_type  VARCHAR(50),
  result_data  JSONB,
  normal_range VARCHAR(100),
  is_abnormal  BOOLEAN,
  severity     VARCHAR(20),
  reviewed_by  UUID REFERENCES users(id),
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DEPARTMENTS ──────────────────────────────────────────────

CREATE TABLE departments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL UNIQUE,
  capacity     SMALLINT,
  head_doctor_id UUID REFERENCES users(id),
  floor        VARCHAR(20),
  is_active    BOOLEAN DEFAULT TRUE
);

-- ─── PMO ──────────────────────────────────────────────────────

CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  status       VARCHAR(30),
  start_date   DATE,
  end_date     DATE,
  sponsor_id   UUID REFERENCES users(id),
  pm_id        UUID REFERENCES users(id),
  budget_inr   DECIMAL(15,2),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sprints (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id),
  name         VARCHAR(100) NOT NULL,
  start_date   DATE,
  end_date     DATE,
  goal         TEXT,
  capacity_pts SMALLINT,
  status       VARCHAR(20) CHECK (status IN ('planning','active','review','done')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id),
  sprint_id    UUID REFERENCES sprints(id),
  title        VARCHAR(500) NOT NULL,
  description  TEXT,
  assignee_id  UUID REFERENCES users(id),
  status       VARCHAR(20) CHECK (status IN ('todo','in_progress','blocked','done','cancelled')),
  priority     VARCHAR(10) CHECK (priority IN ('critical','high','medium','low')),
  story_points SMALLINT,
  due_date     DATE,
  tags         TEXT[],
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE task_dependencies (
  task_id      UUID REFERENCES tasks(id),
  depends_on   UUID REFERENCES tasks(id),
  PRIMARY KEY (task_id, depends_on)
);

CREATE TABLE risks (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID REFERENCES projects(id),
  title             VARCHAR(500) NOT NULL,
  description       TEXT,
  category          VARCHAR(50),
  probability       SMALLINT CHECK (probability BETWEEN 1 AND 5),
  impact            SMALLINT CHECK (impact BETWEEN 1 AND 5),
  score             SMALLINT GENERATED ALWAYS AS (probability * impact) STORED,
  owner_id          UUID REFERENCES users(id),
  mitigation        TEXT,
  contingency       TEXT,
  status            VARCHAR(20) CHECK (status IN ('open','mitigated','accepted','closed','escalated')),
  date_identified   DATE,
  review_date       DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BA WORKSPACE ─────────────────────────────────────────────

CREATE TABLE requirements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id),
  req_id       VARCHAR(20) NOT NULL UNIQUE,  -- e.g. FR-001
  title        VARCHAR(500) NOT NULL,
  type         VARCHAR(20) CHECK (type IN ('functional','non_functional','business','technical')),
  description  TEXT,
  priority     VARCHAR(10),
  source       VARCHAR(200),
  status       VARCHAR(20) CHECK (status IN ('draft','approved','implemented','tested','closed')),
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_stories (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id            UUID REFERENCES projects(id),
  story_id              VARCHAR(20) NOT NULL UNIQUE,
  as_a                  VARCHAR(200),
  i_want                TEXT,
  so_that               TEXT,
  acceptance_criteria   TEXT[],
  priority              VARCHAR(10),
  story_points          SMALLINT,
  status                VARCHAR(20),
  module                VARCHAR(100),
  sprint_id             UUID REFERENCES sprints(id),
  linked_requirement_id UUID REFERENCES requirements(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stakeholders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID REFERENCES projects(id),
  name              VARCHAR(200) NOT NULL,
  role              VARCHAR(200),
  organization      VARCHAR(200),
  influence         VARCHAR(10) CHECK (influence IN ('high','medium','low')),
  interest          VARCHAR(10) CHECK (interest IN ('high','medium','low')),
  category          VARCHAR(20),
  engagement_level  VARCHAR(20),
  contact_frequency VARCHAR(50),
  notes             TEXT
);

-- ─── NOTIFICATIONS ─────────────────────────────────────────────

CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id),
  type         VARCHAR(20) CHECK (type IN ('critical','warning','info','success')),
  title        VARCHAR(500) NOT NULL,
  message      TEXT NOT NULL,
  category     VARCHAR(20),
  action_url   TEXT,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT LOG ─────────────────────────────────────────────────

CREATE TABLE audit_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id),
  action       VARCHAR(100) NOT NULL,
  entity_type  VARCHAR(50),
  entity_id    UUID,
  old_values   JSONB,
  new_values   JSONB,
  ip_address   INET,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────

CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_encounters_patient ON patient_encounters(patient_id);
CREATE INDEX idx_encounters_status ON patient_encounters(status);
CREATE INDEX idx_vitals_encounter ON patient_vitals(encounter_id);
CREATE INDEX idx_triage_encounter ON triage_predictions(encounter_id);
CREATE INDEX idx_slots_machine ON diagnostic_slots(machine_id);
CREATE INDEX idx_slots_start ON diagnostic_slots(start_time);
CREATE INDEX idx_slots_encounter ON diagnostic_slots(encounter_id);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);

-- ─── VIEWS ────────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_patient_dashboard AS
SELECT
  pe.id AS encounter_id,
  p.mrn,
  p.name AS patient_name,
  EXTRACT(YEAR FROM AGE(p.date_of_birth))::INT AS age,
  p.gender,
  pe.status,
  pe.department,
  tp.triage_level,
  tp.risk_score,
  tp.confidence_percent,
  pv.blood_pressure_sys || '/' || pv.blood_pressure_dia AS blood_pressure,
  pv.heart_rate,
  pv.temperature_celsius,
  pv.oxygen_saturation,
  pe.admission_date,
  u.name AS assigned_doctor
FROM patient_encounters pe
JOIN patients p ON pe.patient_id = p.id
LEFT JOIN triage_predictions tp ON tp.encounter_id = pe.id
LEFT JOIN patient_vitals pv ON pv.encounter_id = pe.id
LEFT JOIN users u ON u.id = pe.assigned_doctor_id
WHERE pe.discharge_date IS NULL
ORDER BY tp.risk_score DESC NULLS LAST;

CREATE OR REPLACE VIEW v_machine_utilization AS
SELECT
  dm.name,
  dm.type,
  dm.status,
  COUNT(ds.id) FILTER (WHERE ds.start_time::date = CURRENT_DATE) AS scheduled_today,
  COUNT(ds.id) FILTER (WHERE ds.status = 'completed' AND ds.start_time::date = CURRENT_DATE) AS completed_today,
  ROUND(
    100.0 * COUNT(ds.id) FILTER (WHERE ds.status IN ('scheduled','in_progress','completed') AND ds.start_time::date = CURRENT_DATE)
    / NULLIF(16, 0),  -- 16 slots per day assumption
    1
  ) AS utilization_pct
FROM diagnostic_machines dm
LEFT JOIN diagnostic_slots ds ON ds.machine_id = dm.id
GROUP BY dm.id, dm.name, dm.type, dm.status;

-- ─── SAMPLE DATA ──────────────────────────────────────────────

INSERT INTO departments (name, capacity) VALUES
  ('Emergency', 20),
  ('Cardiology', 20),
  ('Neurology', 18),
  ('Orthopaedics', 15),
  ('General Medicine', 30),
  ('Gastroenterology', 12),
  ('Gynaecology', 14),
  ('Pediatrics', 16),
  ('Pulmonology', 14),
  ('Infectious Disease', 12),
  ('Rheumatology', 10),
  ('Endocrinology', 10);

INSERT INTO diagnostic_machines (name, type, department, status) VALUES
  ('MRI-01', 'MRI', 'Radiology', 'operational'),
  ('MRI-02', 'MRI', 'Radiology', 'operational'),
  ('CT-01', 'CT_Scan', 'Radiology', 'operational'),
  ('CT-02', 'CT_Scan', 'Radiology', 'operational'),
  ('XRAY-01', 'X_Ray', 'Radiology', 'operational'),
  ('XRAY-02', 'X_Ray', 'Radiology', 'operational'),
  ('USG-01', 'Ultrasound', 'Radiology', 'operational'),
  ('LAB-AUTO', 'Blood_Test', 'Laboratory', 'operational');
