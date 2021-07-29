import { Col, Row } from "antd"
import { useRef } from "react"

const ModalSetImage = ({onSetPicBefore, onSetPicAfter}) => {
    var fiImgBefore = useRef(null)
    var fiImgAfter = useRef(null)

    const handleChange = (e, id) => {
        if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
            alert('The File APIs are not fully supported in this browser.');
            return false;
        }
        if(id === "img-before"){
            readfiles(fiImgBefore.current.files, id);
        }else{
            readfiles(fiImgAfter.current.files, id);
        }
    }

    function readfiles(files, id) {

        for (var i = 0; i < files.length; i++) {
            processfile(files[i], id); // process each file at once
        }

        if(id === "img-before"){
            fiImgBefore.current.value = ""
        }else{
            fiImgAfter.current.value = ""
        }
        // TODO remove the previous hidden inputs if user selects other files
    }

    function processfile(file, id) {
  
        if( !( /image/i ).test( file.type ) ){
            alert( "File "+ file.name +" is not an image." );
            return false;
        }
    
        // read the files
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        
        reader.onload = function (event) {
            // blob stuff
            var blob = new Blob([event.target.result]); // create blob...
            window.URL = window.URL || window.webkitURL;
            var blobURL = window.URL.createObjectURL(blob); // and get it's URL
            
            // helper Image object
            var image = new Image();
            image.name = "original-" + id;
            image.src = blobURL;

            image.onload = function() {
                // have to wait till it's loaded
                resizeMe(image, image.width, image.height, id); // send it to canvas
            }
        };
    }

    
    // === RESIZE ====
    function resizeMe(img, w, h, id) {
        var canvas = document.createElement('canvas');
        
        // resize the canvas and draw the image data into it
        var width; var height;
        if(w > h){
            if(w < 800){
                width = w/1.5;
                height = h/1.5;
            }else if(w < 1370){
                width = w/2;
                height = h/2;
            }else if(w < 4000){
                width = w/3
                height = h/3
            }else{
                width = w/6
                height = h/6
            }
        }else{
            if(h < 800){
                width = w/1.5;
                height = h/1.5;
            }else if(h < 1370){
                width = w/2;
                height = h/2;
            }else if(h < 4000){
                width = w/3
                height = h/3
            }else{
                width = w/6
                height = h/6
            }
        }

        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // const base64Img = canvas.toDataURL('image/jpeg', 0.8)
        const base64Img = canvas.toDataURL('image/jpeg', 0.8)

        console.log(base64Img)

        let wImg, hImg
        if(w > h){
            wImg = 200; hImg = 150
        }else if(w === h){
            wImg = 200; hImg = 200
        }else{
            wImg = 150; hImg = 200
        }

        if(id === "img-before"){
            onSetPicBefore(base64Img, wImg, hImg)
        }else{
            onSetPicAfter(base64Img, wImg, hImg)
        }
    }

    return (
        <Row gutter={16}>
            <Col span={12} style={{display: "flex", flexDirection: 'column'}}>
                <label>Pic Before : </label>
                <input type="file" onChange={(e) => handleChange(e, "img-before")} ref={fiImgBefore} style={{alignSelf: 'center', marginTop: 10}} />
            </Col>
            <Col span={12} style={{display: "flex", flexDirection: 'column'}}>
                <label>Pic After : </label>
                <input type="file" onChange={(e) => handleChange(e, "img-after")} ref={fiImgAfter} style={{alignSelf: 'center', marginTop: 10}} />
            </Col>
        </Row>
    )
}

export default ModalSetImage