import { FrameworkError } from './exceptions';

/**
 * Validation utilities for verification of Lead fields and patterns.
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new FrameworkError(`Invalid email format: "${email}". Must be a valid email (e.g., user@example.com).`, 'validateEmail');
  }
  return true;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1]?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!phoneRegex.test(phone)) {
    throw new FrameworkError(`Invalid phone format: "${phone}". Must be a valid 10-digit phone number.`, 'validatePhoneNumber');
  }
  return true;
}

export function validateZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zip)) {
    throw new FrameworkError(`Invalid ZIP code: "${zip}". Must be a valid 5 or 9 digit ZIP code.`, 'validateZipCode');
  }
  return true;
}

export function validateDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new FrameworkError(`Invalid date format: "${dateStr}". Must be in YYYY-MM-DD format.`, 'validateDateFormat');
  }
  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) {
    throw new FrameworkError(`Invalid calendar date: "${dateStr}".`, 'validateDateFormat');
  }
  return true;
}

export interface Lead {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  zipCode?: string;
  [key: string]: any;
}

/**
 * Validates a lead object to ensure required fields are present and correctly formatted.
 */
export function validateLeadData(lead: Lead): void {
  if (!lead.firstName || lead.firstName.trim() === '') {
    throw new FrameworkError('First Name is a required field.', 'validateLeadData');
  }
  if (!lead.lastName || lead.lastName.trim() === '') {
    throw new FrameworkError('Last Name is a required field.', 'validateLeadData');
  }
  if (lead.email) {
    validateEmail(lead.email);
  }
  if (lead.phone) {
    validatePhoneNumber(lead.phone);
  }
  if (lead.zipCode) {
    validateZipCode(lead.zipCode);
  }
}
