import { Form, Input, Button, Spin } from 'antd';
import Layout from 'antd/lib/layout/layout';
import { useHistory } from 'react-router';
// import { Link } from 'react-router-dom';
import { authLogin } from '../api';
import {LoadingOutlined} from '@ant-design/icons';
import { useState } from 'react';

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

const Login = () => {
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    
    const onFinish = async (values) => {
        setLoading(true)
        console.log('Success:', values);
        const res = await authLogin(values)
        
        console.log('login :', res)
        setLoading(false)
        if(res.data){
            if(res.data.code === 0) {
                localStorage.setItem('authToken', res.data.token)
                history.push('/')
            }
            else alert(res.data.message)
        }else{
            alert(res.message)
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <Spin spinning={loading} indicator={loader} size='large'>
            <Layout style={{height: '100vh'}} >
                <Form style={{width: '350px', margin: 'auto'}} layout="vertical" requiredMark={false}
                    name="basic" initialValues={{ remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item label={<label style={{ color: "#555", fontWeight: 500, fontSize: 16 }}>Username</label>} name="username"
                        rules={[ { required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label={<label style={{ color: "#555", fontWeight: 500, fontSize: 16 }}>Password</label>} name="password"
                        rules={[{ required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: '100%', height: 40, marginTop: 10, borderRadius: 5}}>
                            {/* <Link to="/">Submit</Link> */}
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        </Spin>
    );
}

export default Login