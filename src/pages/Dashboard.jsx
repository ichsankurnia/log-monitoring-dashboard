import { Breadcrumb, Layout } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import Sidebar from '../components/Sidebar';

const { Header, Footer, Sider, Content } = Layout;

const Dashboard = () => {

    return (
        <div>
            <Layout style={{height: '100vh', overflow: 'hidden'}}>
            {/* <Layout> */}
                <Header style={{padding: 10}}>
                    <Avatar style={{float: 'right'}} icon="user" />
                    <Title style={{color: 'white'}} level={3}>Log Apps Monitoring</Title>
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
                            <div style={{background: '#fff', padding: 24, minHeight: '75vh'}}>Content</div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Ant Design ©2021 Created by ichsankurnia</Footer>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export default Dashboard