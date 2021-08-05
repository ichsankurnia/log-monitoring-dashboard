import { Breadcrumb, Layout } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { authLogout } from '../api';
import Sidebar from '../components/Sidebar';
import { setUserData } from '../redux/action/actions';
import routes from '../routes';

const { Header, Footer, Sider, Content } = Layout;

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

    return (
            <Layout style={{height: '100vh', overflow: 'hidden'}}>
            {/* <Layout> */}
                <Header style={{padding: 10}}>
                    <Avatar style={{float: 'right'}} icon="user" />
                    <Title style={{color: 'white'}} level={3}>Log Monitoring Apps</Title>
                </Header>
                <Layout>
                    <Sider>
                        <Sidebar />
                    </Sider>
                    <Layout>
                        <Content style={{ padding: '0 50px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{background: '#fff', height: '90vh'}}>
                                <Switch>
                                    {getRoutes(routes)}
                                    <Redirect from="*" to="/admin/index" />
                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center', height: '9vh'}}>Ant Design ©2021 Created by ichsankurnia</Footer>
                    </Layout>
                </Layout>
            </Layout>
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