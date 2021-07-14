import React from 'react'
import { Drawer, Form, Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';


const { Option } = Select

const FormPart = ({onClose, onSubmit, visible, data}) => {
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
            nama_perangkat: form.getFieldValue('nama_perangkat') || "",
            jenis: form.getFieldValue('jenis') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    return (
        <>
            <Drawer
                title="Create a new part"
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
                    <Form.Item name="jenis" label="Type" rules={[{ required: true, message: 'Please enter type part' }]} >
                        <Select>
                            <Option key="Vending Machine">Vending Machine</Option>
                            <Option key="E-Ticketing">E-Ticketing</Option>
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

FormPart.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormPart