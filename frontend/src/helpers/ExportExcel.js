import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import logoNtc from "../assets/img/logo-nutech.png"
import logoNtcNT from "../assets/img/logo-nutech-no-trans.jpg"
import Helper from "./Helper";

const border = {
    top: { style: 'thin' }, 
    left: { style: 'thin' },
    bottom: { style: 'thin' }, 
    right: { style: 'thin' }
}

class ExportExcel {
    static exportListTroubleET = async (srcDataTable) => {
        const columns = [
            { header: 'No', key: 'number', width: 5, style: {numFmt: '0;[Red]0'}},
            { header: 'No Ticket', key: 'no', width: 25 },
            { header: 'Tanggal Masalah', key: 'tanggal_masalah', style: {numFmt: 'dd/mm/yyyy'} },
            { header: 'Jam Masalah', key: 'jam_masalah', style: {numFmt: '[$-13809]hh:mm:ss;@'} },
            { header: 'Tanggal Done', key: 'tanggal_done', style: {numFmt: 'dd/mm/yyyy'} },
            { header: 'Jam Done', key: 'jam_done', style: {numFmt: '[$-13809]hh:mm:ss;@'} },
            { header: 'Jenis Laporan', key: 'jenislaporan' },
            { header: 'Projek', key: 'nama_projek' },
            { header: 'Lokasi', key: 'nama_stasiun' },
            { header: 'Perangkat', key: 'nama_perangkat' },
            { header: 'Part', key: 'nama_part' },
            { header: 'Masalah', key: 'problem' },
            { header: 'Penyebab', key: 'penyebab' },
            { header: 'Solusi', key: 'solusi' },
            { header: 'Sumber', key: 'sumber' },
            { header: 'RefNoTrouble', key: 'refnotrouble' },
            { header: 'Teknisi', key: 'teknisi' },
            { header: 'Downtime', key: 'totaldowntime' },
            { header: 'Status', key: 'status' },
        ];

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ichsankurnia';
        workbook.lastModifiedBy = 'Ories';
        workbook.created = new Date(1985, 8, 30);
        workbook.modified = new Date();
        workbook.lastPrinted = new Date(2016, 9, 27);

        var worksheet = workbook.addWorksheet("Sheet1", {orientation:'landscape'});

        const base64Img = await Helper.toDataURL(logoNtcNT)
        var logo = workbook.addImage({
            base64: base64Img,
            extension: 'jpeg',
        });
        // worksheet.mergeCells('B2:C4')
        // worksheet.addImage(logo, 'B2:C4');
        worksheet.addImage(logo, {
            tl: { col: 1, row: 1 },
            ext: { width: 250, height: 75 }
        })
        
        worksheet.mergeCells('B6:I6')
        const titleCell = worksheet.getCell('B6')
        titleCell.font = {
            size: 15,
            underline: true,
            bold: true
        }
        titleCell.alignment = {
            horizontal: 'center'
        }
        titleCell.value = "Export TroubleET"


        // Table Headers
        worksheet.getRow(8).values = columns.map(item => item.header);
        worksheet.getRow(8).font = { bold: true }
        worksheet.getRow(8).eachCell({ includeEmpty: false }, cell => {
            cell.border = border
        })
        worksheet.columns = columns.map(item =>{ 
            return {
                key: item.key, 
                width: item.width || 20,
                style: item.style || { numFmt: 'General' }
            }
        })

        // Set table value
        srcDataTable.forEach((item, index) => {
            const row = worksheet.addRow({
                number: index + 1,
                no: item.no,
                tanggal_masalah: new Date(item.tanggal_masalah).toLocaleDateString("id-ID", {timeZone: "Asia/Jakarta"}),
                jam_masalah: item.jam_masalah,
                tanggal_done: new Date(item.tanggal_done).toLocaleDateString("id-ID", {timeZone: "Asia/Jakarta"}),
                jam_done: item.jam_done,
                jenislaporan: item.jenislaporan,
                nama_projek: item.nama_projek,
                nama_stasiun: item.nama_stasiun,
                nama_perangkat: item.nama_perangkat,
                nama_part: item.nama_part,
                problem: item.problem,
                penyebab: item.penyebab,
                solusi: item.solusi,
                sumber: item.sumber,
                refnotrouble: item.refnotrouble,
                teknisi: item.teknisi,
                totaldowntime: item.totaldowntime,
                status: item.status
            })
            // console.log(row)
            row._cells.forEach(cell => {
                cell.border = border
            })
        })

        // Signature
        let lastRowTable
        await worksheet.eachRow({ includeEmpty: false }, async function(row, rowNumber) {
            lastRowTable = await rowNumber
        });
        
        const lastCellTable = `${columnToLetter(columns.length - 1)}${lastRowTable + 2}`
        const signCell = `${columnToLetter(columns.length)}${lastRowTable + 4}`
        worksheet.mergeCells(signCell, lastCellTable)
        
        const signCellValue = worksheet.getCell(signCell)
        signCellValue.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 11,
            underline: true,
            bold: true
        }
        signCellValue.alignment = {
            horizontal: 'center',
            wrapText: true
        }
        signCellValue.border = border
        signCellValue.value = "Export by:\nIchsan Kurniawan"


        workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `test.xlsx`
            );
        });
    }
}

function columnToLetter(column)
{
    var temp, letter = '';
    while (column > 0)
    {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

function letterToColumn(letter)
{
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}


export default ExportExcel