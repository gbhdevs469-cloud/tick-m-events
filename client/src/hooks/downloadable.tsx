import * as XLSX from 'xlsx';

interface ExcelExportOptions {
    fileName?: string;
    sheetName?: string;
}

export const useExcelExport = () => {
    const exportToExcel = <T extends Record<string, any>>(
        data: T[],
        options?: ExcelExportOptions
    ) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            options?.sheetName || "Sheet1"
        );
        XLSX.writeFile(
            workbook,
            `${options?.fileName || 'export'}.xlsx`
        );
    };

    return exportToExcel;
};



interface CSVExportOptions {
    fileName?: string;
    headers?: string[];
    fieldNames?: string[]; // Add this to map headers to data properties
}

export const useCSVExport = () => {
    const exportToCSV = <T extends Record<string, any>>(
        data: T[],
        options?: CSVExportOptions
    ) => {
        // Get headers either from options or from data keys
        const headers = options?.headers || Object.keys(data[0] || {});
        // Get field names either from options or use headers as-is
        const fieldNames = options?.fieldNames || headers;
        
        const headerRow = `${headers.join(',')}\n`;
        
        const csvContent = data.map(item =>
            fieldNames.map(field =>
                `"${item[field] || ''}"`
            ).join(',')
        ).join('\n');

        const blob = new Blob([`${headerRow}${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${options?.fileName || 'export'}.csv`);
        link.click();
    };

    return exportToCSV;
};