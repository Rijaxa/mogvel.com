/**
 * Utility to export JSON data to CSV and trigger a download in the browser
 */
export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) {
        console.error("No data to export");
        return;
    }

    // Extract headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(fieldName => {
                const value = row[fieldName] ?? '';
                // Handle strings with commas by wrapping in quotes
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                return `"${stringValue.replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
