import { Form, Input, Button } from 'antd';
import Layout from 'antd/lib/layout/layout';
import { useHistory, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const Login = () => {
    const history = useHistory()
    
    const onFinish = (values) => {
        console.log('Success:', values);
        history.push('/')
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Layout style={{height: '100vh', backgroundColor: 'gray'}}>
            <Form style={{width: '350px', margin: 'auto'}} layout="vertical" 
                name="basic" initialValues={{ remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item label={<label style={{ color: "white", fontWeight: 500, fontSize: 16 }}>Username</label>} name="username"
                    rules={[ 
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={<label style={{ color: "white", fontWeight: 500, fontSize: 16 }}>Password</label>} name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: '100%', height: 40, marginTop: 10}}>
                        <Link to="/">Submit</Link>
                    </Button>
                </Form.Item>
            </Form>
        </Layout>
    );
}

export default Login