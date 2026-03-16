/**
 * Infère le type d'une valeur JSON.
 * @param {any} value
 * @returns {string} type parmi ceux de TYPES
 */
export function inferTypeFromValue(value) {
    if (value === null) return 'string';
    const t = typeof value;
    if (t === 'number') {
        return Number.isInteger(value) ? 'int' : 'float';
    }
    if (t === 'boolean') return 'bool';
    if (t === 'string') {
        // Détection UUID (format 8-4-4-4-12)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(value)) return 'uuid';
        // Détection simple de date (YYYY-MM-DD...)
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
        return 'string';
    }
    if (t === 'object') return 'json'; // pour les objets et tableaux
    return 'string';
}
