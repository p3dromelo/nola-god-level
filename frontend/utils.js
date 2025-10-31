export const exportToCsv = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);

    // Cria a linha de cabeçalho
    const csvRows = [];
    csvRows.push(headers.join(','));

    // Adiciona as linhas de dados
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            let finalValue = value === null || value === undefined ? '' : String(value);

            if (finalValue.includes(',')) {
                finalValue = `"${finalValue}"`;
            }
            return finalValue;
        });
        csvRows.push(values.join(','));
    }

    // Cria o objeto Blob e dispara o download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Navegadores modernos
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};