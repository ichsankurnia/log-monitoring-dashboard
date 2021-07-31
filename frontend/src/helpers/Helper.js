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

    static getASCIIAsBase64 = (buffer) => {
        try {
            return new Buffer.from(buffer).toString('ascii')
        } catch (error) {
            return buffer
        }
    }

    static capitalEachWord = (letter) => {
        var separateWord = letter.toLowerCase().split(' ');
        for (var i = 0; i < separateWord.length; i++) {
           separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
           separateWord[i].substring(1);
        }
        return separateWord.join(' ');
     }
}

export default Helper