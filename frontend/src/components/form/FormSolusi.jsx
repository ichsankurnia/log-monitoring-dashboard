import React from 'react'
import PropTypes from 'prop-types';
import { Drawer, Form, Button, Input, Select } from 'antd';
import { useSocket } from '../../context/SocketProvider';

const { Option } = Select

const FormSolusi = ({onClose, onSubmit, visible, data}) => {
    const [penyebab, setPenyebab] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form] = Form.useForm();
    const socket = useSocket()

    React.useEffect(() => {
        if(data){
            form.setFieldsValue(data)
        }else{
            form.resetFields()
        }

    }, [data, form, socket])

    const handleSubmit = () => {
        const payload = {
            nama_solusi: form.getFieldValue('nama_solusi') || "",
            no_penyebab: form.getFieldValue('no_penyebab') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    const handleGetPart = () => {
        setLoading(true)
        socket.emit('request', 'penyebab_get')

        socket.on('response', (res) => {
            if(res.code === 50) {
                setLoading(false)
                setPenyebab(res.data)
            }
        })
    }

    return (
        <>
            <Drawer
                title={data? "Update Solution" : "Create a new solution"}
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
                    <Form.Item name="nama_solusi" label="Solution" rules={[{ required: true, message: 'Please enter the solution' }]}>
                        <Input placeholder="Please enter the solution" />
                    </Form.Item>
                    <Form.Item name="no_penyebab" label="Cause">
                        <Select loading={loading} onFocus={handleGetPart}
                            placeholder="ex: Human Error" showSearch optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                        {penyebab.map(data => (
                            <Option key={data.no_penyebab}>{data.penyebab}</Option>
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

FormSolusi.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormSolusi