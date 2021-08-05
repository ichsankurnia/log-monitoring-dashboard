import React from 'react'
import { Drawer, Form, Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { useSocket } from '../../context/SocketProvider';

const { Option } = Select

const categories = [
    'Application System',
    'Hardware System',
    'Web & Reporting',
    'Installation',
    'Human Resource',
    'Maintenance System',
    'AFC Ticketing System',
    'Migration System',
    'Other'
]

const FormPenyebab = ({onClose, onSubmit, visible, data}) => {
    const [part, setpart] = React.useState([])
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
            penyebab: form.getFieldValue('penyebab') || "",
            kategori: form.getFieldValue('kategori') || "",
            no_pvm: form.getFieldValue('no_pvm') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    const handleGetPart = () => {
        setLoading(true)
        socket.emit('request', 'part_get')

        socket.on('response', (res) => {
            if(res.code === 40) {
                setLoading(false)
                setpart(res.data)
            }
        })
    }

    return (
        <>
            <Drawer
                title={data? "Update Cause" : "Create a new cause"}
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
                    <Form.Item name="penyebab" label="Cause" rules={[{ required: true, message: 'Please enter the cause' }]}>
                        <Input placeholder="Please enter the cause" />
                    </Form.Item>
                    <Form.Item name="kategori" label="Categories">
                        <Select>
                        {categories.map(data => (
                            <Option key={data}>{data}</Option>

                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="no_pvm" label="Part / Device">
                        <Select loading={loading} onFocus={handleGetPart}>
                        {part.map(data => (
                            <Option key={data.no_pvm}>{data.nama_perangkat}</Option>
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

FormPenyebab.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormPenyebab