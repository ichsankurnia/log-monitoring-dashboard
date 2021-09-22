export const BarLoader = () => {
    return (
        <div className='modal'>
            <div className='modal-outside'></div>
            <div className='loader-content bar-1'></div>
            <div className='loader-content bar-2'></div>
            <div className='loader-content bar-3'></div>
        </div>
    )
}

export const BubbleLoader = () => {
    return (
        <div className="modal">
            <div className='modal-outside'></div>
            <div className="pulse-container">  
                <div className="pulse-bubble pulse_bubble-1"></div>
                <div className="pulse-bubble pulse_bubble-2"></div>
                <div className="pulse-bubble pulse_bubble-3"></div>
            </div>
        </div>
    )
}