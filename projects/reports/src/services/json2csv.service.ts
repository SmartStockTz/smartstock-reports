export const json2csv = async (name: string, columns: string[], data: object[]) => {
  let csv = '';
  if (columns && Array.isArray(columns)) {
    csv = csv.concat(columns.join(',')).concat(',\n');
    data.forEach(element => {
      columns.forEach(column => {
        csv = csv.concat(element[column]).concat(', ');
      });
      csv = csv.concat('\n');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csv;
    const url = encodeURI(csvContent);
    const anchor = document.createElement('a');
    anchor.setAttribute('style', 'display: none');
    anchor.download = name;
    anchor.href = url;
    anchor.click();
    return csv;
  }
  throw Error('CSV failed to crete');
};
