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
export interface NameComponents {
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    prefix?: string;
}
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
export declare function formatName(components: NameComponents, template?: string): string;
/**
 * Common name format templates for different regions
 */
export declare const NAME_FORMAT_TEMPLATES: {
    /** UAE/Middle East: "Dr. Ahmed Mohammed Al-Mansoori" */
    readonly UAE: "{title} {firstName} {middleName} {lastName}";
    /** USA/Western: "Smith, John Robert" */
    readonly USA: "{lastName}, {firstName} {middleName}";
    /** Simple: "John Smith" */
    readonly SIMPLE: "{firstName} {lastName}";
    /** Formal with title: "Dr. Smith" */
    readonly FORMAL: "{title} {lastName}";
    /** Full name without title: "John Robert Smith" */
    readonly FULL: "{firstName} {middleName} {lastName}";
    /** First name only: "John" */
    readonly FIRST_ONLY: "{firstName}";
    /** Last name only: "Smith" */
    readonly LAST_ONLY: "{lastName}";
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
export declare function parseFormatTemplate(configValue: string): string;
//# sourceMappingURL=name-formatter.d.ts.map