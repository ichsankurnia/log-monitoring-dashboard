import React from 'react'
import PropTypes from 'prop-types';
import { Drawer, Form, Button, Input, Select } from 'antd';
import { useSocket } from '../../context/SocketProvider';

const { Option } = Select

const FormPerangkat = ({onClose, onSubmit, visible, data}) => {
    const [lokasi, setLokasi] = React.useState([])
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
            nama_perangkat: form.getFieldValue('nama_perangkat') || "",
            id: form.getFieldValue('id') || "",
            type: form.getFieldValue('type') || "",
            ip: form.getFieldValue('ip') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    const handleGetLokasi = () => {
        setLoading(true)
        socket.emit('request', 'lokasi_get')

        socket.on('response', (res) => {
            if(res.code === 20) {
                setLoading(false)
                setLokasi(res.data)
            }
        })
    }

    return (
        <>
            <Drawer
                title={data? "Update Device": "Create a new device"}
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
                    <Form.Item name="nama_perangkat" label="Device Name" rules={[{ required: true, message: 'Please enter device name' }]}>
                        <Input placeholder="Please enter device name" />
                    </Form.Item>
                    <Form.Item name="id" label="Device ID" rules={[{ required: false }]}>
                        <Input placeholder="Please enter device id"/>
                    </Form.Item>
                    <Form.Item name="type" label="Device Type" rules={[{ required: false }]}>
                        <Input placeholder="Please enter device type" />
                    </Form.Item>
                    <Form.Item name="ip" label="Location">
                        <Select loading={loading} onFocus={handleGetLokasi}>
                        {lokasi.map(data => (
                            <Option key={data.ip}>{data.nama_stasiun}</Option>
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

FormPerangkat.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormPerangkat