/* eslint-disable */
import XLSX from 'xlsx';

function auto_width(ws, data){
    /*set worksheet max width per col*/
    const colWidth = data.map(row => row.map(val => {
        /*if null/undefined*/
        if (val == null) {
            return {'wch': 10};
        }
        /*if chinese*/
        else if (val.toString().charCodeAt(0) > 255) {
            return {'wch': val.toString().length * 2};
        } else {
            return {'wch': val.toString().length};
        }
    }))
    /*start in the first row*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
}

function json_to_array(key, jsonData){
    return jsonData.map(v => key.map(j => { return v[j] }));
}

// get head from excel file,return array
function get_header_row(sheet) {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let C
    const R = range.s.r /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
    }
    return headers
}

export const export_array_to_excel = ({key, data, title, filename, autoWidth}) => {
    const wb = XLSX.utils.book_new();
    const arr = json_to_array(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    if(autoWidth){
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

export const read = (data, type) => {
    /* if type == 'base64' must fix data first */
    // const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
    const workbook = XLSX.read(data, { type: type });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = get_header_row(worksheet);
    const results = XLSX.utils.sheet_to_json(worksheet);
    return {header, results};
}

export default {
  export_array_to_excel,
  read
}
