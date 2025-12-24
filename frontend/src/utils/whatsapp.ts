/**
 * Utility functions for WhatsApp integration
 */

export interface WhatsAppMessageData {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  [key: string]: string | undefined;
}

/**
 * Format form data into a WhatsApp message
 */
export function formatWhatsAppMessage(data: WhatsAppMessageData, formType: string): string {
  const parts: string[] = [];
  
  // Add greeting based on form type
  switch (formType) {
    case 'contact':
      parts.push('Hello! I would like to contact you.');
      break;
    case 'claim':
      parts.push('Hello! I would like to make a claim.');
      break;
    case 'testimonial':
      parts.push('Hello! I would like to submit a testimonial.');
      break;
    case 'sell_car':
      parts.push('Hello! I would like to sell my car.');
      break;
    default:
      parts.push('Hello! I have an inquiry.');
  }
  
  parts.push(''); // Empty line
  
  // Add name
  if (data.name) {
    parts.push(`Name: ${data.name}`);
  }
  
  // Add contact information
  if (data.email) {
    parts.push(`Email: ${data.email}`);
  }
  if (data.phone) {
    parts.push(`Phone: ${data.phone}`);
  }
  
  // Add subject (for contact form)
  if (data.subject) {
    parts.push(`Subject: ${data.subject}`);
  }
  
  // Add message/content
  if (data.message || data.feedback || data.accident_details) {
    parts.push('');
    const content = data.message || data.feedback || data.accident_details || '';
    if (content.length > 200) {
      parts.push(content.substring(0, 200) + '...');
    } else {
      parts.push(content);
    }
  }
  
  // Add vehicle details for sell car form
  if (formType === 'sell_car' && data.vehicle_make && data.vehicle_model) {
    parts.push('');
    parts.push('Vehicle Details:');
    if (data.vehicle_make) parts.push(`Make: ${data.vehicle_make}`);
    if (data.vehicle_model) parts.push(`Model: ${data.vehicle_model}`);
    if (data.vehicle_year) parts.push(`Year: ${data.vehicle_year}`);
    if (data.mileage) parts.push(`Mileage: ${data.mileage}`);
  }
  
  // Add accident details for claim forms
  if (formType === 'claim' && data.accident_date) {
    parts.push('');
    parts.push('Accident Details:');
    if (data.accident_date) parts.push(`Date: ${data.accident_date}`);
    if (data.vehicle_registration) parts.push(`Vehicle Registration: ${data.vehicle_registration}`);
    if (data.insurance_company) parts.push(`Insurance: ${data.insurance_company}`);
  }
  
  return parts.join('\n');
}

/**
 * Generate WhatsApp URL with formatted message
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-digit characters except + from phone number
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with pre-filled message
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = generateWhatsAppUrl(phoneNumber, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

