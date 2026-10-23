# Project Data Dictionary

**Project Title:** An Intelligent AI-Powered Prescription Verification and Fraud Risk Assessment System (RxShield AI)  
**System Type:** Healthcare Decision Support System / AI-Powered Fraud Detection Platform  
**Document Purpose:** System Data Modeling, Database Schema Specification, and Faculty Evaluation Reference  

---

## 1. Schema Summary & Relationship Matrix

| Table / Entity Name | Primary Key | Foreign Key(s) | Record Description |
| :--- | :--- | :--- | :--- |
| **`PRESCRIPTION`** | `prescription_id` | `patient_id`, `npi_number` | Core transaction order storing OCR outputs and fraud scores |
| **`PATIENT`** | `patient_id` | None | Patient demographics, known drug allergies, and fill history |
| **`DOCTOR_REGISTRY`** | `npi_number` | None | Medical practitioner credentials and DEA licensing records |
| **`MEDICINE_ITEM`** | `item_id` | `prescription_id` | Individual pharmaceutical line items within a prescription |
| **`DRUG_INTERACTION`**| `interaction_id`| None | Clinical Contraindication Knowledge Base (DDI Rules) |
| **`RISK_ASSESSMENT`** | `assessment_id` | `prescription_id` | 5-Axis multi-factor AI fraud and safety breakdown scores |
| **`OCR_BOUNDING_BOX`**| `box_id` | `prescription_id` | Computer Vision spatial coordinates and OCR confidence scores |
| **`AUDIT_LOG`** | `log_id` | `prescription_id`, `user_id` | Immutable security audit trail and 21 CFR Part 11 event logs |
| **`SYSTEM_USER`** | `user_id` | None | Role-Based Access Control (Pharmacist, Compliance, Doctor, Admin) |

---

## 2. Tabular Data Dictionary Tables

### Table 2.1: `PRESCRIPTION` (Core Transaction Entity)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `prescription_id` | VARCHAR | 32 | **PK**, NOT NULL | Unique internal verification identifier | Alphanumeric, Format: `RX-XXXXX` | `"RX-10291"` |
| `rx_serial_number`| VARCHAR | 64 | **UK**, NOT NULL | Formal clinical prescription serial number | Institutionally generated unique string | `"RX-2026-10291"` |
| `patient_id` | VARCHAR | 32 | **FK**, NOT NULL | References `PATIENT(patient_id)` | Must exist in PATIENT table | `"PT-48201"` |
| `doctor_npi` | CHAR | 10 | **FK**, NOT NULL | References `DOCTOR_REGISTRY(npi_number)` | Exactly 10 digits | `"1849201948"` |
| `issue_date` | DATE | 10 | NOT NULL | Date when prescription was issued | ISO Format: `YYYY-MM-DD` | `"2026-08-15"` |
| `source_type` | ENUM | - | NOT NULL | Input capture channel | `{'uploaded_file', 'camera_scan', 'sample_preset'}` | `'camera_scan'` |
| `document_url` | VARCHAR | 255 | NULL | Storage URI of original prescription document | Valid relative or absolute URI | `"/samples/sample_rx_valid.jpg"` |
| `letterhead_valid`| BOOLEAN | 1 | DEFAULT `FALSE` | Flag indicating authentic hospital letterhead | `TRUE` or `FALSE` | `TRUE` |
| `tamper_flag` | BOOLEAN | 1 | DEFAULT `FALSE` | Flag indicating digital/physical tampering | `TRUE` or `FALSE` | `FALSE` |
| `tamper_score` | DECIMAL | 5,2 | NOT NULL | Computer Vision tamper probability | Range: `0.00` to `100.00` (%) | `2.10` |
| `ocr_confidence` | DECIMAL | 5,2 | NOT NULL | Aggregate text extraction confidence | Range: `0.00` to `100.00` (%) | `97.40` |
| `composite_score` | INTEGER | 3 | NOT NULL | 5-Axis weighted safety index | Range: `0` (Fraud) to `100` (Safe) | `96` |
| `risk_verdict` | ENUM | - | NOT NULL | Final automated risk classification | `{'valid', 'incomplete', 'suspicious'}` | `'valid'` |
| `workflow_status`| ENUM | - | NOT NULL | Current state in dispensing workflow | `{'pending_review', 'verified_dispensed', 'flagged_investigation', 'rejected'}` | `'verified_dispensed'` |
| `sha256_hash` | CHAR | 64 | NULL | Cryptographic audit digest hash | Hexadecimal string of 64 characters | `"a7f92e4b018d9c3325c8141209b2e772418e9a65f903721dbd4b295b9c02d184"` |
| `reviewed_by` | VARCHAR | 128 | NULL | Name/Role of signing pharmacist | Free text or user reference | `"Dr. Sarah Chen, PharmD"` |
| `reviewed_at` | TIMESTAMP | 19 | NULL | Date & time of authorization stamp | Format: `YYYY-MM-DD HH:MM:SS` | `"2026-08-15 14:32:00"` |

---

### Table 2.2: `PATIENT` (Patient Profile & Medication History)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `patient_id` | VARCHAR | 32 | **PK**, NOT NULL | Unique patient record identifier | Alphanumeric string | `"PT-48201"` |
| `full_name` | VARCHAR | 128 | NOT NULL | Legal name of the patient | Letters, spaces, hyphens | `"Marcus Thompson"` |
| `age` | INTEGER | 3 | NOT NULL | Patient age in years | Range: `0` to `125` | `34` |
| `gender` | ENUM | - | NOT NULL | Patient biological/administrative gender | `{'Male', 'Female', 'Other'}` | `'Male'` |
| `date_of_birth` | DATE | 10 | NOT NULL | Patient date of birth | Format: `YYYY-MM-DD`, cannot be future | `"1992-04-12"` |
| `contact_phone` | VARCHAR | 20 | NOT NULL | Primary contact phone number | Standard phone number format | `"+1 (415) 555-4820"` |
| `home_address` | VARCHAR | 255 | NOT NULL | Residential address | Complete street address | `"742 Evergreen Terrace, San Francisco, CA"` |
| `allergies` | TEXT | - | NULL | Known pharmaceutical allergy sensitivities | JSON Array / Comma-separated list | `["Penicillin (Mild Rash)"]` |
| `active_meds` | TEXT | - | NULL | Active medications currently taken | JSON Array / Comma-separated list | `["Multivitamin Once Daily"]` |
| `fills_last_30d` | INTEGER | 3 | DEFAULT `0` | Controlled medication fills in last 30 days | Non-negative integer ($\ge 0$) | `1` |

---

### Table 2.3: `DOCTOR_REGISTRY` (Medical Practitioner & Licensing)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `npi_number` | CHAR | 10 | **PK**, NOT NULL | National Provider Identifier code | 10 numeric digits | `"1849201948"` |
| `doctor_name` | VARCHAR | 128 | NOT NULL | Full practitioner name with credentials | Letters, dots, spaces | `"Dr. Sarah Chen, MD"` |
| `specialty` | VARCHAR | 128 | NOT NULL | Clinical medical specialty | Valid medical specialty taxonomy | `"Internal Medicine / Pediatrics"` |
| `license_number`| VARCHAR | 32 | **UK**, NOT NULL | State Medical Board registration license | State alphanumeric license standard | `"CA-MED-4821"` |
| `state` | VARCHAR | 64 | NOT NULL | Jurisdiction of medical license | Valid state name | `"California"` |
| `license_status`| ENUM | - | NOT NULL | Current authorization status | `{'active', 'suspended', 'expired', 'revoked', 'unverified'}` | `'active'` |
| `hospital_name` | VARCHAR | 255 | NOT NULL | Affiliated hospital / clinical practice | Registered medical facility name | `"Northridge Medical Center, San Francisco"` |
| `dea_number` | VARCHAR | 16 | NULL | DEA registration number for narcotics | Format: 2 letters + 7 digits | `"BC1928374"` |
| `dea_status` | ENUM | - | NOT NULL | Authorization to prescribe controlled drugs | `{'active', 'suspended', 'not_found'}` | `'active'` |
| `has_signature` | BOOLEAN | 1 | DEFAULT `FALSE` | Presence of prescriber signature | `TRUE` or `FALSE` | `TRUE` |
| `sig_confidence`| DECIMAL | 5,2 | NOT NULL | Signature match confidence score | Range: `0.00` to `100.00` (%) | `98.60` |

---

### Table 2.4: `MEDICINE_ITEM` (Prescribed Medication Line Items)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `item_id` | VARCHAR | 32 | **PK**, NOT NULL | Unique line item identifier | Alphanumeric code | `"MED-10291-1"` |
| `prescription_id`| VARCHAR | 32 | **FK**, NOT NULL | References `PRESCRIPTION(prescription_id)`| Must exist in PRESCRIPTION table | `"RX-10291"` |
| `drug_name` | VARCHAR | 128 | NOT NULL | Pharmaceutical active ingredient name | Standard clinical pharmacopeia name | `"Amoxicillin"` |
| `dosage` | VARCHAR | 64 | NOT NULL | Single dosage amount | Unit string (e.g. mg, mcg, mL) | `"500mg"` |
| `frequency` | VARCHAR | 128 | NOT NULL | Sig / Directions for patient use | Standard medical sig abbreviations | `"Three times daily (TID)"` |
| `duration` | VARCHAR | 64 | NOT NULL | Duration of treatment therapy | Day / Week count string | `"7 Days"` |
| `quantity` | VARCHAR | 64 | NOT NULL | Dispense quantity count | Numerical quantity + unit | `"21 Capsules"` |
| `schedule_class`| ENUM | - | NOT NULL | DEA controlled substance schedule | `{'OTC', 'Rx', 'Schedule II', 'Schedule III', 'Schedule IV'}` | `'Rx'` |
| `daily_dose` | VARCHAR | 64 | NULL | Prescribed cumulative daily dosage | Numerical dosage with unit | `"1500mg"` |
| `max_safe_dose` | VARCHAR | 64 | NULL | FDA maximum recommended daily threshold | Numerical dosage with unit | `"3000mg"` |
| `item_risk` | ENUM | - | NOT NULL | Toxicity / overdose / dependence risk | `{'none', 'low', 'moderate', 'high', 'critical'}` | `'none'` |

---

### Table 2.5: `DRUG_INTERACTION` (Clinical DDI Knowledge Base)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `interaction_id`| VARCHAR | 32 | **PK**, NOT NULL | Unique interaction rule code | Alphanumeric identifier | `"DDI-SILD-NITRO"` |
| `drug_a` | VARCHAR | 128 | NOT NULL | Primary interacting medication (lowercase) | Standard generic drug name | `"sildenafil"` |
| `drug_b` | VARCHAR | 128 | NOT NULL | Secondary interacting medication (lowercase) | Standard generic drug name | `"nitroglycerin"` |
| `severity` | ENUM | - | NOT NULL | Clinical danger classification | `{'mild', 'moderate', 'severe', 'lethal'}` | `'lethal'` |
| `description` | TEXT | - | NOT NULL | Pathophysiological mechanism of interaction | Complete clinical explanation | `"Co-administration can cause catastrophic, life-threatening hypotension."` |
| `recommendation`| TEXT | - | NOT NULL | Required pharmacist clinical action | Clear mandatory clinical guideline | `"DO NOT DISPENSE. Absolute contraindication. Contact prescriber."` |

---

### Table 2.6: `RISK_ASSESSMENT` (5-Axis Multi-Factor Scoring)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `assessment_id` | VARCHAR | 32 | **PK**, NOT NULL | Assessment entry identifier | Alphanumeric identifier | `"RF-10291-LIC"` |
| `prescription_id`| VARCHAR | 32 | **FK**, NOT NULL | References `PRESCRIPTION(prescription_id)`| Must exist in PRESCRIPTION table | `"RX-10291"` |
| `pillar_category`| ENUM | - | NOT NULL | Evaluated risk dimension category | `{'license', 'tamper', 'controlled_substance', 'clinical', 'patient_history'}` | `'license'` |
| `pillar_title` | VARCHAR | 128 | NOT NULL | Human-readable factor label | User-facing display title | `"Doctor License & NPI"` |
| `score` | INTEGER | 3 | NOT NULL | Numerical score for this pillar | Range: `0` (Critical Risk) to `100` (Optimal Safety) | `99` |
| `verdict` | ENUM | - | NOT NULL | Evaluation outcome status | `{'pass', 'warning', 'fail'}` | `'pass'` |
| `findings` | TEXT | - | NOT NULL | Granular explanation of the result | Detailed clinical/forensic justification | `"NPI 1849201948 is active with California Medical Board; zero flags."` |

---

### Table 2.7: `OCR_BOUNDING_BOX` (Vision Spatial Coordinates)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `box_id` | VARCHAR | 32 | **PK**, NOT NULL | Unique coordinate tag identifier | Alphanumeric identifier | `"bb-1"` |
| `prescription_id`| VARCHAR | 32 | **FK**, NOT NULL | References `PRESCRIPTION(prescription_id)`| Must exist in PRESCRIPTION table | `"RX-10291"` |
| `field_type` | VARCHAR | 64 | NOT NULL | Target prescription section type | `{'hospital', 'doctor', 'patient', 'medicines', 'signature'}` | `'hospital'` |
| `label` | VARCHAR | 64 | NOT NULL | Display tag for UI rendering | Human-readable label | `"Hospital Letterhead"` |
| `pos_x` | DECIMAL | 5,2 | NOT NULL | Horizontal offset from left border | Percentage: `0.00` to `100.00` (%) | `8.00` |
| `pos_y` | DECIMAL | 5,2 | NOT NULL | Vertical offset from top border | Percentage: `0.00` to `100.00` (%) | `5.00` |
| `width` | DECIMAL | 5,2 | NOT NULL | Width of bounding box region | Percentage: `0.00` to `100.00` (%) | `84.00` |
| `height` | DECIMAL | 5,2 | NOT NULL | Height of bounding box region | Percentage: `0.00` to `100.00` (%) | `14.00` |
| `confidence` | DECIMAL | 5,2 | NOT NULL | OCR text extraction confidence | Range: `0.00` to `100.00` (%) | `99.20` |
| `extracted_text`| TEXT | - | NOT NULL | Raw text recognized within box region | UTF-8 string content | `"Northridge Medical Center"` |
| `is_flagged` | BOOLEAN | 1 | DEFAULT `FALSE` | Highlight border with red risk indicator | `TRUE` or `FALSE` | `FALSE` |

---

### Table 2.8: `AUDIT_LOG` (HIPAA & 21 CFR Part 11 Audit Trail)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `log_id` | VARCHAR | 32 | **PK**, NOT NULL | Sequential audit event identifier | Alphanumeric format: `LOG-XXXXX` | `"LOG-1787255450"` |
| `event_time` | TIME | 8 | NOT NULL | Exact time event occurred | Format: `HH:MM:SS` | `"14:32:01"` |
| `actor_name` | VARCHAR | 128 | NOT NULL | Full name of actor / AI system | User full name or system engine | `"Dr. Sarah Chen"` |
| `actor_role` | ENUM | - | NOT NULL | Security permission role during action | `{'pharmacist', 'compliance_officer', 'doctor', 'admin', 'system'}` | `'pharmacist'` |
| `action_text` | TEXT | - | NOT NULL | Description of action executed | Detailed event log summary | `"Uploaded prescription RX-10291"` |
| `event_type` | ENUM | - | NOT NULL | Standardized event category tag | `{'upload', 'alert', 'dispense', 'flag', 'reject', 'admin', 'download'}` | `'upload'` |
| `rx_reference` | VARCHAR | 32 | **FK**, NULL | References `PRESCRIPTION(prescription_id)`| Must exist in PRESCRIPTION table if present | `"RX-10291"` |

---

### Table 2.9: `SYSTEM_USER` (Role-Based Access Control)

| Attribute Name | Data Type | Size | Key / Constraints | Description / Purpose | Validation & Domain Rules | Example Value |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `user_id` | VARCHAR | 32 | **PK**, NOT NULL | Unique staff user identifier | Alphanumeric format: `U-XXX` | `"U-001"` |
| `user_name` | VARCHAR | 128 | NOT NULL | Full legal user name | Letters, spaces, titles | `"Dr. Sarah Chen"` |
| `email` | VARCHAR | 128 | **UK**, NOT NULL | Institutional email address for login | Valid RFC 5322 email string | `"s.chen@northridge.med"` |
| `role` | ENUM | - | NOT NULL | User authorization privilege tier | `{'Pharmacist', 'Compliance Lead', 'Physician', 'Admin'}` | `'Pharmacist'` |
| `last_active` | DATE | 10 | NOT NULL | Most recent system login date | Format: `YYYY-MM-DD` | `"2026-08-16"` |
| `account_status`| ENUM | - | NOT NULL | Account active authorization status | `{'active', 'inactive', 'locked'}` | `'active'` |
