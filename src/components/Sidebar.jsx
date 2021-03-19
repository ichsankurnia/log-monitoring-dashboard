import React, {Component} from 'react'
import { Menu } from 'antd';
import {
    AimOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    BugOutlined,
    CheckCircleOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    ExportOutlined,
    FieldBinaryOutlined,
    FundProjectionScreenOutlined,
    GoldOutlined,
    LogoutOutlined,
    MenuOutlined,
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

import SubMenu from 'antd/lib/menu/SubMenu';


class Sidebar extends Component {
    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    handleClick = e => {
        console.log('click ', e);
    };

    render() {
        return (
            <Menu
                onClick={this.handleClick}
                defaultOpenKeys={['sub2']}
                defaultSelectedKeys={['log']}
                mode="inline"
            >
                <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    Dashboard
                </Menu.Item>
                <SubMenu key="admin" icon={<MenuOutlined />} title="Admin Configuration">
                    <Menu.Item key="user" icon={<UserOutlined />}>Data User</Menu.Item>
                    <Menu.ItemGroup key="g1" title="Item 1">
                        <Menu.Item key="1" icon={<SettingOutlined />}>Data Perangkat</Menu.Item>
                        <Menu.Item key="2" icon={<GoldOutlined />}>Data Part</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g2" title="Item 2">
                        <Menu.Item key="3" icon={<BugOutlined />}>Data Penyebab</Menu.Item>
                        <Menu.Item key="4" icon={<CheckCircleOutlined />}>Data Solusi</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g3" title="Item 3">
                        <Menu.Item key="3" icon={<FundProjectionScreenOutlined />}>Data Project</Menu.Item>
                        <Menu.Item key="4" icon={<AimOutlined />}>Data Lokasi</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
                <SubMenu key="log" icon={<AppstoreOutlined />} title="Data Log">
                    <Menu.Item key="log" icon={<DatabaseOutlined />}>Log</Menu.Item>
                    <SubMenu key="export" title="Export" icon={<ExportOutlined />}>
                        <Menu.Item key="expDocumentation" icon={<VideoCameraOutlined />}>Dokumentasi</Menu.Item>
                        <Menu.Item key="expData" icon={<ExportOutlined />}>Export Data</Menu.Item>
                        <Menu.Item key="expCountData" icon={<FieldBinaryOutlined />}>Count Data</Menu.Item>
                    </SubMenu>
                    <SubMenu key="chart" title="Chart" icon={<BarChartOutlined />}>
                        <Menu.Item key="byPerangkat">By Perangkat</Menu.Item>
                        <Menu.Item key="byPenyebab">By Penyebab</Menu.Item>
                        <Menu.Item key="perPerangkat">Per Perangkat</Menu.Item>
                    </SubMenu>
                </SubMenu>
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
            </Menu>
        // return (
        //     <div style={{ width: '25%' }}>
        //         <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
        //             {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        //         </Button>
        //         <Menu
        //             defaultSelectedKeys={['1']}
        //             defaultOpenKeys={['sub1']}
        //             mode="inline"
        //             theme="dark"
        //             inlineCollapsed={this.state.collapsed}
        //             >
        //             <Menu.Item key="1" icon={<PieChartOutlined />}>
        //                 Option 1
        //             </Menu.Item>
        //             <Menu.Item key="2" icon={<DesktopOutlined />}>
        //                 Option 2
        //             </Menu.Item>
        //             <Menu.Item key="3" icon={<ContainerOutlined />}>
        //                 Option 3
        //             </Menu.Item>
        //             <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
        //                 <Menu.Item key="5">Option 5</Menu.Item>
        //                 <Menu.Item key="6">Option 6</Menu.Item>
        //                 <Menu.Item key="7">Option 7</Menu.Item>
        //                 <Menu.Item key="8">Option 8</Menu.Item>
        //             </SubMenu>
        //             <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
        //                 <Menu.Item key="9">Option 9</Menu.Item>
        //                 <Menu.Item key="10">Option 10</Menu.Item>
        //                 <SubMenu key="sub3" title="Submenu">
        //                     <Menu.Item key="11">Option 11</Menu.Item>
        //                     <Menu.Item key="12">Option 12</Menu.Item>
        //                 </SubMenu>
        //             </SubMenu>
        //         </Menu>
        //     </div>
        );
    }
}

export default Sidebar