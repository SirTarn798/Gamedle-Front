export function capitalizeFirstLetter(val : string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function generateFileName(originalName: string) {
    const timestamp = new Date().toISOString()
    const extension = originalName.split(".").pop(); // Get file extension
    return `${timestamp}.${extension}`; // e.g., "20250323_153045.jpg"
}