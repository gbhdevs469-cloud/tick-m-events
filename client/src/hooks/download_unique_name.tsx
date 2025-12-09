export const getUniqueFileName = (baseName: string) => {
    const now = new Date();
    const timestamp = now.toISOString()
        .replace(/[:.]/g, '-')  // Replace colons and periods with hyphens
        .replace('T', '_')      // Replace T with underscore
        .slice(0, 19);         // Get only date and time (YYYY-MM-DDTHH-MM-SS)
    return `${baseName}_${timestamp}`;
};