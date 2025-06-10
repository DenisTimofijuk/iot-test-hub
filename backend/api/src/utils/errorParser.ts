/**
 * Parses MongoDB JSON schema validation errors to extract property names and descriptions
 * @param {Object} errInfo - The error info object from MongoDB validation
 * @returns {Array<Object>} Array of objects with propertyName and description
 */
type ErrorItem = {
    propertyName: string;
    description: string;
    path: string;
};

export function parseSchemaErrors(errInfo: any) {
    const results: ErrorItem[] = [];

    try {
        // Check if details exists
        if (!errInfo || !errInfo.details) {
            return results;
        }

        // Recursively search through the error structure
        function extractPropertyErrors(obj: any, path: any[] = []) {
            if (!obj || typeof obj !== "object") {
                return;
            }

            // If this is an array, process each element
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    extractPropertyErrors(item, [...path, index]);
                });
                return;
            }

            // Check if current object has propertyName and description
            if (obj.propertyName && obj.description) {
                results.push({
                    propertyName: obj.propertyName,
                    description: obj.description,
                    path: path.length > 0 ? path.join(".") : "root",
                });
            }

            // Recursively check all properties
            for (const [key, value] of Object.entries(obj)) {
                // Look for properties that contain "NotSatisfied" in their names
                if (
                    key.includes("NotSatisfied") ||
                    key === "details" ||
                    key === "schemaRulesNotSatisfied"
                ) {
                    extractPropertyErrors(value, [...path, key]);
                } else if (typeof value === "object") {
                    // Also check other nested objects
                    extractPropertyErrors(value, [...path, key]);
                }
            }
        }

        // Start the recursive extraction from details
        extractPropertyErrors(errInfo.details);
    } catch (error) {
        console.error("Error parsing schema validation errors:", error);
        return [];
    }

    return results;
}