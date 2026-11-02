export function exportToCsv(filename, rows, headers) {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const separator = ',';
  const keys = headers ? headers.map(h => h.key) : Object.keys(rows[0]);
  const headerLabels = headers ? headers.map(h => h.label) : keys;

  const csvContent = [
    headerLabels.join(separator),
    ...rows.map(row =>
      keys
        .map(k => {
          let val = row[k] === null || row[k] === undefined ? '' : row[k];
          if (typeof val === 'object') val = JSON.stringify(val);
          val = String(val).replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
          return val;
        })
        .join(separator)
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
