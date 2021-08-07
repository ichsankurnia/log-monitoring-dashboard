import { Link, useHistory } from "react-router-dom"
import jwtDecode from "jwt-decode"
import { AimOutlined, BugFilled, CheckCircleFilled, FundProjectionScreenOutlined, GoldFilled, LogoutOutlined, SettingFilled, UsergroupAddOutlined } from "@ant-design/icons"

import { authLogout } from "../../api"

const AdminMenu = () => {
    const history = useHistory()

    const handleLogout = async () => {
        try {
            const user = jwtDecode(localStorage.getItem('authToken'))
            const res = await authLogout({no_user: user.no_user})
            console.log('logout :', res)

            localStorage.clear()
            history.push('/auth')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className='admin-menu'>
            <h1 style={{color: 'white'}}>Administrator Menu</h1>
            <div className='admin-menu-container'>
                <Link to='/admin/data-project' className="sub-admin-menu">
                    <FundProjectionScreenOutlined className='ic-admin-menu' />
                    <label>Project</label>
                </Link>
                <Link to='/admin/data-lokasi' className="sub-admin-menu">
                    <AimOutlined className='ic-admin-menu' />
                    <label>Location/Station</label>
                </Link> 
                <Link to='/admin/data-perangkat' className="sub-admin-menu">
                    <SettingFilled className='ic-admin-menu' />
                    <label>Device</label>
                </Link> 
                <Link to='/admin/data-part' className="sub-admin-menu">
                    <GoldFilled className='ic-admin-menu' />
                    <label>Data Part</label>
                </Link>   
                <Link to='/admin/data-penyebab' className="sub-admin-menu">
                    <BugFilled className='ic-admin-menu' />
                    <label>Cause</label>
                </Link>   
                <Link to='/admin/data-solusi' className="sub-admin-menu">
                    <CheckCircleFilled className='ic-admin-menu' />
                    <label>Solution</label>
                </Link>  
                <Link to='/admin/data-user' className="sub-admin-menu">
                    <UsergroupAddOutlined className='ic-admin-menu' />
                    <label>Data User</label>
                </Link>   
                <div className="sub-admin-menu" onClick={handleLogout}>
                    <LogoutOutlined className='ic-admin-menu' />
                    <label>Logout</label>
                </div>            
            </div>
        </div>
    )
}

export default AdminMenu