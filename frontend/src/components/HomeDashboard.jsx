import logoNutech from '../assets/img/logo-nutech.png'

const HomeDashboard = () => {
    return (
        <div style={{position: 'fixed', top: 10, left: 10}}>
            {/* <img src={logoNutechNoTrans} alt="" width={350} /> */}
            <img src={logoNutech} alt="" style={{width: '80%'}} />
        </div>
    )
}

export default HomeDashboard