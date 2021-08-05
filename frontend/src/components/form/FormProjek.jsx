import React from 'react'
import { Drawer, Form, Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';


const { Option } = Select

const FormProjek = ({onClose, onSubmit, visible, data}) => {
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
            nama_projek: form.getFieldValue('nama_projek') || "",
            initial: form.getFieldValue('initial') || "",
            b_active: form.getFieldValue('b_active') || "t"
        }

        onSubmit(payload)
        form.resetFields()
    }

    return (
        <>
            <Drawer
                title={data? "Update Project" : "Create a new project"}
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
                    <Form.Item name="nama_projek" label="Project Name" rules={[{ required: true, message: 'Please enter project name' }]}>
                        <Input /* value={name || ""} onChange={e => setName(e.target.value)} */ placeholder="Please enter project name" />
                    </Form.Item>
                    <Form.Item name="initial" label="Project Code" rules={[{ required: true, message: 'Please enter project code' }]} >
                        <Input /* value={initial || ""} onChange={e => setInital(e.target.value)} */ placeholder="Please enter project code" />
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

FormProjek.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormProjek