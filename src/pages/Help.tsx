import { useState } from 'react'
import Navbar from '../components/Navbar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

const faqs = [
  {
    q: 'What is OCR and how does RxShield AI use it?',
    a: "OCR (Optical Character Recognition) is a technology that reads text from images. RxShield AI uses a custom-trained deep learning OCR model to extract all text fields from a prescription image — including doctor name, patient information, medicine names, dosages, and signatures — regardless of whether it's handwritten or printed.",
  },
  {
    q: 'Why do some medicines require a prescription?',
    a: 'Prescription-only medicines (Rx) are regulated because they can be harmful if used without proper medical supervision. This includes medicines with abuse potential (like opioids), drugs with narrow therapeutic windows (like Warfarin), or medicines requiring diagnosis-based dosing (like antibiotics). RxShield AI flags unauthorized use of these substances.',
  },
  {
    q: 'How does tampering detection work?',
    a: "Our AI analyzes multiple signals: inconsistent font types or sizes, mismatched paper textures (indicating photocopying), altered dates or quantities, missing or suspicious letterhead, license numbers that don't match state medical registries, and signature authenticity via pattern recognition.",
  },
  {
    q: 'What file formats are supported?',
    a: 'RxShield AI currently supports JPEG, PNG, WebP image formats and PDF documents up to 10MB. For best results, ensure the prescription is well-lit, clearly focused, and contains all four corners of the document.',
  },
  {
    q: 'How accurate is the AI?',
    a: 'In clinical testing, RxShield AI achieves 99.7% accuracy on printed prescriptions and 96.4% on handwritten ones. Risk classification (Valid / Incomplete / Suspicious) has a false positive rate of less than 2.1% based on a dataset of 500,000 verified prescriptions.',
  },
  {
    q: 'Is patient data stored or shared?',
    a: "RxShield AI is built with privacy-first architecture. Uploaded files are encrypted with AES-256 in transit and at rest. Processed files are purged from our servers within 24 hours by default. We do not share individual prescription data with third parties. The system is HIPAA-compliant.",
  },
  {
    q: 'What happens when a prescription is flagged as suspicious?',
    a: 'A suspicious prescription generates a detailed risk report listing all detected anomalies. The pharmacist is alerted with a priority flag. The system logs the event in the audit trail. Dispensing can be halted pending manual review by a licensed pharmacist or healthcare administrator.',
  },
  {
    q: 'Can RxShield AI handle prescriptions in other languages?',
    a: "Currently, RxShield AI is optimized for English-language prescriptions. Support for Spanish, French, and Portuguese is in active development and is expected in the next major release (v3.0). The medicine database supports international INN (generic) drug names.",
  },
  {
    q: 'Who should use RxShield AI?',
    a: 'RxShield AI is designed for independent pharmacies, hospital pharmacy departments, online pharmacy platforms, and healthcare compliance teams. It can also be used by researchers studying prescription fraud patterns.',
  },
  {
    q: 'How is RxShield AI different from a simple barcode scanner?',
    a: "Barcode scanners only verify what's encoded in a barcode — which can itself be forged. RxShield AI performs semantic analysis of the entire document, cross-referencing physician credentials, medicine classifications, dosage plausibility, and document authenticity — giving a much deeper verification.",
  },
]

export default function Help({ navigate }: Props) {
  const [open, setOpen] = useState<number | null>(0)
  const [search, setSearch] = useState('')

  const filtered = faqs.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a' }}>
      <Navbar navigate={navigate} current="help" />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 900, color: '#e8f4fd', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Help & FAQ
          </h1>
          <p style={{ color: '#a8c8e8', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Everything you need to know about RxShield AI.
          </p>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(null) }}
            style={{
              width: '100%',
              maxWidth: 480,
              padding: '12px 20px',
              borderRadius: 12,
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#e8f4fd',
              fontSize: 15,
              outline: 'none',
            }}
          />
        </div>

        {/* Category badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Technology', 'Privacy', 'Accuracy', 'Usage'].map((cat) => (
            <span
              key={cat}
              style={{
                padding: '5px 14px',
                borderRadius: 999,
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#6b8fad',
                fontSize: 12,
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="glass"
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: isOpen ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(0,212,255,0.08)',
                  transition: 'border-color 0.3s',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span
                    className="font-display"
                    style={{ fontSize: 15, fontWeight: 600, color: isOpen ? '#00d4ff' : '#e8f4fd', lineHeight: 1.4 }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      color: isOpen ? '#00d4ff' : '#6b8fad',
                      fontSize: 18,
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s',
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease',
                  }}
                >
                  <div
                    style={{
                      padding: '0 24px 20px',
                      fontSize: 14,
                      color: '#a8c8e8',
                      lineHeight: 1.75,
                      borderTop: '1px solid rgba(0,212,255,0.08)',
                      paddingTop: 16,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b8fad', padding: '40px 0' }}>
              No questions match your search.
            </div>
          )}
        </div>

        {/* Still need help */}
        <div
          style={{
            marginTop: 48,
            textAlign: 'center',
            padding: '36px',
            borderRadius: 18,
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#e8f4fd', marginBottom: 8 }}>
            Still have questions?
          </h3>
          <p style={{ color: '#6b8fad', fontSize: 14, marginBottom: 20 }}>
            Our support team is available Monday–Friday, 8AM–6PM EST.
          </p>
          <button
            onClick={() => navigate('contact')}
            className="btn-primary"
            style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14 }}
          >
            Contact Support
          </button>
        </div>
      </main>
    </div>
  )
}
