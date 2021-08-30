import React from 'react'
import { Drawer, Form, Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import TextArea from 'antd/lib/input/TextArea';
import { connect } from 'react-redux';


const { Option } = Select

const FormAddUser = ({onClose, onSubmit, visible, data, user}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if(data){
            form.setFieldsValue(data)
        }else{
            form.resetFields()
        }
    }, [data, form])

    const handleSubmit = () => {
        const payload = {
            nama_user: form.getFieldValue('nama_user') || "",
            username: form.getFieldValue('username') || "",
            password: form.getFieldValue('password') || "",
            alamat: form.getFieldValue('alamat') || "",
            telepon: form.getFieldValue('telepon') || "",
            status: form.getFieldValue('status') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }
        
        if(payload.username==='' || payload.password==='' || payload.status===''){
            alert('Username, Password, Status is Required')
        }else{
            onSubmit(payload)
            form.resetFields()
        }
        
    }

    const onFinishFailed = (errorInfo) => {
        alert(errorInfo)
    };

    return (
        <>
            <Drawer
                title= {data? "Update User" : "Create New User"  }
                width={360}
                placement="right"
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                forceRender
                footer={
                    <div style={{ textAlign: 'right', }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} type="submit">
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical" hideRequiredMark onSubmit={handleSubmit} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
                    <Form.Item name="nama_user" label="Full Name" rules={[{ required: true, message: 'Please enter fullname' }]}>
                        <Input placeholder="Please enter fullname" />
                    </Form.Item>
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}>
                        <Input placeholder="Please enter username" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
                        <Input placeholder="Please enter password" />
                    </Form.Item>
                    <Form.Item name="alamat" label="Address" rules={[{ message: 'Please enter address' }]}>
                        <TextArea placeholder="Please enter alamat" autoSize />
                    </Form.Item>
                    <Form.Item name="telepon" label="Phone Number" rules={[{ message: 'Please enter phone number' }]}>
                        <Input placeholder="Please enter telepon" />
                    </Form.Item>
                    {user?.status?.toLowerCase() === 'admin' &&
                    <Form.Item name="status" label="Status" rules={[{ message: 'Please choose the status' }]}>
                        <Select>
                            <Option key="Admin">ADMIN</Option>
                            <Option key="Backend">BACK-END</Option>
                        </Select>
                    </Form.Item>
                    }
                    {data &&
                    <Form.Item name="b_active" label="Active">
                        <Select>
                            <Option key="t">Active - t</Option>
                            <Option key="f">Non Active - f</Option>
                        </Select>
                    </Form.Item>}
                </Form>
            </Drawer>
        </>
    );
}

FormAddUser.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(FormAddUser)