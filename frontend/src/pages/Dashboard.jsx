import { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { ExportOutlined, VideoCameraTwoTone, AppstoreFilled, TableOutlined } from '@ant-design/icons';

import routes from '../routes';
import { authLogout } from '../api';
import { setUserData } from '../redux/action/actions';

import wallDark from '../assets/img/win11-wall-dark.jpg'
import wallLight from '../assets/img/win11-wall-light.jpg'


const wllps = [wallDark, wallLight]

const Dashboard = ({setUserData}) => {
    const history = useHistory()

    useEffect(() => {
        async function handleLogout(noUser){
            const res = await authLogout({no_user: noUser})
            console.log('logout :', res)
        }
        
        const token = localStorage.getItem('authToken')

        if(token){
            const decode = jwtDecode(token)
            const currentTime = Date.now() / 1000;
            if(decode.exp < currentTime){
                handleLogout(decode.no_user)
				localStorage.clear()
                history.push('/auth')
			}else{
                setUserData(decode)
            }
        }else{
            localStorage.clear()
            history.push('/auth')
        }
    }, [history, setUserData])

    // MAIN ROUTE
	const getRoutes = (routes) => {
		return routes.map((data, key) => {
			if (data.layout === "/admin") {
				return (
					<Route path={data.layout + data.path} component={data.component} key={key} />
				);
			} else {
				return null;
			}
		});
	}

    const handleRefresh = () => {
        history.push('/')
        window.location.reload()
    }

    return (
        <div className='background'>
            <img className='img-background' src={wllps[Math.floor(Math.random() * 2)]} alt="" />
            <div className='dash-content'>
                <Switch>
                    {getRoutes(routes)}
                    <Redirect from="*" to="/admin/index" />
                </Switch>
            </div>
            <div className='dash-footer'>
                <Link to='/admin/menu'>
                    <AppstoreFilled className="ic-footer"/>
                </Link>
                <Link to="/admin/data-log">
                    <TableOutlined className='ic-footer' />
                </Link>
                <Link to="/admin/export/data">
                    <ExportOutlined className='ic-footer' />
                </Link>
                <Link to="/admin/export/documentation">
                    <VideoCameraTwoTone className='ic-footer' />
                </Link>
                <div className='dash-foot-refresh' onClick={handleRefresh}></div>
            </div>
        </div>
    )
}

// const mapStateToProps = (state) => {
//     return {
//         rxState: state
//     }
// }

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setUserData}, dispatch)
}

export default connect(null, mapDispatchToProps)(Dashboard)