import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import logoNtcNT from "../assets/img/logo-nutech-no-trans.jpg"
import Helper from "./Helper";
import moment from "moment";

const border = {
    top: { style: 'thin' }, 
    left: { style: 'thin' },
    bottom: { style: 'thin' }, 
    right: { style: 'thin' }
}

const signFont = {
    name: "Comic Sans MS",
    family: 4,
    size: 11,
    underline: true,
    bold: true
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
        signCellValue.font = signFont
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

    static exportDocumentation = async (srcDataTable) => {
        try {
            const columns = [
                { header: 'No', key: 'number', width: 5, style: {numFmt: '0;[Red]0'}},
                { header: 'No Ticket', key: 'no', width: 25 },
                { header: 'Tanggal Masalah', key: 'tanggal_masalah', style: {numFmt: 'dd/mm/yyyy'} },
                { header: 'Tanggal Done', key: 'tanggal_done', style: {numFmt: 'dd/mm/yyyy'} },
                { header: 'Projek', key: 'nama_projek' },
                { header: 'Lokasi', key: 'nama_stasiun' },
                { header: 'Perangkat', key: 'nama_perangkat' },
                { header: 'ID Perangkat', key: 'id_perangkat' },
                { header: 'Jenis Pergantian', key: 'nama_part' },
                { header: 'Problem', key: 'problem' },
                { header: 'Solusi', key: 'solusi' },
                { header: 'Picture Before', key: 'pic_before', width: 25 },
                { header: 'Picture After', key: 'pic_after', width: 25 },
            ];
    
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'ichsankurnia';
            workbook.lastModifiedBy = 'Ories';
    
            var worksheet = workbook.addWorksheet("Dokumentasi Pemasangan Barang", {orientation:'landscape'});
    
            const base64Img = await Helper.toDataURL(logoNtcNT)
            var logo = workbook.addImage({
                base64: base64Img,
                extension: 'jpeg',
            });
            worksheet.addImage(logo, {
                tl: { col: 1, row: 1 },
                ext: { width: 250, height: 75 }
            })
            
            worksheet.mergeCells('A6:M6')
            const titleCell = worksheet.getCell('B6')
            titleCell.font = {
                size: 14,
                underline: true,
                bold: true
            }
            titleCell.alignment = {
                horizontal: 'center'
            }
            titleCell.value = "Dokumentasi Pemasangan Barang"
    
    
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
                    tanggal_done: new Date(item.tanggal_done).toLocaleDateString("id-ID", {timeZone: "Asia/Jakarta"}),
                    nama_projek: item.nama_projek,
                    nama_stasiun: item.nama_stasiun,
                    nama_perangkat: item.nama_perangkat,
                    id_perangkat: item.id_perangkat,
                    nama_part: item.nama_part,
                    problem: item.problem,
                    solusi: item.solusi,
                })
    
                // console.log(row)
                row.height = 70                                                                                                         // SET ROW HEIGHT
    
                row._cells.forEach(cell => {
                    cell.border = border
                    cell.alignment = {
                        vertical: 'middle',
                        wrapText: true
                    }
                    // console.log(cell)
                })
    
                const picBefore = Helper.getASCIIAsBase64(item.pic_before)
                const picAfter = Helper.getASCIIAsBase64(item.pic_after)
                if(picBefore && picBefore.includes('base64')){
                    worksheet.addImage(workbook.addImage({base64: picBefore, extension: 'jpeg'}), {
                        // tl: { col: columns.length - 2 + 0.2, row: row._number - 1 + 0.1 }, br: { col: columns.length - 1 - 0.2, row: row._number - 0.1 }, editAs: 'absolute'
                        tl: { col: columns.length - 2 + 0.1, row: row._number - 1 + 0.2 }, ext: { width: 160, height: 80 }
                    })
                }else{
                    const cell = `${columnToLetter(columns.length - 1)}${row._number}`
                    worksheet.getCell(cell).value = 'File too large, cannot load the image!'
                    worksheet.getCell(cell).font = {size: 7.5, color: {argb: "00FF0000"}}
                    worksheet.getCell(cell).alignment = {vertical: 'middle', horizontal: 'center'}
                }

                if(picAfter && picAfter.includes('base64')){
                    worksheet.addImage(workbook.addImage({base64: picAfter, extension: 'jpeg'}), {
                        // tl: { col: columns.length - 1 + 0.2, row: row._number - 1 + 0.1 }, br: { col: columns.length - 0.2, row: row._number - 0.1 }, editAs: 'oneCell'
                        tl: { col: columns.length - 1 + 0.1, row: row._number - 1 + 0.2 }, ext: { width: 160, height: 80 }
                    })
                }else{
                    const cell = `${columnToLetter(columns.length)}${row._number}`
                    worksheet.getCell(cell).value = 'File too large, cannot load the image!'
                    worksheet.getCell(cell).font = {size: 7.5, color: {argb: "00FF0000"}}
                    worksheet.getCell(cell).alignment = {vertical: 'middle', horizontal: 'center'}
                }
            })
    
            worksheet.getColumn('pic_before').eachCell({ includeEmpty: false }, cell => {
                if(cell._row._number >= 8){
                    cell.border = border
                }
            })
            worksheet.getColumn('pic_after').eachCell({ includeEmpty: false }, cell => {
                if(cell._row._number >= 8){
                    cell.border = border
                }
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
            signCellValue.font = signFont
            signCellValue.alignment = {
                horizontal: 'center',
                wrapText: true
            }
            signCellValue.border = border
            signCellValue.value = "Export by:\nIchsan Kurniawan"
    
    
            workbook.xlsx.writeBuffer().then(function(buffer) {
                saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Dokumentasi Pemasangan Barang.xlsx`
                );
            });

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static exportFormAduan = async (user, data) => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ichsankurnia';
        workbook.lastModifiedBy = 'Ories';

        var worksheet = workbook.addWorksheet("Form Aduan Permintaan dan Perbaikan Barang");

        const base64Img = await Helper.toDataURL(logoNtcNT)
        var logo = workbook.addImage({
            base64: base64Img,
            extension: 'jpeg',
        });
        worksheet.addImage(logo, {
            tl: { col: 1, row: 1 },
            ext: { width: 140, height: 50 }
        })

        worksheet.mergeCells('B5:I5')
        const titleCell = worksheet.getCell('B5')
        titleCell.font = {
            size: 11,
            bold: true
        }
        titleCell.alignment = {
            horizontal: 'center'
        }
        titleCell.border = {left: { style: 'thick' }, top: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' }}
        titleCell.value = "Form Aduan Permintaan dan Perbaikan"

        if(data){
            var { tanggal_masalah, refnotrouble, no, nama_projek, nama_stasiun, nama_perangkat, id, problem } = data
        }

        worksheet.getCell('B7').value = 'Hari / Tanggal'
        worksheet.getCell('B8').value = 'Petugas Call Center'
        worksheet.getCell('B9').value = 'Ref No'
        worksheet.getCell('B10').value = 'Trouble Ticket'
        worksheet.getCell('B11').value = 'Nama Projek'
        worksheet.getCell('B12').value = 'Nama Lokasi'
        worksheet.getCell('B13').value = 'Nama Barang'
        worksheet.getCell('B14').value = 'ID Perangkat'
        worksheet.getCell('B15').value = 'Permasalahan'

        worksheet.getCell('C7').value = ':'
        worksheet.getCell('C8').value = ':'
        worksheet.getCell('C9').value = ':'
        worksheet.getCell('C10').value = ':'
        worksheet.getCell('C11').value = ':'
        worksheet.getCell('C12').value = ':'
        worksheet.getCell('C13').value = ':'
        worksheet.getCell('C14').value = ':'
        worksheet.getCell('C15').value = ':'

        worksheet.getCell('D7').value = moment(tanggal_masalah, moment(data).creationData().format).format('dddd, DD MMMM YYYY') || moment().format('dddd, DD MMMM YYYY')
        worksheet.getCell('D8').value = user || 'User Call Center'
        worksheet.getCell('D9').value = refnotrouble || ''
        worksheet.getCell('D10').value = no || ''
        worksheet.getCell('D11').value = nama_projek || 'Project Name'
        worksheet.getCell('D12').value = nama_stasiun || 'Location'
        worksheet.getCell('D13').value = nama_perangkat || 'Device'
        worksheet.getCell('D14').value = id || 'Device ID'
        worksheet.getCell('D15').value = problem || 'Problem'


        worksheet.columns.forEach((column, i) => {
            if(column._number === 2){
                column.width = 20
            }
            if(column._number === 3){
                column.width = 2
            }
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                if(cell._row._number >= 7 && column._number === 2){
                    cell.font = { bold: true}
                    cell.border = {left: { style: 'thick' }}
                }
                if(cell._row._number >= 7 && column._number === 9){
                    cell.border = {right: { style: 'thick' }}
                }
                if(cell._row._number === 7 && column._number > 1){
                    cell.border = {top: { style: 'thick' }}
                }
                if(cell._row._number === 15 && column._number > 1 ){
                    cell.border = {bottom: { style: 'thick' }}
                }
            });
        })

        worksheet.getCell('B7').border = {left: { style: 'thick' }, top: { style: 'thick' } }
        worksheet.getCell('B15').border = {left: { style: 'thick' }, bottom: { style: 'thick' } }
        worksheet.getCell('I7').border = {right: { style: 'thick' }, top: { style: 'thick' } }
        worksheet.getCell('I15').border = {right: { style: 'thick' }, bottom: { style: 'thick' } }

        const fileBuffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([fileBuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})  // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet application/vnd.ms-excel
        const res = await blobToBase64(blob)
        return res

        // workbook.xlsx.writeBuffer().then(function(buffer) {
        //     saveAs(
        //         new Blob([buffer], { type: "application/octet-stream" }),
        //         `Form Permintaan Barang.xlsx`
        //     );
        // });
    }
}

const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
};

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

function letterToColumn(letter)                                                                             // eslint-disable-line no-unused-vars
{
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}


export default ExportExcel