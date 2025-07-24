import { IUserInput, ILoginInput, ILoanApplicationInput } from '../types';

/**
 * Validation utility class with type-safe validation methods
 */
export class ValidationUtil {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * Validate phone number
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate user registration input
   */
  static validateUserInput(input: IUserInput): string[] {
    const errors: string[] = [];

    if (!input.name || input.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!input.email || !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    if (!input.password || !this.isValidPassword(input.password)) {
      errors.push('Password must be at least 6 characters long');
    }

    if (input.role && !['admin', 'verifier'].includes(input.role)) {
      errors.push('Role must be either admin or verifier');
    }

    return errors;
  }

  /**
   * Validate login input
   */
  static validateLoginInput(input: ILoginInput): string[] {
    const errors: string[] = [];

    if (!input.email || !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    if (!input.password) {
      errors.push('Password is required');
    }

    return errors;
  }

  /**
   * Validate loan application input
   */
  static validateLoanApplicationInput(input: ILoanApplicationInput): string[] {
    const errors: string[] = [];

    if (!input.name || input.name.trim().length < 2) {
      errors.push('Applicant name must be at least 2 characters long');
    }

    if (!input.email || !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    if (!input.phone || !this.isValidPhone(input.phone)) {
      errors.push('Valid 10-digit phone number is required');
    }

    if (!input.amount || input.amount < 1000 || input.amount > 10000000) {
      errors.push('Loan amount must be between ₹1,000 and ₹1,00,00,000');
    }

    if (!input.purpose || input.purpose.trim().length < 3) {
      errors.push('Loan purpose must be at least 3 characters long');
    }

    if (!input.tenure || input.tenure < 6 || input.tenure > 84) {
      errors.push('Loan tenure must be between 6 and 84 months');
    }

    if (!input.monthlyIncome || input.monthlyIncome < 10000) {
      errors.push('Monthly income must be at least ₹10,000');
    }

    if (!input.employmentType || input.employmentType.trim().length < 3) {
      errors.push('Employment type is required');
    }

    return errors;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}
