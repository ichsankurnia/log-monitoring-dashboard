import React from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSocket } from '../../context/SocketProvider';

const { Option } = Select;

const datetimeFormat = 'yyyy-MM-DD HH:mm:ss'
const GMTFormat = 'ddd MMM DD YYYY HH:mm:ss GMT+0700'

const ticketType = [
    'PERMASALAHAN',
    'ADUAN',
    'PEKERJAAN'
]

const FormTroubleET = ({onClose, onSubmit, visible, data}) => {
    const [projek, setProjek] = React.useState([])
    const [lokasi, setLokasi] = React.useState([])
    const [perangkat, setPerangkat] = React.useState([])
    const [part, setPart] = React.useState([])
    const [penyebab, setPenyebab] = React.useState([])
    const [solusi, setSolusi] = React.useState([])
    const [jenisLaporan, setJenisLaporan] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const [form] = Form.useForm()
    const socket = useSocket()

    const handleSocketEvent = React.useCallback(() => {
        if(socket){
            socket.on('response', res => {
                console.log(res)
                if(res.code === 78){

                }else if(res.code === 77){
                    form.setFieldsValue({'no': moment().format('yyyyMMDD') + res.data.ticket_number})
                }else if(res.code === 10){
                    setProjek(res.data)
                    setLoading(false)
                }else if(res.code === 20){
                    setLokasi(res.data.filter(data => data.no_projek === form.getFieldValue('no_projek')))
                    setLoading(false)
                }else if(res.code === 30){
                    setPerangkat(res.data.filter(data => data.ip === form.getFieldValue('ip')))
                    setLoading(false)
                }else if(res.code === 40){
                    setPart(res.data)
                    setLoading(false)
                }else if(res.code === 50){
                    setPenyebab(res.data.filter(data => data.no_pvm === form.getFieldValue('no_pvm')))
                    setLoading(false)
                }else if(res.code === 60){
                    setSolusi(res.data.filter((data => data.no_penyebab === form.getFieldValue('no_penyebab'))))
                    setLoading(false)
                }
            })
        }
    }, [socket, form])

    React.useEffect(() => {
        handleSocketEvent()
    }, [handleSocketEvent])
    
    const handleSubmit = () => {
        const downtime = form.getFieldValue('downtime')
        const ticketKind = form.getFieldValue('jenislaporan')
        const ticketNumber = form.getFieldValue('no')
        const ipLocation = form.getFieldValue('ip')
        if(validateInput(ticketNumber, downtime, ticketKind, ipLocation)){
            const startDate = moment(downtime[0].toString(), GMTFormat).format(datetimeFormat)
            const endDate = moment(downtime[1].toString(), GMTFormat).format(datetimeFormat)
            handleGetDowntime(endDate, startDate)
            console.log(form.getFieldsValue())
            form.resetFields()
        }
    }

    const validateInput = (ticketNum, downtime, ticketKind, location) => {
        if(!ticketNum){
            alert("Ticket ID is empty or fail to set ticket ID")
            return false
        }else if(!downtime){
            alert("Downtime Start End date is required")
            return false
        }else if(!ticketKind){
            alert("ticket kind is required")
            return false
        }else if(!location) {
            alert("Location is required")
            return false
        }
        return true
    }

    const handleGetDowntime = (endDate, startDate) => {
        socket.emit('request', `troubleET_downtime_${endDate}_${startDate}`)
    }

    const handleGetItem = (type) => {
        setLoading(true)
        socket.emit('request', `${type}_get`)
    }

    const onSelectJenisLaporan = () => {
        setJenisLaporan(form.getFieldValue('jenislaporan'))
    }

    const onSelectProjek = () => {
        socket.emit('request', `troubleET_noticket_${form.getFieldValue('no_projek')}`)
    }

    
    return (
        <>
            <Drawer
                title="Create a new account"
                width={720}
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
                <Form.Item name="downtime" label="Downtime" rules={[{ required: true, message: 'Please choose downtime range' }]}>
                    <DatePicker.RangePicker
                        showTime={{
                            // hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format={datetimeFormat}
                    />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="no" label="Ticket ID" rules={[{ required: true, message: 'Please enter ticket id' }]}>
                            <Input placeholder="Ticket ID auto fill after select projek" readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="jenislaporan" label="Ticket Kind" rules={[{ required: true, message: 'Please choose ticket kind' }]} >
                            <Select placeholder='Please choose ticket kind' onSelect={onSelectJenisLaporan}>
                                {ticketType.map(data => (
                                    <Option key={data}>{data}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                    {data?
                        <Form.Item name="no_projek" label="Projek" rules={[{ required: true, message: 'Please choose the projek' }]}>
                            <Input readOnly />
                        </Form.Item>
                        :
                        <Form.Item name="no_projek" label="Projek" rules={[{ required: true, message: 'Please choose the projek' }]}>
                            <Select loading={loading} onFocus={() => handleGetItem('projek')} onSelect={onSelectProjek}>
                            {projek.map(data => (
                                <Option key={data.no_projek}>{data.nama_projek}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    }
                    </Col>
                    <Col span={12}>
                    {data?
                        <Form.Item name="ip" label="Location" rules={[{ required: true, message: 'Please choose the location' }]} >
                            <Input readOnly />
                        </Form.Item>
                        :
                        <Form.Item name="ip" label="Location" rules={[{ required: true, message: 'Please choose the location' }]} >
                            <Select loading={loading} onFocus={() => handleGetItem('lokasi')}>
                            {lokasi.map(data => (
                                <Option key={data.ip}>{data.nama_stasiun}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    }
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="no_perangkat" label="Device">
                            <Select loading={loading} onFocus={() => handleGetItem('perangkat')}>
                            {perangkat.map(data => (
                                <Option key={data.no_perangkat}>{data.nama_perangkat}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    {jenisLaporan.toLocaleLowerCase() === 'permasalahan' &&
                        <Form.Item name="no_pvm" label="Part" >
                            <Select loading={loading} onFocus={() => handleGetItem('part')}>
                            {part.map(data => (
                                <Option key={data.no_pvm}>{data.nama_perangkat}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    }
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={jenisLaporan.toLocaleLowerCase() === 'permasalahan'? 8 : 24}>
                        <Form.Item name="problem" label="Problem">
                            <Input placeholder="Please enter the problem" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                    {jenisLaporan.toLocaleLowerCase() === 'permasalahan' &&
                        <Form.Item name="no_penyebab" label="Cause">
                            <Select loading={loading} onFocus={() => handleGetItem('penyebab')}>
                            {penyebab.map(data => (
                                <Option key={data.no_penyebab}>{data.penyebab}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    }
                    </Col>
                    <Col span={8}>
                    {jenisLaporan.toLocaleLowerCase() === 'permasalahan' &&
                        <Form.Item name="nama_solusi" label="Solution" >
                            <Select loading={loading} onFocus={() => handleGetItem('solusi')}>
                            {solusi.map(data => (
                                <Option key={data.nama_solusi}>{data.nama_solusi}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    }
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="sumber" label="Source">
                            <Input placeholder="Please enter source of complaint" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="refnotrouble" label="Ref Num Complaint">
                            <Input placeholder="Please enter ref number complaint" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="teknisi" label="Technician" >
                            <Input placeholder="Please enter the technician" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="arah_gate" label="Gate Direction">
                            <Select placeholder="Please enter gate direction if available">
                                <Option key={null}>-</Option>
                                <Option key="IN">IN</Option>
                                <Option key="OUT">OUT</Option>
                                <Option key="IN OUT">IN OUT</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Status">
                            <Select placeholder="Please enter the status">
                                <Option key="Open">Open</Option>
                                <Option key="Pending">Pending</Option>
                                <Option key="Done">Done</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </Drawer>
        </>
    );
}

FormTroubleET.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormTroubleET