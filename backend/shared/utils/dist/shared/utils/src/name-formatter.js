"use strict";
/**
 * Name Formatter Utility
 *
 * Formats person names (patient, staff) based on configurable templates.
 * Supports different naming conventions across geographies:
 * - UAE/Middle East: "{title} {firstName} {middleName} {lastName}"
 * - USA/Western: "{lastName}, {firstName} {middleName}"
 * - Asian: Various formats based on region
 * - Simple: "{firstName} {lastName}"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAME_FORMAT_TEMPLATES = void 0;
exports.formatName = formatName;
exports.parseFormatTemplate = parseFormatTemplate;
/**
 * Formats a name according to the provided template
 *
 * @param components - Name components to format
 * @param template - Template string with placeholders like "{title} {firstName} {middleName} {lastName}"
 * @returns Formatted name string with extra spaces cleaned up
 *
 * @example
 * formatName(
 *   { title: 'Dr.', firstName: 'Ahmed', lastName: 'Al-Mansoori' },
 *   '{title} {firstName} {lastName}'
 * ) // Returns: "Dr. Ahmed Al-Mansoori"
 *
 * @example
 * formatName(
 *   { firstName: 'John', middleName: 'Robert', lastName: 'Smith' },
 *   '{lastName}, {firstName} {middleName}'
 * ) // Returns: "Smith, John Robert"
 */
function formatName(components, template = '{title} {firstName} {middleName} {lastName}') {
    // Handle prefix as alias for title
    const nameData = {
        ...components,
        title: components.title || components.prefix || '',
    };
    // Replace placeholders in template
    let formatted = template;
    // Replace each placeholder with its value or empty string
    Object.keys(nameData).forEach((key) => {
        const value = nameData[key];
        const placeholder = new RegExp(`\\{${key}\\}`, 'g');
        formatted = formatted.replace(placeholder, value || '');
    });
    // Clean up extra spaces, commas with nothing before them, and leading/trailing spaces
    formatted = formatted
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/,\s*,/g, ',') // Multiple commas to single comma
        .replace(/^\s*,\s*/, '') // Leading comma
        .replace(/\s*,\s*$/, '') // Trailing comma
        .trim(); // Remove leading/trailing spaces
    return formatted;
}
/**
 * Common name format templates for different regions
 */
exports.NAME_FORMAT_TEMPLATES = {
    /** UAE/Middle East: "Dr. Ahmed Mohammed Al-Mansoori" */
    UAE: '{title} {firstName} {middleName} {lastName}',
    /** USA/Western: "Smith, John Robert" */
    USA: '{lastName}, {firstName} {middleName}',
    /** Simple: "John Smith" */
    SIMPLE: '{firstName} {lastName}',
    /** Formal with title: "Dr. Smith" */
    FORMAL: '{title} {lastName}',
    /** Full name without title: "John Robert Smith" */
    FULL: '{firstName} {middleName} {lastName}',
    /** First name only: "John" */
    FIRST_ONLY: '{firstName}',
    /** Last name only: "Smith" */
    LAST_ONLY: '{lastName}',
};
/**
 * Parses a format template string from config (which may be JSON-stringified)
 *
 * @param configValue - The config value (may be JSON string or plain string)
 * @returns Parsed template string
 *
 * @example
 * parseFormatTemplate('"{title} {firstName} {lastName}"')
 * // Returns: "{title} {firstName} {lastName}"
 */
function parseFormatTemplate(configValue) {
    try {
        // Try to parse as JSON first (handles values like '"{template}"')
        return JSON.parse(configValue);
    }
    catch {
        // If parsing fails, return as-is (it's already a plain string)
        return configValue;
    }
}
//# sourceMappingURL=name-formatter.js.map