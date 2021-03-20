import { Breadcrumb, Layout } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import routes from '../routes';

const { Header, Footer, Sider, Content } = Layout;

const Dashboard = () => {

    return (
        <BrowserRouter>
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
                            <div style={{background: '#fff', padding: 24, minHeight: '75vh'}}>
                                <Switch>
                                    {routes.map((route, index) => (
                                        <Route 
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        component={route.component}
                                        />
                                        ))}
                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Ant Design ©2021 Created by ichsankurnia</Footer>
                    </Layout>
                </Layout>
            </Layout>
        </BrowserRouter>
    )
}

export default Dashboard