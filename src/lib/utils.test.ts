import { describe, it, expect } from 'vitest';
import {
  formatSwedishDate,
  formatTime,
  cn,
  getStatusBadgeClass,
  getStatusLabel,
} from './utils';

describe('formatSwedishDate', () => {
  it('should format a date with Swedish day name', () => {
    const result = formatSwedishDate('2025-01-15');
    expect(result.dayName).toBe('Onsdag');
    expect(result.fullDate).toBe('15 januari 2025');
    expect(result.shortDate).toBe('15 januari');
  });

  it('should handle different months correctly', () => {
    expect(formatSwedishDate('2025-03-10').fullDate).toBe('10 mars 2025');
    expect(formatSwedishDate('2025-06-20').fullDate).toBe('20 juni 2025');
    expect(formatSwedishDate('2025-12-25').fullDate).toBe('25 december 2025');
  });

  it('should handle different days of the week', () => {
    expect(formatSwedishDate('2025-01-13').dayName).toBe('Måndag');
    expect(formatSwedishDate('2025-01-14').dayName).toBe('Tisdag');
    expect(formatSwedishDate('2025-01-17').dayName).toBe('Fredag');
    expect(formatSwedishDate('2025-01-18').dayName).toBe('Lördag');
    expect(formatSwedishDate('2025-01-19').dayName).toBe('Söndag');
  });
});

describe('formatTime', () => {
  it('should format time string to HH:MM', () => {
    expect(formatTime('08:00:00')).toBe('08:00');
    expect(formatTime('14:30:00')).toBe('14:30');
    expect(formatTime('23:59:59')).toBe('23:59');
  });

  it('should handle already short time strings', () => {
    expect(formatTime('08:00')).toBe('08:00');
  });
});

describe('cn', () => {
  it('should join class names with spaces', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should filter out falsy values', () => {
    expect(cn('class1', false, 'class2')).toBe('class1 class2');
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    expect(cn('class1', null, 'class2')).toBe('class1 class2');
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  it('should handle all falsy values', () => {
    expect(cn(false, undefined, null)).toBe('');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
  });
});

describe('getStatusBadgeClass', () => {
  it('should return success class for approved and completed', () => {
    expect(getStatusBadgeClass('approved')).toBe('badge-success');
    expect(getStatusBadgeClass('completed')).toBe('badge-success');
  });

  it('should return pending class for pending status', () => {
    expect(getStatusBadgeClass('pending')).toBe('badge-pending');
  });

  it('should return rejected class for rejected and cancelled', () => {
    expect(getStatusBadgeClass('rejected')).toBe('badge-rejected');
    expect(getStatusBadgeClass('cancelled')).toBe('badge-rejected');
  });

  it('should return neutral class for unknown status', () => {
    expect(getStatusBadgeClass('unknown')).toBe('badge-neutral');
    expect(getStatusBadgeClass('')).toBe('badge-neutral');
  });
});

describe('getStatusLabel', () => {
  it('should return Swedish labels for booking statuses', () => {
    expect(getStatusLabel('pending')).toBe('Väntar');
    expect(getStatusLabel('approved')).toBe('Godkänd');
    expect(getStatusLabel('rejected')).toBe('Nekad');
    expect(getStatusLabel('cancelled')).toBe('Avbokad');
    expect(getStatusLabel('completed')).toBe('Slutförd');
  });

  it('should return Swedish labels for slot statuses', () => {
    expect(getStatusLabel('available')).toBe('Tillgänglig');
    expect(getStatusLabel('booked')).toBe('Bokad');
  });

  it('should return the status itself for unknown statuses', () => {
    expect(getStatusLabel('unknown')).toBe('unknown');
  });
});
