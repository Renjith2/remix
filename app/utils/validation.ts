

// Validate name
export function validateName(name: string): boolean {
  return /^[A-Za-z\s]+$/.test(name) && name.length > 5; // Only letters and spaces
}

// Validate email (should end with @gmail.com)
export function validateEmail(email: string): boolean {
  return email.endsWith("@gmail.com"); // Email must end with @gmail.com
}

// Validate password
export function validatePassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
  const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
  const hasNumbers = /\d/.test(password); // At least one number
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character
  return password.length >= 10 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar; // Minimum 10 characters with required types
}
