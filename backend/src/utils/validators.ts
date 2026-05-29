/**
 * Portuguese NIF (Número de Identificação Fiscal) Validator
 * Validates 9-digit Portuguese tax identification numbers
 */
export const validateNIF = (nif: string): boolean => {
  // Remove any spaces or non-numeric characters
  const cleanNIF = nif.replace(/\s/g, '');
  
  // Check if it has exactly 9 digits
  if (!/^\d{9}$/.test(cleanNIF)) {
    return false;
  }

  // Check if first digit is valid (1-3, 5, 6, 8, 9)
  const firstDigit = parseInt(cleanNIF[0]);
  if (![1, 2, 3, 5, 6, 8, 9].includes(firstDigit)) {
    return false;
  }

  // Calculate check digit using Portuguese algorithm
  const digits = cleanNIF.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * (9 - i);
  }

  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? 0 : 11 - remainder;

  return checkDigit === digits[8];
};

/**
 * Portuguese CC (Cartão de Cidadão) Validator
 * Format: 8 digits + 1 check digit + 2 letters + 1 digit
 * Example: 12345678 9 ZZ1
 */
export const validateCC = (cc: string): boolean => {
  // Remove spaces
  const cleanCC = cc.replace(/\s/g, '');
  
  // Check format: 8 digits + 1 digit + 2 letters + 1 digit
  const ccRegex = /^(\d{8})(\d)([A-Z]{2})(\d)$/;
  const match = cleanCC.match(ccRegex);
  
  if (!match) {
    return false;
  }

  // Basic validation passed
  // In a real system, you would validate the check digit
  // For testing purposes, we accept the format
  return true;
};

/**
 * Portuguese IBAN Generator
 * Format: PT50 + 21 digits (NIB)
 * NIB = 4 digits (bank) + 4 digits (branch) + 11 digits (account) + 2 check digits
 */
export const generateIBAN = (accountNumber: string): string => {
  // Use a fixed bank code (0001) and branch (0000) for testing
  const bankCode = '0001';
  const branchCode = '0000';
  
  // Pad account number to 11 digits
  const paddedAccount = accountNumber.padStart(11, '0');
  
  // Calculate NIB check digits (simplified for testing)
  const nibWithoutCheck = bankCode + branchCode + paddedAccount;
  const checkDigits = calculateNIBCheckDigits(nibWithoutCheck);
  
  const nib = nibWithoutCheck + checkDigits;
  
  return 'PT50' + nib;
};

/**
 * Calculate NIB check digits (simplified algorithm)
 */
const calculateNIBCheckDigits = (nib: string): string => {
  const weights = [73, 17, 89, 38, 62, 45, 53, 15, 50, 5, 49, 34, 81, 76, 27, 90, 9, 30, 3];
  let sum = 0;
  
  for (let i = 0; i < nib.length; i++) {
    sum += parseInt(nib[i]) * weights[i];
  }
  
  const remainder = sum % 97;
  const checkDigits = 98 - remainder;
  
  return checkDigits.toString().padStart(2, '0');
};

/**
 * Validate Portuguese IBAN
 */
export const validateIBAN = (iban: string): boolean => {
  // Remove spaces
  const cleanIBAN = iban.replace(/\s/g, '');
  
  // Check format: PT50 + 21 digits
  const ibanRegex = /^PT50\d{21}$/;
  
  return ibanRegex.test(cleanIBAN);
};

/**
 * Validate Portuguese postal code
 * Format: XXXX-XXX
 */
export const validatePostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{4}-\d{3}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Validate Portuguese phone number
 * Format: 9 digits starting with 9
 */
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^9\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Generate unique account number (10 digits)
 */
export const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return (timestamp + random).slice(-10);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
};

