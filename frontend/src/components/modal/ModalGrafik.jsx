import { BarLoader, BubbleLoader } from "./Loader"

const ModalGrafik = ({query, onClose}) => {
    return (
        // <div className='modal'>
        //     <div className='modal-outside' onClick={onClose}></div>
        //     <div className='modal-content'>
        //         <h1>{query}</h1>
        //     </div>
        // </div>
        <BarLoader />
    )
}

export default ModalGrafik