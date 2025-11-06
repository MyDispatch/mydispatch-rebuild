/* ==================================================================================
   VALIDATION-UTILS - Zentrale Validierungs-Funktionen
   ==================================================================================
   - Alle RegEx-Patterns zentral verwaltet
   - Passwort-Validierung
   - Telefon, PLZ, Email-Validierung
   - Type Guards
   ================================================================================== */

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ============================================================================
// PHONE VALIDATION (Deutsche Nummern)
// ============================================================================

export const PHONE_REGEX = /^(\+49|0)[1-9]\d{1,14}$/;

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return PHONE_REGEX.test(cleaned);
}

// ============================================================================
// PLZ VALIDATION (Deutsche Postleitzahlen)
// ============================================================================

export const PLZ_REGEX = /^\d{5}$/;

export function isValidPLZ(plz: string): boolean {
  return PLZ_REGEX.test(plz.trim());
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
} as const;

export interface PasswordStrength {
  score: number; // 0-100
  isValid: boolean;
  feedback: string[];
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    notCommon: boolean;
  };
}

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'password123', '111111', '123123', 'admin', 'letmein',
];

export function validatePassword(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasUppercase: PASSWORD_PATTERNS.uppercase.test(password),
    hasLowercase: PASSWORD_PATTERNS.lowercase.test(password),
    hasNumber: PASSWORD_PATTERNS.number.test(password),
    hasSpecial: PASSWORD_PATTERNS.special.test(password),
    notCommon: !COMMON_PASSWORDS.includes(password.toLowerCase()),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const score = (passedChecks / 6) * 100;
  const isValid = Object.values(checks).every(Boolean);

  const feedback: string[] = [];
  if (!checks.minLength) feedback.push('Mindestens 8 Zeichen erforderlich');
  if (!checks.hasUppercase || !checks.hasLowercase) feedback.push('Groß- und Kleinbuchstaben verwenden');
  if (!checks.hasNumber) feedback.push('Mindestens eine Zahl hinzufügen');
  if (!checks.hasSpecial) feedback.push('Mindestens ein Sonderzeichen verwenden');
  if (!checks.notCommon) feedback.push('Zu häufiges Passwort - bitte ein sichereres wählen');

  return { score, isValid, feedback, checks };
}

// ============================================================================
// NUMERIC VALIDATION
// ============================================================================

export function isPositiveNumber(value: unknown): boolean {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

export function isValidPercentage(value: unknown): boolean {
  return typeof value === 'number' && value >= 0 && value <= 100 && !isNaN(value);
}

export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// ============================================================================
// STRING VALIDATION
// ============================================================================

export function isNotEmpty(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// ============================================================================
// URL VALIDATION
// ============================================================================

export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return URL_REGEX.test(url);
  } catch {
    return false;
  }
}

// ============================================================================
// LICENSE PLATE VALIDATION (Deutsche KFZ-Kennzeichen)
// ============================================================================

export const LICENSE_PLATE_REGEX = /^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s?\d{1,4}[HE]?$/i;

export function isValidLicensePlate(plate: string): boolean {
  return LICENSE_PLATE_REGEX.test(plate.trim().toUpperCase());
}

// ============================================================================
// TAX ID VALIDATION (Deutsche Steuernummer)
// ============================================================================

export const TAX_ID_REGEX = /^\d{10,11}$/;

export function isValidTaxID(taxId: string): boolean {
  const cleaned = taxId.replace(/[\s\-/]/g, '');
  return TAX_ID_REGEX.test(cleaned);
}

// ============================================================================
// IBAN VALIDATION (Basic - nur Format)
// ============================================================================

export const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

export function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return IBAN_REGEX.test(cleaned) && cleaned.length >= 15 && cleaned.length <= 34;
}
