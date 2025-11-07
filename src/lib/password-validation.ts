/* ==================================================================================
   PASSWORD VALIDATION & SECURITY - V18.3
   ==================================================================================
   - Leaked Password Protection (clientseitig)
   - Passwort-Stärke-Berechnung
   - Check gegen häufige Passwörter
   ================================================================================== */

// Top 100 häufigste Passwörter (vereinfacht)
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'welcome', 'jesus', 'ninja', 'mustang',
  'password1', '123456789', '12345', 'admin', 'test', 'user', 'root', 'toor',
  'pass', 'mypassword', 'password123', 'Passwort', 'passwort', '111111',
  'mydispatch', 'dispatch', 'mydispatch123'
];

export interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  isCommon: boolean;
}

/**
 * Prüft Passwort gegen häufige Passwörter
 */
export function isCommonPassword(password: string): boolean {
  const lower = password.toLowerCase();
  return COMMON_PASSWORDS.some(common => 
    lower === common || 
    lower.includes(common) || 
    common.includes(lower)
  );
}

/**
 * Berechnet Passwort-Stärke (0-100)
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Länge (max. 40 Punkte)
  if (password.length >= 12) {
    score += 40;
  } else if (password.length >= 10) {
    score += 30;
    feedback.push('Länger als 12 Zeichen ist besser');
  } else if (password.length >= 8) {
    score += 20;
    feedback.push('Mindestens 12 Zeichen empfohlen');
  } else {
    score += 10;
    feedback.push('Zu kurz! Mindestens 8 Zeichen erforderlich');
  }

  // Großbuchstaben (10 Punkte)
  if (/[A-Z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Füge Großbuchstaben hinzu');
  }

  // Kleinbuchstaben (10 Punkte)
  if (/[a-z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Füge Kleinbuchstaben hinzu');
  }

  // Zahlen (15 Punkte)
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('Füge Zahlen hinzu');
  }

  // Sonderzeichen (15 Punkte)
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Füge Sonderzeichen hinzu (!@#$%^&*)');
  }

  // Häufiges Passwort? (Abzug!)
  const isCommon = isCommonPassword(password);
  if (isCommon) {
    score = Math.max(0, score - 40);
    feedback.unshift('⚠️ Dieses Passwort ist zu häufig - wähle ein sichereres!');
  }

  // Wiederholungen (Abzug)
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 10);
    feedback.push('Vermeide Wiederholungen (aaa, 111)');
  }

  // Level bestimmen
  let level: PasswordStrength['level'];
  if (score >= 90) level = 'very-strong';
  else if (score >= 70) level = 'strong';
  else if (score >= 50) level = 'good';
  else if (score >= 30) level = 'fair';
  else level = 'weak';

  return {
    score: Math.min(100, score),
    level,
    feedback: feedback.slice(0, 3), // Max. 3 Tipps
    isCommon
  };
}

/**
 * Zod Custom Validator für sichere Passwörter
 */
export function validateSecurePassword(password: string): boolean {
  const strength = calculatePasswordStrength(password);
  
  // Mindestanforderungen:
  // - Score >= 50 (Fair)
  // - NICHT in häufigen Passwörtern
  return strength.score >= 50 && !strength.isCommon;
}

/**
 * Menschenlesbare Fehlermeldung
 */
export function getPasswordErrorMessage(password: string): string {
  const strength = calculatePasswordStrength(password);
  
  if (strength.isCommon) {
    return 'Dieses Passwort ist zu häufig und unsicher. Wähle ein anderes.';
  }
  
  if (password.length < 8) {
    return 'Passwort muss mindestens 8 Zeichen lang sein.';
  }
  
  if (strength.score < 50) {
    return `Passwort zu schwach. ${strength.feedback[0] || 'Verwende eine Mischung aus Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen.'}`;
  }
  
  return '';
}
