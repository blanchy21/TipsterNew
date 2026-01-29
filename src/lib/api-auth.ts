/**
 * Lightweight Firebase ID token verification for API routes.
 * Validates the token's signature, expiry, audience, and issuer
 * without requiring firebase-admin (compatible with edge runtime).
 */

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tipsternew-700ed';
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCerts: Record<string, string> | null = null;
let certsCachedAt = 0;
const CERTS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getGoogleCerts(): Promise<Record<string, string>> {
  if (cachedCerts && Date.now() - certsCachedAt < CERTS_CACHE_TTL) {
    return cachedCerts;
  }
  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) throw new Error('Failed to fetch Google certs');
  cachedCerts = await res.json();
  certsCachedAt = Date.now();
  return cachedCerts!;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN CERTIFICATE-----/g, '')
    .replace(/-----END CERTIFICATE-----/g, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

interface DecodedToken {
  uid: string;
  email?: string;
  [key: string]: unknown;
}

export async function verifyFirebaseToken(req: Request): Promise<DecodedToken | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const headerJson = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));

    // Validate claims
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null; // Token expired
    if (payload.iat > now + 300) return null; // Issued in the future (with 5min tolerance)
    if (payload.aud !== FIREBASE_PROJECT_ID) return null; // Wrong audience
    if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null; // Wrong issuer
    if (!payload.sub || typeof payload.sub !== 'string') return null; // Missing subject (uid)

    // Verify signature using Google's public certs
    const certs = await getGoogleCerts();
    const cert = certs[headerJson.kid];
    if (!cert) return null; // Unknown key ID

    const certBuffer = pemToArrayBuffer(cert);
    const key = await crypto.subtle.importKey(
      'spki',
      // Extract public key from X.509 certificate
      extractSPKI(certBuffer),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = base64UrlDecode(parts[2]);
    const dataBytes = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signatureBytes.buffer as ArrayBuffer,
      dataBytes.buffer as ArrayBuffer
    );

    if (!valid) return null;

    return {
      uid: payload.sub,
      email: payload.email,
      ...payload,
    };
  } catch {
    return null;
  }
}

/**
 * Extract SubjectPublicKeyInfo from a DER-encoded X.509 certificate.
 * This parses the ASN.1 structure to find the public key.
 */
function extractSPKI(certDer: ArrayBuffer): ArrayBuffer {
  const bytes = new Uint8Array(certDer);
  // Navigate ASN.1: Certificate -> TBSCertificate -> SubjectPublicKeyInfo
  let offset = 0;

  function readTag(): { tag: number; length: number; headerSize: number } {
    const tag = bytes[offset];
    offset++;
    let length = bytes[offset];
    offset++;
    let headerSize = 2;
    if (length & 0x80) {
      const numBytes = length & 0x7f;
      length = 0;
      for (let i = 0; i < numBytes; i++) {
        length = (length << 8) | bytes[offset];
        offset++;
        headerSize++;
      }
    }
    return { tag, length, headerSize };
  }

  // Certificate SEQUENCE
  readTag();
  // TBSCertificate SEQUENCE
  const tbsStart = offset;
  readTag();

  // version [0] EXPLICIT (optional)
  if (bytes[offset] === 0xa0) {
    const v = readTag();
    offset += v.length;
  }
  // serialNumber INTEGER
  const serial = readTag();
  offset += serial.length;
  // signature AlgorithmIdentifier SEQUENCE
  const sig = readTag();
  offset += sig.length;
  // issuer SEQUENCE
  const issuer = readTag();
  offset += issuer.length;
  // validity SEQUENCE
  const validity = readTag();
  offset += validity.length;
  // subject SEQUENCE
  const subject = readTag();
  offset += subject.length;
  // subjectPublicKeyInfo SEQUENCE
  const spkiStart = offset;
  const spki = readTag();
  const spkiEnd = offset + spki.length;

  return certDer.slice(spkiStart, spkiEnd);
}
