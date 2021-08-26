import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Form, Input, Button, Spin } from 'antd';
import {LoadingOutlined, TagsFilled} from '@ant-design/icons';
// import { Link } from 'react-router-dom';
import { authLogin } from '../api';
import moment from 'moment';
import { useSocket } from '../context/SocketProvider';


const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

const queryStrImg = 'image_type=photo&orientation=horizontal&category=backgrounds,nature,science,education,health,places,animals,industry,computer,food,sports,transportation,travel,buildings,business,music&pretty=true'


const Login = () => {
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(10)
    const [imgSource, setImgSource] = useState(null)
    const [apiKey, setApiKey] = useState('22810263-e572b6b0ebfab66c30ba7d497')
    
    const interval = useRef(null)
    const history = useHistory()
    const socket = useSocket()
    
    useEffect(() => {

        if(socket){
            socket.emit('request', 'common_apikey')
    
            socket.on('response', res => {
                console.log(res)
                if(res.code === 80){
                    setApiKey(res.data.apiKey || '22810263-e572b6b0ebfab66c30ba7d497')
                }
            })
        }

        const page = Math.floor(Math.random() * 100) + 1
        const index = Math.floor(Math.random() * 5)

        const order = ["popular", "latest"]
        const indexOrder = Math.floor(Math.random() * 2)

        axios.get(`https://pixabay.com/api/?key=${apiKey}&${queryStrImg}&order=${order[indexOrder]}&page=${page}&per_page=5`)
        .then((res) => {
            console.log(res)
            setImgSource(res.data.hits[index])
        }).catch((err) => {
            console.log(err)
        })

        return () => {
            if(socket) socket.off('response')
        }

    }, [socket, apiKey])

    useEffect(() => {
        interval.current = setInterval(() => {
            if(count > 0){
                setCount(count - 1)
            }else{
                const page = Math.floor(Math.random() * 100) + 1
                const index = Math.floor(Math.random() * 5)
                
                const order = ["popular", "latest"]
                const indexOrder = Math.floor(Math.random() * 2)
                console.log(order[indexOrder], page, index)

                axios.get(`https://pixabay.com/api/?key=${apiKey}&${queryStrImg}&order=${order[indexOrder]}&page=${page}&per_page=5`)
                .then((res) => {
                    console.log(res)
                    setImgSource(res.data.hits[index])
                }).catch((err) => {
                    console.log(err)
                })
                setCount(10)
            }
        }, 1000)

        return () => {
            clearInterval(interval.current)
        }

    }, [count, apiKey])

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
            <div className='background' >
                <img className='img-background' src={imgSource?.largeImageURL} alt="" />
                <p className='img-tags'><TagsFilled /> {imgSource?.tags}</p>
                <div className='date-spotlight'>
                    <label style={{fontSize: 105, marginBottom: -40}}>{moment().locale('en').format('HH:mm')}</label>
                    <label style={{fontSize: 60}}>{moment().locale('en').format('dddd, MMMM DD')}</label>
                </div>
                <Form style={{width: '350px'}} layout="vertical" requiredMark={false}
                    name="basic" initialValues={{ remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item label={<label style={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>Username</label>} name="username"
                        rules={[ { required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder='Enter your username' />
                    </Form.Item>
                    <Form.Item label={<label style={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>Password</label>} name="password"
                        rules={[{ required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password placeholder='Enter your password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: '100%', height: 40, marginTop: 10, borderRadius: 5}}>
                            {/* <Link to="/">Submit</Link> */}
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default Login