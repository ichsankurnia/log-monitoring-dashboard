import React from "react"
import moment from "moment"
import { connect } from "react-redux";
import { Table } from "ant-table-extensions";
import Modal from "antd/lib/modal/Modal";
import { Button, Spin, DatePicker, Select } from "antd"
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';

import SocketContext from "../../context/SocketProvider";
import { getListDocumentation } from "../../api"

import ExportExcel from "../../helpers/ExportExcel";
import Helper from "../../helpers/Helper";

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

var socket = null
class ExportDocumentation extends React.Component {
    static contextType = SocketContext
    constructor(props){
        super(props)

        this.state = {
            allData: [],
            dataTable: [],
            filterTable: {},

            dataProjek: [],
            dataPerangkat: [],

            filteredInfo: null,
            sortedInfo: null,
            showLoader: false,
            loaderDropdown: true,
            showModalImg: false,
            
            imgSelected: null
        }

        this.is_mounted = false
    }

    handleGetAllData = async () => {
        this.setState({showLoader: true})
        const res = await getListDocumentation()
        console.log('Get list documentation ', res)
        
        if(res.data){
            if(res.data?.code === 0 && this.is_mounted){
                this.setState({allData: res.data.data, dataTable: res.data.data})
            }
        }else{
            alert(`${res.config?.baseURL} ${res.message}`)
        }
        this.is_mounted && this.setState({showLoader: false})
    }
    
    componentDidMount(){
        this.is_mounted = true
        this.handleGetAllData()
        
        socket = this.context
        if(socket){
            socket.emit('request', 'projek_get')
            socket.emit('request', 'perangkat_get')
            this.handleSocketEvent()
        }else{
            this.toReconSocket = setTimeout(() => {
                this.componentDidMount()
            }, 1000);
        }
    }
    
    handleSocketEvent = () => {
        socket.on('response', (res) => {
            console.log(res)
            if(res.code === 10){
                this.setState({dataProjek: res.data})
            }else if(res.code === 30){
                this.setState({dataPerangkat: res.data})
                this.setState({loaderDropdown: false})
            }else if(res.code === 20 || res.code === 40 || res.code === 50 || res.code === 60){
            }else{
                alert(res.message)
            }
        })
    }
    
    componentWillUnmount(){
        this.is_mounted = false
        clearTimeout(this.toReconSocket)
        if(socket){
            socket.off('response')
            socket = null
        }
    }
    
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };


    filterByTanggalDone = (date) => {
        const filter = {...this.state.filterTable}
        if(date && date[0] && date[1]){
            filter.tanggal_done = date
        }else{
            delete filter.tanggal_done
        }

        this.setState({filterTable: filter}, () => {
            this.handleFilterDataTable()
        })
    }


    filterByItem = (value, key) => {
        const filter = {...this.state.filterTable}
        if(value && value !== "null" && value !== null){
            filter[key] = value
        }else{
            delete filter[key]
        }

        this.setState({filterTable: filter}, () => {
            this.handleFilterDataTable()
        })
    }
    
    handleFilterDataTable = () => {
        console.log(this.state.filterTable)
        const result = Helper.filterDataTable(this.state.filterTable, this.state.allData)

        this.setState({dataTable: result})
    }

    handleExportListTrouble = async () => {
        this.setState({showLoader: true})
        await ExportExcel.exportDocumentation(this.props.user, this.state.dataTable)
        this.setState({showLoader: false})
    }

    handleClickImage = (imgBuffer) => {
        this.setState({showModalImg: true, imgSelected: Helper.getASCIIAsBase64(imgBuffer)})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showLoader, loaderDropdown, dataProjek, dataPerangkat } = this.state
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};                                                                                          // eslint-disable-line no-unused-vars

        const columns = [
            {
                title: "No Ticket",
                dataIndex: "no",
                key: 'no',
                fixed: 'left'
            },
            {
                title: "Tanggal Masalah",
                dataIndex: "tanggal_masalah",
                key: 'tanggal_masalah',
                sorter: (a, b) => moment(a.tanggal_masalah, moment(a).creationData().format) - moment(b.tanggal_masalah, moment(b).creationData().format),
                sortOrder: sortedInfo.columnKey === 'tanggal_masalah' && sortedInfo.order,
                render: (data) =>
                    <span>{moment(data, moment(data).creationData().format).format('DD-MM-YYYY')}</span>
            },
            {
                title: "Tanggal Done",
                dataIndex: "tanggal_done",
                key: 'tanggal_done',
                sorter: (a, b) => moment(a.tanggal_done, moment(a).creationData().format) - moment(b.tanggal_done, moment(b).creationData().format),
                sortOrder: sortedInfo.columnKey === 'tanggal_done' && sortedInfo.order,
                render: (data) =>
                    <span>{moment(data, moment(data).creationData().format).format('DD-MM-YYYY')}</span>
            },
            {
                title: "Projek",
                dataIndex: "nama_projek",
                key: 'nama_projek',
                sorter: (a, b) => a.nama_projek.localeCompare(b.nama_projek),
                sortOrder: sortedInfo.columnKey === 'nama_projek' && sortedInfo.order,
            },
            {
                title: "Lokasi",
                dataIndex: "nama_stasiun",
                key: 'nama_stasiun',
                sorter: (a, b) => a.nama_stasiun.localeCompare(b.nama_stasiun),
                sortOrder: sortedInfo.columnKey === 'nama_stasiun' && sortedInfo.order,
            },
            {
                title: "Perangkat",
                dataIndex: "nama_perangkat",
                key: 'nama_perangkat'
            },
            {
                title: "Perangkat",
                dataIndex: "id_perangkat",
                key: 'id_perangkat'
            },
            {
                title: "Problem",
                dataIndex: "problem",
                key: 'problem'
            },
            {
                title: "Picture Before",
                dataIndex: "pic_before",
                key: 'pic_before',
                render: (data) =>
                    data?
                    <img src={Helper.getASCIIAsBase64(data)} alt='' width={200} height={150} style={{cursor: 'pointer'}} onClick={() => this.handleClickImage(data)} /> :
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'red'}}>
                        <img src="" alt='' width={100} height={50} />
                        <p>File too large, cannot load the image!</p>
                    </div>
            },
            {
                title: "Solusi",
                dataIndex: "solusi",
                key: 'solusi'
            },
            {
                title: "Picture After",
                dataIndex: "pic_after",
                key: 'pic_after',
                render: (data) =>
                    data?
                    <img src={Helper.getASCIIAsBase64(data)} alt='' width={200} height={150} style={{cursor: 'pointer'}} onClick={() => this.handleClickImage(data)} /> :
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'red'}}>
                        <img src="" alt='' width={100} height={50} />
                        <p>File too large, cannot load the image!</p>
                    </div>
            },
            {
                title: "Jenis Pergantian",
                dataIndex: "nama_part",
                key: 'nama_part'
            }
        ]

        const hScreen = window.screen.height

        return (
            <>
            <div className='w-100 bg-blur'>
                <Spin spinning={showLoader} delay={500} indicator={loader} tip="Please wait..." size='large'>
                    <h1 className='txt-white'>Documentation Trouble ET</h1>
                    <div className='row-sp'>
                        <div className='flex-col'>
                            <label className='txt-white'>Tanggal Done </label>
                            <DatePicker.RangePicker onCalendarChange={(date) => this.filterByTanggalDone(date, 'tanggal_done')} />
                        </div>
                        <div className='flex-col'>
                            <label className='txt-white'>Projek </label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "no_projek")}
                                loading={loaderDropdown}
                                placeholder="ex: KCI" showSearch optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Select.Option key={null}>- ALL</Select.Option>
                                {dataProjek?.map(data => 
                                    <Select.Option key={data.no_projek}>{data.nama_projek}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className='flex-col'>
                            <label className='txt-white'>Perangkat </label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "no_perangkat")}
                                loading={loaderDropdown}
                                placeholder="ex: Gate" showSearch optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Select.Option key={null}>- ALL</Select.Option>
                                {dataPerangkat?.map(data => 
                                    <Select.Option key={data.no_perangkat}>{data.nama_perangkat}</Select.Option>
                                )}
                            </Select>
                        </div>
                    </div>
                    <Table 
                        rowKey='no'
                        columns={columns}
                        dataSource={dataTable}
                        onChange={this.handleChange}
                        pagination={{ pageSize: parseInt(hScreen/256) }}
                        scroll={{x: 'max-content', y: hScreen> 768? 650 : 370}}
                        size='small'
                    />
                    <Button icon={<ExportOutlined />} type="primary" shape="round" onClick={this.handleExportListTrouble} style={{position: 'absolute', left: 0, bottom: 10}}>
                        Export
                    </Button>
                </Spin>
            </div>
            <Modal
                closable={false}        // show icon close
                visible={this.state.showModalImg}
                centered
                onCancel={() => this.setState({showModalImg: false})}
                destroyOnClose={true}
                footer={null}
                style={{textAlign: 'center', maxHeight: '90vh', maxWidth: '90vw' }}
                width='max-content'
            >
                <img src={this.state.imgSelected} alt="" />
            </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(ExportDocumentation)