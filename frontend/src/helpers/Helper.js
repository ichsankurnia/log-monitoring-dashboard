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
}

export default Helper