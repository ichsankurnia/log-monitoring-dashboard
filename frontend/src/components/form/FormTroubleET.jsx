import React from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import SocketContext from '../../context/SocketProvider';

const { Option } = Select;

const datetimeFormat = 'yyyy-MM-DD HH:mm:ss'
const GMTFormat = 'ddd MMM DD YYYY HH:mm:ss GMT+0700'

const ticketType = [
    'PERMASALAHAN',
    'ADUAN',
    'PEKERJAAN'
]

let socket = null

class FormTroubleET extends React.Component {
    static contextType = SocketContext
    
    constructor(props){
        super(props)
        
        this.state = {
            projek: [],
            lokasi: [],
            perangkat: [],
            part: [],
            penyebab: [],
            solusi: [],
            jenisLaporan: "",
            loading: false
        }

        this.formRef = React.createRef();
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            this.handleSocketEvent()
        }else{
            this.toReconSocket = setTimeout(() => {
                this.componentDidMount()
            }, 1000);
        }

        const { data } = this.props

        if(data){
            this.formRef.current.setFieldsValue(data)
            this.formRef.current.setFieldsValue({downtime: this.getDowntimeMoment(data.tanggal_masalah, data.jam_masalah, data.tanggal_done, data.jam_done)})
            this.setState({jenisLaporan: data.jenislaporan})
        }else{
            this.formRef.current.resetFields()
        }
    }

    componentWillUnmount(){
        clearTimeout(this.toReconSocket)
        socket.off('response')
        socket = null
    }

    handleSocketEvent = () => {
        if(socket){
            socket.on('response', res => {
                console.log(res)
                if(res.code === 78){
                    const downtime = this.formRef.current.getFieldValue('downtime')
                    let payload = this.formRef.current.getFieldsValue()

                    payload['tanggal_masalah'] = moment(downtime[0].toString(), GMTFormat).format('yyyy-MM-DD')
                    payload['jam_masalah'] = moment(downtime[0].toString(), GMTFormat).format('HH:mm:ss')
                    payload['tanggal_done'] = moment(downtime[1].toString(), GMTFormat).format('yyyy-MM-DD')
                    payload['jam_done'] = moment(downtime[1].toString(), GMTFormat).format('HH:mm:ss')
                    payload['totaldowntime'] = res.data.downtime
                    payload['no_user'] = 2

                    Object.keys(payload).forEach(key => {
                        if(payload[key] === undefined || payload[key] === null){
                            delete payload[key]
                        }
                    })
                    
                    delete payload.downtime
                    delete payload.no

                    console.log(payload)
                    
                    this.props.onSubmit(this.formRef.current.getFieldValue('no'), payload)
                    
                    if(this.formRef.current){
                        this.formRef.current.resetFields()
                    }
                }else if(res.code === 77){
                    this.formRef.current.setFieldsValue({'no': moment().format('yyyyMMDD') + res.data.ticket_number})
                }else if(res.code === 10){
                    this.setState({projek: res.data, loading: false})
                }else if(res.code === 20){
                    this.setState({lokasi: res.data.filter(data => data.no_projek === this.formRef.current.getFieldValue('no_projek')), loading: false})
                }else if(res.code === 30){
                    this.setState({perangkat: res.data.filter(data => data.ip === this.formRef.current.getFieldValue('ip')), loading: false})
                }else if(res.code === 40){
                    this.setState({part: res.data, loading: false})
                }else if(res.code === 50){
                    this.setState({penyebab: res.data.filter(data => data.no_pvm === this.formRef.current.getFieldValue('no_pvm')), loading: false})
                }else if(res.code === 60){
                    this.setState({solusi: res.data.filter(data => data.no_penyebab === this.formRef.current.getFieldValue('no_penyebab')), loading: false})
                }
            })
        }
    }

    
    handleSubmit = () => {
        if(this.validateInput()){
            const downtime = this.formRef.current.getFieldValue('downtime')
            const startDate = moment(downtime[0].toString(), GMTFormat).format(datetimeFormat)
            const endDate = moment(downtime[1].toString(), GMTFormat).format(datetimeFormat)

            socket.emit('request', `troubleET_downtime_${endDate}_${startDate}`)
        }
    }

    validateInput = () => {
        const downtime = this.formRef.current.getFieldValue('downtime')
        const ticketNumber = this.formRef.current.getFieldValue('no')
        const ticketKind = this.formRef.current.getFieldValue('jenislaporan')
        const location = this.formRef.current.getFieldValue('ip')
        const device = this.formRef.current.getFieldValue('no_perangkat')
        const status = this.formRef.current.getFieldValue('status')

        if(!ticketNumber){
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
        }else if(!device) {
            alert("Device is required")
            return false
        }else if(!status) {
            alert("Status is required")
            return false
        }
        
        return true
    }


    handleGetItem = (type) => {
        this.setState({loading: true})
        socket.emit('request', `${type}_get`)
    }

    onSelectJenisLaporan = () => {
        this.setState({jenisLaporan: this.formRef.current.getFieldValue('jenislaporan')})
    }

    onSelectProjek = () => {
        socket.emit('request', `troubleET_noticket_${this.formRef.current.getFieldValue('no_projek')}`)
    }

    getDowntimeMoment = (startDate, startTime, endDate, endTime) => {
        const tanggalMasalah = moment(startDate, moment(startDate).creationData().format).format('yyyy-MM-DD')
        const tanggalDone = moment(endDate, moment(endDate).creationData().format).format('yyyy-MM-DD')

        const downtime = [moment(`${tanggalMasalah} ${startTime}`, datetimeFormat), moment(`${tanggalDone} ${endTime}`, datetimeFormat)]
        return downtime
    }

    render(){
        const { onClose, data } = this.props
        const { projek, lokasi, perangkat, part, penyebab, solusi, jenisLaporan, loading } = this.state

        return (
            <>
                <Drawer
                    title="Create a new ticket"
                    width={720}
                    onClose={onClose}
                    visible={true}
                    bodyStyle={{ paddingBottom: 80 }}
                    forceRender
                    footer={
                        <div style={{ textAlign: 'right', }}>
                            <Button onClick={onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmit} type="submit">
                                Submit
                            </Button>
                        </div>
                    }
                >
                <Form ref={this.formRef} layout="vertical" hideRequiredMark>
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
                            {data?
                                <Input readOnly />
                            :
                                <Select placeholder='Please choose ticket kind' onSelect={this.onSelectJenisLaporan}>
                                    {ticketType.map(data => (
                                        <Option key={data}>{data}</Option>
                                    ))}
                                </Select>
                            }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="no_projek" label="Projek" rules={[{ required: true, message: 'Please choose the projek' }]}>
                            {data?
                                <Input readOnly />
                            :
                                <Select loading={loading} onFocus={() => this.handleGetItem('projek')} onSelect={this.onSelectProjek}>
                                {projek.map(data => (
                                    <Option key={data.no_projek}>{data.nama_projek}</Option>
                                ))}
                                </Select>
                            }
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ip" label="Location" rules={[{ required: true, message: 'Please choose the location' }]} >
                            {data?
                                <Input readOnly />
                            :
                                <Select loading={loading} onFocus={() => this.handleGetItem('lokasi')}>
                                {lokasi.map(data => (
                                    <Option key={data.ip}>{data.nama_stasiun}</Option>
                                ))}
                                </Select>
                            }
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="no_perangkat" label="Device">
                                <Select loading={loading} onFocus={() => this.handleGetItem('perangkat')}>
                                {perangkat.map(data => (
                                    <Option key={data.no_perangkat}>{data.nama_perangkat}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                        {jenisLaporan?.toLocaleLowerCase() === 'permasalahan' &&
                            <Form.Item name="no_pvm" label="Part" >
                                <Select loading={loading} onFocus={() => this.handleGetItem('part')}>
                                {part.map(data => (
                                    <Option key={data.no_pvm}>{data.nama_perangkat}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                        }
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={jenisLaporan?.toLocaleLowerCase() === 'permasalahan'? 8 : 12}>
                            <Form.Item name="problem" label="Problem">
                                <Input placeholder="Please enter the problem" />
                            </Form.Item>
                        </Col>
                        {jenisLaporan?.toLocaleLowerCase() === 'permasalahan' &&
                        <Col span={8}>
                            <Form.Item name="no_penyebab" label="Cause">
                                <Select loading={loading} onFocus={() => this.handleGetItem('penyebab')}>
                                {penyebab.map(data => (
                                    <Option key={data.no_penyebab}>{data.penyebab}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        }
                        <Col span={jenisLaporan?.toLocaleLowerCase() === 'permasalahan'? 8 : 12}>
                            <Form.Item name="nama_solusi" label="Solution" >
                            {jenisLaporan?.toLocaleLowerCase() === 'permasalahan'?
                                <Select loading={loading} onFocus={() => this.handleGetItem('solusi')}>
                                {solusi.map(data => (
                                    <Option key={data.nama_solusi}>{data.nama_solusi}</Option>
                                ))}
                                </Select>
                                :
                                <Input placeholder='Please enter the solution' />
                            }
                        </Form.Item>
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
    
}

FormTroubleET.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default FormTroubleET