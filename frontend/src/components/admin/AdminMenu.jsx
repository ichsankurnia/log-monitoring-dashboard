import { Link, useHistory } from "react-router-dom"
import jwtDecode from "jwt-decode"
import { BugFilled, CheckCircleFilled, EnvironmentFilled, ExclamationCircleOutlined, FundProjectionScreenOutlined, GoldFilled, LogoutOutlined, SettingFilled, UsergroupAddOutlined } from "@ant-design/icons"

import { authLogout } from "../../api"
import { Modal } from 'antd';
import { connect } from "react-redux";

const AdminMenu = ({user}) => {
    const admin = user?.status?.toLowerCase() === 'admin'
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

    function confirmLogout() {
        Modal.confirm({
            title: 'Logout',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure want to leave?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: handleLogout
        });
    }

    return (
        <div className='admin-menu'>
            <h1 style={{color: 'white'}}>Administrator Menu</h1>
            <div className='admin-menu-container'>
                {admin &&
                <Link to='/admin/data-project' className="sub-admin-menu">
                    <FundProjectionScreenOutlined className='ic-admin-menu' />
                    <label>Project</label>
                </Link>
                }
                {admin &&
                <Link to='/admin/data-lokasi' className="sub-admin-menu">
                    <EnvironmentFilled className='ic-admin-menu' />
                    <label>Location/Station</label>
                </Link>
                }
                {admin &&
                <Link to='/admin/data-perangkat' className="sub-admin-menu">
                    <SettingFilled className='ic-admin-menu' />
                    <label>Device</label>
                </Link> 
                }
                {admin &&
                <Link to='/admin/data-part' className="sub-admin-menu">
                    <GoldFilled className='ic-admin-menu' />
                    <label>Data Part</label>
                </Link>   
                }
                {admin &&
                <Link to='/admin/data-penyebab' className="sub-admin-menu">
                    <BugFilled className='ic-admin-menu' />
                    <label>Cause</label>
                </Link>   
                }
                {admin &&
                <Link to='/admin/data-solusi' className="sub-admin-menu">
                    <CheckCircleFilled className='ic-admin-menu' />
                    <label>Solution</label>
                </Link>  
                }
                <Link to='/admin/data-user' className="sub-admin-menu">
                    <UsergroupAddOutlined className='ic-admin-menu' />
                    <label>Data User</label>
                </Link>   
                <div className="sub-admin-menu" onClick={confirmLogout}>
                    <LogoutOutlined className='ic-admin-menu' />
                    <label>Logout</label>
                </div>            
            </div>
            <Modal>

            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(AdminMenu)