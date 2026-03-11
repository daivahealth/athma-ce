/**
 * PHI Sanitizer Service
 * Defense-in-depth server-side stripping of Protected Health Information
 * before sending clinical text to external AI providers.
 */

import { Injectable } from '@nestjs/common';
import { logger } from '../../../common/logger/logger.config';

interface SanitizationResult {
  sanitizedText: string;
  phiDetected: boolean;
  redactedCount: number;
}

@Injectable()
export class PhiSanitizerService {
  private static readonly REDACTED = '[REDACTED]';

  /**
   * Patterns that may indicate PHI in clinical text.
   * Order matters: more specific patterns first.
   */
  private readonly patterns: { name: string; regex: RegExp }[] = [
    // Emirates ID: 784-YYYY-NNNNNNN-C
    { name: 'emirates_id', regex: /\b784[-\s]?\d{4}[-\s]?\d{7}[-\s]?\d\b/g },
    // Aadhaar: 12 consecutive digits (with optional spaces/dashes)
    { name: 'aadhaar', regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g },
    // Email addresses
    { name: 'email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
    // Phone numbers: international formats (+971, +91, etc.)
    { name: 'phone', regex: /(?:\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g },
    // MRN patterns: MRN-XXXXX, PAT-XXXXX, or MRN: XXXXX
    { name: 'mrn', regex: /\b(?:MRN|PAT|PATIENT[_\s]?ID)[\s:_-]*[A-Z0-9]{4,15}\b/gi },
    // Dates that look like DOB (preceded by DOB/born/birth/age)
    {
      name: 'dob',
      regex: /\b(?:DOB|date\s+of\s+birth|born|birth\s*date)\s*[:=]?\s*\d{1,4}[-/]\d{1,2}[-/]\d{1,4}\b/gi,
    },
    // Names preceded by identifying prefixes
    {
      name: 'named_person',
      regex: /(?:(?:Patient\s*(?:name)?|Name|Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s*[:=]?\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
    },
  ];

  /**
   * Sanitize clinical text by removing potential PHI.
   * This is a defense-in-depth measure; the frontend should already
   * be sending only de-identified clinical narrative.
   */
  sanitize(text: string): SanitizationResult {
    let sanitizedText = text;
    let totalRedacted = 0;

    for (const { name, regex } of this.patterns) {
      // Reset lastIndex for global regexes
      regex.lastIndex = 0;
      const matches = sanitizedText.match(regex);
      if (matches && matches.length > 0) {
        totalRedacted += matches.length;
        logger.warn(
          { patternName: name, matchCount: matches.length },
          'PHI pattern detected in clinical text - redacting',
        );
        sanitizedText = sanitizedText.replace(regex, PhiSanitizerService.REDACTED);
      }
    }

    return {
      sanitizedText: sanitizedText.trim(),
      phiDetected: totalRedacted > 0,
      redactedCount: totalRedacted,
    };
  }
}
