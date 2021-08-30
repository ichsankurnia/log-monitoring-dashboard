import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import moment from 'moment';
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';

// import { ExportOutlined, VideoCameraTwoTone, AppstoreFilled, TableOutlined } from '@ant-design/icons';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import VideoCameraTwoTone from '@ant-design/icons/VideoCameraTwoTone';
import AppstoreFilled from '@ant-design/icons/AppstoreFilled';
import TableOutlined from '@ant-design/icons/TableOutlined';


import routes from '../routes';
import { authLogout } from '../api';
import { setUserData } from '../redux/action/actions';

import wallDark from '../assets/img/win11-wall-dark.jpg'
import wallLight from '../assets/img/win11-wall-light.jpg'
import wall1 from '../assets/img/wall1.jpg'
import wall2 from '../assets/img/wall2.jpg'
import wall3 from '../assets/img/wall3.jpg'
import wall4 from '../assets/img/wall4.jpg'
import wall5 from '../assets/img/wall5.jpg'
import wall6 from '../assets/img/wall6.jpg'


const wllps = [wallDark, wallLight, wall1, wall2, wall3, wall4, wall5, wall6]

const Dashboard = ({setUserData}) => {
    const [count, setCount] = useState(10)
    const [indexWall, setIndexWall] = useState(0)
    const history = useHistory()

    const wallInterval = useRef(null)

    useEffect(() => {
        wallInterval.current = setInterval(() => {
            if(count > 0){
                setCount(count - 1)
            }else{
                setCount(10)
                const random = Math.floor(Math.random() * 8)
                setIndexWall(random)
            }
        }, 1000);

        return () => {
            clearInterval(wallInterval.current)
        }
    })

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
            <img className='img-background' src={wllps[indexWall]} alt="" />
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
                <p className='dash-foot-clock'>{moment().format('HH:mm')}</p>
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