import { Breadcrumb, Layout } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import { Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import routes from '../routes';

const { Header, Footer, Sider, Content } = Layout;

const Dashboard = () => {

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

export default Dashboard