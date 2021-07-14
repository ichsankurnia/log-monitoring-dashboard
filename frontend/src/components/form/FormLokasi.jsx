import React from 'react'
import { Drawer, Form, Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { useSocket } from '../../context/SocketProvider';

const { Option } = Select

const FormLokasi = ({onClose, onSubmit, visible, data}) => {
    const [projek, setProjek] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form] = Form.useForm();
    const socket = useSocket()

    React.useEffect(() => {
        if(data){
            form.setFieldsValue(data)
        }else{
            form.resetFields()
        }

        // return () => {
        //     if(socket) socket.off('response')
        // }
    }, [data, form, socket])

    const handleSubmit = () => {
        const payload = {
            ip: form.getFieldValue('ip') || "",
            nama_stasiun: form.getFieldValue('nama_stasiun') || "",
            no_projek: form.getFieldValue('no_projek') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    const handleGetProjek = () => {
        setLoading(true)
        socket.emit('request', 'projek_get')

        socket.on('response', (res) => {
            if(res.code === 10) {
                setLoading(false)
                setProjek(res.data)
            }
        })
    }

    return (
        <>
            <Drawer
                title="Create a new location / station"
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
                <Form form={form} layout="vertical" hideRequiredMark>
                    <Form.Item name="ip" label="IP" rules={[{ required: true, message: 'Please enter ip address location' }]}>
                        <Input placeholder="Please enter ip address location" readOnly={data? true : false} />
                    </Form.Item>
                    <Form.Item name="nama_stasiun" label="Location / Station Name" rules={[{ required: true, message: 'Please enter location name' }]}>
                        <Input placeholder="Please enter location name" />
                    </Form.Item>
                    <Form.Item name="no_projek" label="Projek">
                        <Select loading={loading} onFocus={handleGetProjek}>
                        {projek.map(data => (
                            <Option key={data.no_projek}>{data.nama_projek}</Option>
                        ))}
                        </Select>
                    </Form.Item>
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

FormLokasi.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormLokasi