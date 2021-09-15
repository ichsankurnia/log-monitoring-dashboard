import logoNutech from '../assets/img/logo-nutech.png'
import logoCallCenter from '../assets/img/ccit-logo-trans.png'

const HomeDashboard = () => {
    return (
        <div>
            <div style={{position: 'fixed', top: 10, left: 10}}>
                {/* <img src={logoNutechNoTrans} alt="" width={350} /> */}
                <img src={logoNutech} alt="" style={{width: '80%'}} />
            </div>
            <div style={{position: 'absolute', top: -90, right: -185}}>
                <img src={logoCallCenter} alt="" style={{width: '60%'}} />
            </div>
        </div>
    )
}

export default HomeDashboard