import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header line
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 580, 752, 580)
        self.drawString(40, 585, "RxShield AI — System Data Dictionary & Database Schema Specification")
        
        # Footer line
        self.line(40, 35, 752, 35)
        self.drawString(40, 24, "Confidential — Academic Project Submission & Faculty Review Reference")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(752, 24, page_text)
        self.restoreState()

def build_pdf(filename="RxShield_AI_Data_Dictionary.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0369a1'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    th_style = ParagraphStyle(
        'TH',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#ffffff'),
        alignment=0
    )

    td_style = ParagraphStyle(
        'TD',
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1e293b')
    )

    td_code_style = ParagraphStyle(
        'TDCode',
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0369a1')
    )

    td_example_style = ParagraphStyle(
        'TDExample',
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#047857')
    )

    elements = []

    # Title & Subtitle Header
    elements.append(Paragraph("System Data Dictionary & Database Specification", title_style))
    elements.append(Paragraph("<b>Project:</b> An Intelligent AI-Powered Prescription Verification and Fraud Risk Assessment System (RxShield AI)<br/><b>Standards:</b> 21 CFR Part 11 Electronic Records, HIPAA Security Rule, DEA Controlled Substances Act", subtitle_style))
    elements.append(Spacer(1, 4))

    # Schema Overview Table
    elements.append(Paragraph("1. Schema Summary & Entity Relationship Overview", section_heading))
    
    summary_headers = ["Entity / Table Name", "Primary Key", "Foreign Key(s)", "Entity Scope & Description"]
    summary_rows = [
        ["PRESCRIPTION", "prescription_id", "patient_id, doctor_npi", "Core transaction storing OCR extractions, tamper scores, and verification status."],
        ["PATIENT", "patient_id", "None", "Patient demographics, contact info, known allergies, and 30-day dispensing history."],
        ["DOCTOR_REGISTRY", "npi_number", "None", "Practitioner credentials, California Medical Board licensing, and DEA authorizations."],
        ["MEDICINE_ITEM", "item_id", "prescription_id", "Line-item pharmaceutical orders, frequency, dosage, and daily safety thresholds."],
        ["DRUG_INTERACTION", "interaction_id", "None", "Clinical Contraindication Knowledge Base (DDI rules & lethal severity warnings)."],
        ["RISK_ASSESSMENT", "assessment_id", "prescription_id", "5-Axis multi-factor AI fraud and safety scores (License, Tamper, Clinical, DEA, History)."],
        ["OCR_BOUNDING_BOX", "box_id", "prescription_id", "Computer Vision spatial coordinates (x,y,w,h) and field recognition confidence."],
        ["AUDIT_LOG", "log_id", "prescription_id", "Immutable HIPAA and 21 CFR Part 11 security audit trail and event timestamps."],
        ["SYSTEM_USER", "user_id", "None", "Authorized staff users (Pharmacist, Compliance Lead, Physician, Admin)."]
    ]

    t_data = [[Paragraph(h, th_style) for h in summary_headers]]
    for r in summary_rows:
        t_data.append([
            Paragraph(r[0], td_code_style),
            Paragraph(r[1], td_style),
            Paragraph(r[2], td_style),
            Paragraph(r[3], td_style),
        ])

    st_table = Table(t_data, colWidths=[120, 100, 110, 382])
    st_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(st_table)
    elements.append(Spacer(1, 10))

    # Helper function to build 7-column tables
    def make_table(title, rows, col_widths=[90, 52, 35, 80, 165, 170, 120]):
        headers = ["Attribute Name", "Type", "Size", "Key / Constraints", "Description / Purpose", "Validation & Domain Rules", "Example Value"]
        table_content = [[Paragraph(h, th_style) for h in headers]]
        
        for r in rows:
            table_content.append([
                Paragraph(r[0], td_code_style),
                Paragraph(r[1], td_style),
                Paragraph(str(r[2]), td_style),
                Paragraph(r[3], td_style),
                Paragraph(r[4], td_style),
                Paragraph(r[5], td_style),
                Paragraph(r[6], td_example_style),
            ])
            
        t = Table(table_content, colWidths=col_widths, repeatRows=1)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0369a1')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ]))
        
        return [
            Paragraph(title, section_heading),
            t,
            Spacer(1, 8)
        ]

    # 1. PRESCRIPTION Table
    p_rows = [
        ["prescription_id", "VARCHAR", "32", "PK, NOT NULL", "Unique internal verification identifier", "Format: RX-XXXXX", '"RX-10291"'],
        ["rx_serial_number", "VARCHAR", "64", "UK, NOT NULL", "Formal prescription serial identifier", "Unique clinical institution code", '"RX-2026-10291"'],
        ["patient_id", "VARCHAR", "32", "FK, NOT NULL", "References PATIENT(patient_id)", "Must exist in PATIENT table", '"PT-48201"'],
        ["doctor_npi", "CHAR", "10", "FK, NOT NULL", "References DOCTOR_REGISTRY(npi_number)", "Exactly 10 numeric digits", '"1849201948"'],
        ["issue_date", "DATE", "10", "NOT NULL", "Date prescription was issued by physician", "Format: YYYY-MM-DD", '"2026-08-15"'],
        ["source_type", "ENUM", "-", "NOT NULL", "Input capture origin", "{'uploaded_file', 'camera_scan', 'sample_preset'}", "'camera_scan'"],
        ["document_url", "VARCHAR", "255", "NULL", "Storage URI of original prescription document", "Valid relative or cloud URI", '"/samples/rx_valid.jpg"'],
        ["letterhead_valid", "BOOLEAN", "1", "DEFAULT FALSE", "Presence of authentic hospital header", "TRUE / FALSE", "TRUE"],
        ["tamper_flag", "BOOLEAN", "1", "DEFAULT FALSE", "Digital/physical tampering detected", "TRUE / FALSE", "FALSE"],
        ["tamper_score", "DECIMAL", "5,2", "NOT NULL", "Computer Vision tamper probability score", "Range: 0.00 to 100.00 (%)", "2.10"],
        ["ocr_confidence", "DECIMAL", "5,2", "NOT NULL", "Aggregate OCR character recognition accuracy", "Range: 0.00 to 100.00 (%)", "97.40"],
        ["composite_score", "INTEGER", "3", "NOT NULL", "5-Axis weighted composite safety index", "Range: 0 (Fraud) to 100 (Safe)", "96"],
        ["risk_verdict", "ENUM", "-", "NOT NULL", "Final automated risk classification", "{'valid', 'incomplete', 'suspicious'}", "'valid'"],
        ["workflow_status", "ENUM", "-", "NOT NULL", "State in pharmacy dispensing workflow", "{'pending_review', 'verified_dispensed', 'flagged', 'rejected'}", "'verified_dispensed'"],
        ["sha256_hash", "CHAR", "64", "NULL", "Cryptographic audit verification digest", "64 hex characters (SHA-256)", '"a7f92e4b018d9c3325..."'],
        ["reviewed_by", "VARCHAR", "128", "NULL", "Pharmacist or auditor who executed sign-off", "Free text / User identifier", '"Dr. Sarah Chen, PharmD"'],
        ["reviewed_at", "TIMESTAMP", "19", "NULL", "Timestamp of authorization signature", "Format: YYYY-MM-DD HH:MM:SS", '"2026-08-15 14:32:00"']
    ]
    elements.extend(make_table("Table 2.1: PRESCRIPTION (Core Transaction Entity)", p_rows))

    # 2. PATIENT Table
    pt_rows = [
        ["patient_id", "VARCHAR", "32", "PK, NOT NULL", "Unique patient record identifier", "Alphanumeric string", '"PT-48201"'],
        ["full_name", "VARCHAR", "128", "NOT NULL", "Legal full name of patient", "Letters, spaces, hyphens", '"Marcus Thompson"'],
        ["age", "INTEGER", "3", "NOT NULL", "Patient age in years", "Range: 0 to 125", "34"],
        ["gender", "ENUM", "-", "NOT NULL", "Biological / administrative gender", "{'Male', 'Female', 'Other'}", "'Male'"],
        ["date_of_birth", "DATE", "10", "NOT NULL", "Patient birth date for identity verification", "Format: YYYY-MM-DD", '"1992-04-12"'],
        ["contact_phone", "VARCHAR", "20", "NOT NULL", "Primary contact telephone number", "Standard E.164 phone format", '"+1 (415) 555-4820"'],
        ["home_address", "VARCHAR", "255", "NOT NULL", "Physical residential address", "Complete street address string", '"742 Evergreen Terrace, SF"'],
        ["allergies", "TEXT", "-", "NULL", "Known pharmaceutical allergy sensitivities", "JSON Array / Comma list", '["Penicillin (Mild Rash)"]'],
        ["active_meds", "TEXT", "-", "NULL", "Active medications currently taken", "JSON Array / Comma list", '["Multivitamin Once Daily"]'],
        ["fills_last_30d", "INTEGER", "3", "DEFAULT 0", "Controlled fills in last 30 days", "Non-negative integer (>= 0)", "1"]
    ]
    elements.extend(make_table("Table 2.2: PATIENT (Patient Profile & History)", pt_rows))

    # 3. DOCTOR_REGISTRY Table
    doc_rows = [
        ["npi_number", "CHAR", "10", "PK, NOT NULL", "10-digit National Provider Identifier", "Exactly 10 numeric digits", '"1849201948"'],
        ["doctor_name", "VARCHAR", "128", "NOT NULL", "Full practitioner name with title", "Letters, dots, spaces", '"Dr. Sarah Chen, MD"'],
        ["specialty", "VARCHAR", "128", "NOT NULL", "Clinical medical board specialty", "Valid medical specialty taxonomy", '"Internal Medicine / Pediatrics"'],
        ["license_number", "VARCHAR", "32", "UK, NOT NULL", "State Medical Board licensing number", "State license standard code", '"CA-MED-4821"'],
        ["state", "VARCHAR", "64", "NOT NULL", "Jurisdiction of medical license", "Valid state name", '"California"'],
        ["license_status", "ENUM", "-", "NOT NULL", "Current legal authorization status", "{'active', 'suspended', 'expired', 'revoked'}", "'active'"],
        ["hospital_name", "VARCHAR", "255", "NOT NULL", "Affiliated hospital / clinical practice", "Registered clinical facility", '"Northridge Medical Center"'],
        ["dea_number", "VARCHAR", "16", "NULL", "Federal DEA registration for narcotics", "Format: 2 letters + 7 digits", '"BC1928374"'],
        ["dea_status", "ENUM", "-", "NOT NULL", "Authority to prescribe controlled drugs", "{'active', 'suspended', 'not_found'}", "'active'"],
        ["has_signature", "BOOLEAN", "1", "DEFAULT FALSE", "Presence of valid doctor signature", "TRUE / FALSE", "TRUE"],
        ["sig_confidence", "DECIMAL", "5,2", "NOT NULL", "Signature vector match score", "Range: 0.00 to 100.00 (%)", "98.60"]
    ]
    elements.extend(make_table("Table 2.3: DOCTOR_REGISTRY (Medical Practitioner Registry)", doc_rows))

    # 4. MEDICINE_ITEM Table
    med_rows = [
        ["item_id", "VARCHAR", "32", "PK, NOT NULL", "Unique line item order identifier", "Alphanumeric code", '"MED-10291-1"'],
        ["prescription_id", "VARCHAR", "32", "FK, NOT NULL", "References PRESCRIPTION(prescription_id)", "Must exist in PRESCRIPTION table", '"RX-10291"'],
        ["drug_name", "VARCHAR", "128", "NOT NULL", "Pharmaceutical active ingredient name", "Standard pharmacopeia name", '"Amoxicillin"'],
        ["dosage", "VARCHAR", "64", "NOT NULL", "Single unit strength", "Unit string (mg, mcg, mL)", '"500mg"'],
        ["frequency", "VARCHAR", "128", "NOT NULL", "Sig administration directions", "Standard sig abbreviations", '"Three times daily (TID)"'],
        ["duration", "VARCHAR", "64", "NOT NULL", "Duration of prescribed therapy", "Day / Week count string", '"7 Days"'],
        ["quantity", "VARCHAR", "64", "NOT NULL", "Total dispensed count", "Numerical count + unit", '"21 Capsules"'],
        ["schedule_class", "ENUM", "-", "NOT NULL", "DEA regulatory control class", "{'OTC', 'Rx', 'Schedule II', 'Schedule III', 'Schedule IV'}", "'Rx'"],
        ["daily_dose", "VARCHAR", "64", "NULL", "Prescribed cumulative daily dosage", "Numerical dosage with unit", '"1500mg"'],
        ["max_safe_dose", "VARCHAR", "64", "NULL", "FDA maximum safe daily threshold", "Numerical dosage with unit", '"3000mg"'],
        ["item_risk", "ENUM", "-", "NOT NULL", "Clinical toxicity or abuse rating", "{'none', 'low', 'moderate', 'high', 'critical'}", "'none'"]
    ]
    elements.extend(make_table("Table 2.4: MEDICINE_ITEM (Prescribed Medication Line Items)", med_rows))

    # 5. DRUG_INTERACTION Table
    ddi_rows = [
        ["interaction_id", "VARCHAR", "32", "PK, NOT NULL", "Unique interaction rule code", "Alphanumeric identifier", '"DDI-SILD-NITRO"'],
        ["drug_a", "VARCHAR", "128", "NOT NULL", "Primary interacting drug (lowercase)", "Standard generic drug name", '"sildenafil"'],
        ["drug_b", "VARCHAR", "128", "NOT NULL", "Secondary interacting drug (lowercase)", "Standard generic drug name", '"nitroglycerin"'],
        ["severity", "ENUM", "-", "NOT NULL", "Clinical danger classification", "{'mild', 'moderate', 'severe', 'lethal'}", "'lethal'"],
        ["description", "TEXT", "-", "NOT NULL", "Pathophysiological mechanism", "Clinical outcome explanation", '"Co-administration triggers catastrophic hypotension"'],
        ["recommendation", "TEXT", "-", "NOT NULL", "Mandatory pharmacist protocol", "Clear clinical action directive", '"DO NOT DISPENSE. Absolute contraindication."']
    ]
    elements.extend(make_table("Table 2.5: DRUG_INTERACTION (Clinical DDI Knowledge Base)", ddi_rows))

    # 6. RISK_ASSESSMENT Table
    rf_rows = [
        ["assessment_id", "VARCHAR", "32", "PK, NOT NULL", "Assessment factor entry identifier", "Alphanumeric identifier", '"RF-10291-LIC"'],
        ["prescription_id", "VARCHAR", "32", "FK, NOT NULL", "References PRESCRIPTION(prescription_id)", "Must exist in PRESCRIPTION table", '"RX-10291"'],
        ["pillar_category", "ENUM", "-", "NOT NULL", "Evaluated risk dimension category", "{'license', 'tamper', 'controlled_substance', 'clinical', 'patient_history'}", "'license'"],
        ["pillar_title", "VARCHAR", "128", "NOT NULL", "Human-readable pillar label", "User-facing display title", '"Doctor License & NPI"'],
        ["score", "INTEGER", "3", "NOT NULL", "Numerical score for this pillar", "Range: 0 (Critical) to 100 (Safe)", "99"],
        ["verdict", "ENUM", "-", "NOT NULL", "Evaluation outcome status", "{'pass', 'warning', 'fail'}", "'pass'"],
        ["findings", "TEXT", "-", "NOT NULL", "Granular explanation of findings", "Detailed clinical/forensic reason", '"NPI 1849201948 active with Medical Board; zero flags."']
    ]
    elements.extend(make_table("Table 2.6: RISK_ASSESSMENT (5-Axis Multi-Factor Scoring)", rf_rows))

    # 7. OCR_BOUNDING_BOX Table
    ocr_rows = [
        ["box_id", "VARCHAR", "32", "PK, NOT NULL", "Unique coordinate tag identifier", "Alphanumeric identifier", '"bb-1"'],
        ["prescription_id", "VARCHAR", "32", "FK, NOT NULL", "References PRESCRIPTION(prescription_id)", "Must exist in PRESCRIPTION table", '"RX-10291"'],
        ["field_type", "VARCHAR", "64", "NOT NULL", "Target prescription section type", "{'hospital', 'doctor', 'patient', 'medicines', 'signature'}", "'hospital'"],
        ["label", "VARCHAR", "64", "NOT NULL", "Display tag for UI rendering", "Human-readable label", '"Hospital Letterhead"'],
        ["pos_x", "DECIMAL", "5,2", "NOT NULL", "Horizontal offset from left border", "Percentage: 0.00 to 100.00 (%)", "8.00"],
        ["pos_y", "DECIMAL", "5,2", "NOT NULL", "Vertical offset from top border", "Percentage: 0.00 to 100.00 (%)", "5.00"],
        ["width", "DECIMAL", "5,2", "NOT NULL", "Width of bounding box region", "Percentage: 0.00 to 100.00 (%)", "84.00"],
        ["height", "DECIMAL", "5,2", "NOT NULL", "Height of bounding box region", "Percentage: 0.00 to 100.00 (%)", "14.00"],
        ["confidence", "DECIMAL", "5,2", "NOT NULL", "OCR text extraction confidence", "Range: 0.00 to 100.00 (%)", "99.20"],
        ["extracted_text", "TEXT", "-", "NOT NULL", "Raw text recognized within box", "UTF-8 string content", '"Northridge Medical Center"'],
        ["is_flagged", "BOOLEAN", "1", "DEFAULT FALSE", "Highlight border with red alert", "TRUE / FALSE", "FALSE"]
    ]
    elements.extend(make_table("Table 2.7: OCR_BOUNDING_BOX (Vision Spatial Coordinates)", ocr_rows))

    # 8. AUDIT_LOG Table
    log_rows = [
        ["log_id", "VARCHAR", "32", "PK, NOT NULL", "Sequential audit event identifier", "Format: LOG-XXXXX", '"LOG-1787255450"'],
        ["event_time", "TIME", "8", "NOT NULL", "Exact time event occurred", "Format: HH:MM:SS", '"14:32:01"'],
        ["actor_name", "VARCHAR", "128", "NOT NULL", "Full name of actor / AI system", "User full name or system engine", '"Dr. Sarah Chen"'],
        ["actor_role", "ENUM", "-", "NOT NULL", "Security permission role during action", "{'pharmacist', 'compliance_officer', 'doctor', 'admin', 'system'}", "'pharmacist'"],
        ["action_text", "TEXT", "-", "NOT NULL", "Description of action executed", "Detailed event log summary", '"Uploaded prescription RX-10291"'],
        ["event_type", "ENUM", "-", "NOT NULL", "Standardized event category tag", "{'upload', 'alert', 'dispense', 'flag', 'reject', 'admin', 'download'}", "'upload'"],
        ["rx_reference", "VARCHAR", "32", "FK, NULL", "References PRESCRIPTION(prescription_id)", "Must exist in PRESCRIPTION table", '"RX-10291"']
    ]
    elements.extend(make_table("Table 2.8: AUDIT_LOG (HIPAA & 21 CFR Part 11 Audit Trail)", log_rows))

    # Build PDF with Numbered Canvas
    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {filename}")

if __name__ == "__main__":
    build_pdf()
