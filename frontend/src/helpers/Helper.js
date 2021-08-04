import moment from "moment"

class Helper {
    static toDataURL = (url) => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }
    ))

    /**
     * 
     * @param {Buffer} buffer 
     * @returns 
     */
    static getASCIIAsBase64 = (buffer) => {
        try {
            return new Buffer.from(buffer).toString('ascii')
        } catch (error) {
            return buffer
        }
    }

    /**
     * 
     * @param {String} letter 
     * @returns 
     */
    static capitalEachWord = (letter) => {
        var separateWord = letter.toLowerCase().split(' ');
        for (var i = 0; i < separateWord.length; i++) {
           separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
           separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    }

    /**
     * 
     * @param {Object} objFilter 
     * @param {Array<Object>} oriData 
     * @returns
     */
    static filterDataTable = (objFilter, oriData) => {
        try {
            let dataTable = [...oriData]
            let result = []
    
            if(Object.keys(objFilter).length > 0){
                let x = 0
                Object.keys(objFilter).forEach(key => {
                    x += 1
                    if(x > 1){
                        if(key === "tanggal_done"){
                            result = result.filter(data =>
                                moment(data[key], moment(data[key]).creationData().format).isBetween(objFilter[key][0], objFilter[key][1])
                            )
                        }else{
                            result = result.filter(data => data[key] === objFilter[key])
                        }
                    }else{
                        if(key === "tanggal_done"){
                            result = dataTable.filter(data =>
                                moment(data[key], moment(data[key]).creationData().format).isBetween(objFilter[key][0], objFilter[key][1])
                            )
                        }else{
                            result = dataTable.filter(data => data[key] === objFilter[key])
                        }
                    }
                })
            }else{
                result = oriData
            }
    
            return result
        } catch (error) {
            return oriData
        }
    }
}

export default Helper