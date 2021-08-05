import React from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import SocketContext from '../../context/SocketProvider';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import ExportExcel from '../../helpers/ExportExcel';
import ModalSetImage from '../modal/ModalSetImage';
import Helper from '../../helpers/Helper';
import { connect } from 'react-redux';

const { Option } = Select;

const datetimeFormat = 'yyyy-MM-DD HH:mm:ss'
const GMTFormat = 'ddd MMM DD YYYY HH:mm:ss GMT+0700'

const ticketType = [
    'PERMASALAHAN',
    'ADUAN',
    'PEKERJAAN'
]

var socket = null
var picBefore = null
var picAfter = null

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
            status: "",
            loading: false,
            sendEmail: false,
            pic_before: null,
            pic_after: null,
            size_imgBefore: {w: 200, h: 200},
            size_imgafter: {w: 200, h: 200}
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
            this.setState({
                jenisLaporan: data.jenislaporan, status: data.status, 
                pic_before: Helper.getASCIIAsBase64(data.pic_before), pic_after: Helper.getASCIIAsBase64(data.pic_after)
            })
            picBefore = Helper.getASCIIAsBase64(data.pic_before)                                                                          // buffer pic before
            picAfter = Helper.getASCIIAsBase64(data.pic_after)                                                                            // buffer pic after
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
            socket.on('response', async (res) => {
                console.log(res)
                if(res.code === 78){                                                                                    // Success getDowntime
                    const downtime = this.formRef.current.getFieldValue('downtime')
                    let payload = this.formRef.current.getFieldsValue()

                    payload['tanggal_masalah'] = moment(downtime[0].toString(), GMTFormat).format('yyyy-MM-DD')
                    payload['jam_masalah'] = moment(downtime[0].toString(), GMTFormat).format('HH:mm:ss')
                    payload['tanggal_done'] = moment(downtime[1].toString(), GMTFormat).format('yyyy-MM-DD')
                    payload['jam_done'] = moment(downtime[1].toString(), GMTFormat).format('HH:mm:ss')
                    payload['totaldowntime'] = res.data.downtime
                    payload['no_user'] = 2

                    console.log(this.state.pic_before === picBefore)
                    if(this.state.pic_before !== picBefore){                                                        // if current image !== buffer imgae, update image to api
                        payload['pic_before'] = this.state.pic_before
                    }

                    if(this.state.pic_after !== picAfter){
                        payload['pic_after'] = this.state.pic_after
                    }

                    Object.keys(payload).forEach(key => {
                        if(payload[key] === undefined || payload[key] === null){
                            delete payload[key]
                        }
                    })
                    
                    delete payload.downtime
                    delete payload.no

                    let submitedData = {is_send_email: false, desc: '', file: null, data: {}}

                    if(this.state.sendEmail){
                        const part = this.state.part.filter(data => data.no_pvm === this.formRef.current.getFieldValue('no_pvm'))[0].nama_perangkat
                        const perangkat = this.state.perangkat.filter(data => data.no_perangkat === this.formRef.current.getFieldValue('no_perangkat'))[0]
                        const lokasi = this.state.lokasi.filter(data => data.ip === this.formRef.current.getFieldValue('ip'))[0].nama_stasiun

                        const dataXLS = { 
                            tanggal_masalah : payload['tanggal_masalah'], 
                            refnotrouble: payload['refnotrouble'],
                            no: this.formRef.current.getFieldValue('no'), 
                            nama_projek: this.state.projek.filter(data => data.no_projek === this.formRef.current.getFieldValue('no_projek'))[0].nama_projek,
                            nama_stasiun: lokasi, 
                            nama_perangkat: perangkat.nama_perangkat,
                            id: perangkat.id,
                            problem: payload['problem']
                        }

                        const fileXLS = await ExportExcel.exportFormAduan(this.props.user, dataXLS)

                        submitedData.is_send_email = true
                        submitedData.desc = `${part} ${perangkat.nama_perangkat} ${lokasi}`
                        submitedData.file = fileXLS
                        submitedData.data = payload
                    }else{
                        submitedData.data = payload
                    }

                    console.log(submitedData)
                    
                    this.props.onSubmit(this.formRef.current.getFieldValue('no'), submitedData)
                    
                    if(this.formRef.current){
                        this.formRef.current.resetFields()
                    }
                }else if(res.code === 77){
                    this.formRef.current.setFieldsValue({'no': moment().format('yyyyMMDD') + res.data.ticket_number})
                }else if(res.code === 10){                                                                                      // GET PROJEK
                    this.setState({projek: res.data.filter(data => data.b_active === 't'), loading: false})
                }else if(res.code === 20){                                                                                      // GET LOKASI/STASIUN
                    this.setState({
                        lokasi: res.data.filter(data => data.no_projek === this.formRef.current.getFieldValue('no_projek') && data.b_active === 't'),
                        loading: false
                    })
                }else if(res.code === 30){                                                                                      // GET PERANGKAT
                    this.setState({
                        perangkat: res.data.filter(data => data.ip === this.formRef.current.getFieldValue('ip') && data.b_active === 't'),
                        loading: false
                    })
                }else if(res.code === 40){                                                                                      // GET PART
                    this.setState({part: res.data.filter(data => data.b_active === 't'), loading: false})
                }else if(res.code === 50){                                                                                      // GET PENYEBAB
                    this.setState({
                        penyebab: res.data.filter(data => data.no_pvm === this.formRef.current.getFieldValue('no_pvm') && data.b_active === 't'),
                        loading: false
                    })
                }else if(res.code === 60){                                                                                      // GET SOLUSI
                    this.setState({
                        solusi: res.data.filter(data => data.no_penyebab === this.formRef.current.getFieldValue('no_penyebab') && data.b_active === 't'),
                        loading: false
                    })
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
            alert("Fail to set ticket ID, Ticket ID is empty ")
            return false
        }else if(!downtime){
            alert("Downtime Start End Date is required")
            return false
        }else if(!ticketKind){
            alert("Ticket kind is required")
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

    onSelectStatus = () => {
        this.setState({status: this.formRef.current.getFieldValue('status')})
    }

    getDowntimeMoment = (startDate, startTime, endDate, endTime) => {
        const tanggalMasalah = moment(startDate, moment(startDate).creationData().format).format('yyyy-MM-DD')
        const tanggalDone = moment(endDate, moment(endDate).creationData().format).format('yyyy-MM-DD')

        const downtime = [moment(`${tanggalMasalah} ${startTime}`, datetimeFormat), moment(`${tanggalDone} ${endTime}`, datetimeFormat)]
        return downtime
    }

    handleSetPicBefore = (image, w, h) => {
        const size = {w, h}
        this.setState({pic_before: image, size_imgBefore: size})
    }

    handleSetPicAfter = (image, w, h) => {
        const size = {w, h}
        this.setState({pic_after: image, size_imgafter: size})
    }


    render(){
        const { onClose, data } = this.props
        const { projek, lokasi, perangkat, part, penyebab, solusi, jenisLaporan, status, loading, pic_before, pic_after, size_imgBefore, size_imgafter } = this.state

        return (
            <>
                <Drawer
                    title={data? "Update Ticket" : "Create a new ticket"}
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
                            {data?
                                <Input readOnly />
                            :
                                <Select loading={loading} onFocus={() => this.handleGetItem('perangkat')}>
                                {perangkat.map(data => (
                                    <Option key={data.no_perangkat}>{data.nama_perangkat}</Option>
                                ))}
                                </Select>
                            }
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                        {jenisLaporan?.toLocaleLowerCase() === 'permasalahan' &&
                            <Form.Item name="no_pvm" label="Part" >
                            {data?
                                <Input readOnly />
                            :
                                <Select loading={loading} onFocus={() => this.handleGetItem('part')}>
                                {part.map(data => (
                                    <Option key={data.no_pvm}>{data.nama_perangkat}</Option>
                                ))}
                                </Select>
                            }
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
                            <Form.Item name="solusi" label="Solution" >
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
                        {data?
                            <Form.Item name="refnumber" label="Ref BA Logistics">
                                <Input placeholder="Please enter ref number complaint" />
                            </Form.Item>
                        :
                            <Form.Item name="refnotrouble" label="Ref Num Complaint">
                                <Input placeholder="Please enter ref number complaint" />
                            </Form.Item>
                        }
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
                            {data?
                                <Input readOnly />
                            :
                                <Select placeholder="Please enter gate direction if available">
                                    <Option key={null}>-</Option>
                                    <Option key="IN">IN</Option>
                                    <Option key="OUT">OUT</Option>
                                    <Option key="IN OUT">IN OUT</Option>
                                </Select>
                            }
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status">
                                <Select placeholder="Please enter the status" onSelect={this.onSelectStatus}>
                                    <Option key="Open">Open</Option>
                                    <Option key="Pending">Pending</Option>
                                    <Option key="Done">Done</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {data && status.toLocaleLowerCase() === 'done' &&
                    <>
                        <ModalSetImage 
                            picBefore={pic_before}
                            picAfter={pic_after}
                            onSetPicBefore={this.handleSetPicBefore}
                            onSetPicAfter={this.handleSetPicAfter}
                        />
                        <Row gutter={16} style={{marginTop: 20}}>
                            <Col span={12} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src={pic_before} width={size_imgBefore.w} height={size_imgBefore.h} alt="pic before" />
                            </Col>
                            <Col span={12} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src={pic_after} width={size_imgafter.w} height={size_imgafter.h} alt="pic after" />
                            </Col>
                        </Row>
                    </> 
                }
                {/* {!data && jenisLaporan?.toLocaleLowerCase() === 'permasalahan' && */}
                    <Checkbox 
                        checked={this.state.sendEmail}
                        disabled={!data && jenisLaporan?.toLocaleLowerCase() === 'permasalahan' ? false : true}
                        onChange={(e) => this.setState({sendEmail: e.target.checked})}
                    >
                        Send Email
                    </Checkbox>
                {/* } */}
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


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}


export default connect(mapStateToProps, null)(FormTroubleET)