import React from "react"
import moment from "moment"
import { connect } from "react-redux";
import { Button, Spin, DatePicker, Select } from "antd"
import { ExportOutlined, LoadingOutlined } from '@ant-design/icons';
import { Table } from "ant-table-extensions";

import SocketContext from "../../context/SocketProvider";
import { getAllTroubleET } from "../../api"

import ExportExcel from "../../helpers/ExportExcel";
import Helper from "../../helpers/Helper";

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

var socket = null

class ExportData extends React.Component {
    static contextType = SocketContext
    constructor(props){
        super(props)

        this.state = {
            allData: [],
            dataTable: [],
            filterTable: {},

            dataProjek: [],
            dataPerangkat: [],
            dataPenyebab: [],

            filteredInfo: null,
            sortedInfo: null,
            showLoader: false,
        }

        this.is_mounted = false
    }

    handleGetAllData = async () => {
        this.setState({showLoader: true})
        const res = await getAllTroubleET()
        console.log('Get all trouble ', res)

        if(res.data){
            if(res.data.code === 0 && this.is_mounted){
                this.setState({allData: res.data.data, dataTable: res.data.data})
            }
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
            socket.emit('request', 'penyebab_get')
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
            }else if(res.code === 50){
                this.setState({dataPenyebab: res.data})
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
        await ExportExcel.exportListTroubleET(this.props.user, this.state.dataTable)
        this.setState({showLoader: false})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showLoader, dataProjek, dataPenyebab, dataPerangkat } = this.state
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const columns = [
            {
                title: "No Ticket",
                dataIndex: "no",
                key: 'no',
                fixed: 'left'
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
                title: "Jam Done",
                dataIndex: "jam_done",
                key: 'jam_done',
            },
            {
                title: "Jenis Laporan",
                dataIndex: 'jenislaporan',
                key: 'jenislaporan',
                filters: [
                    { text: 'Aduan', value: 'ADUAN' },
                    { text: 'Pekerjaan', value: 'PEKERJAAN' },
                    { text: 'Permasalahan', value: 'PERMASALAHAN' },
                ],
                filteredValue: filteredInfo.jenislaporan || null,
                onFilter: (value, record) => record.jenislaporan.includes(value)
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
                key: 'nama_perangkat',
                sorter: (a, b) => a.nama_perangkat.localeCompare(b.nama_perangkat),
                sortOrder: sortedInfo.columnKey === 'nama_perangkat' && sortedInfo.order,
            },
            {
                title: "Part",
                dataIndex: "nama_part",
                key: 'nama_part',
                sorter: (a, b) => {
                    try { return a.nama_part.localeCompare(b.nama_part) } catch (error) {}
                },
                sortOrder: sortedInfo.columnKey === 'nama_part' && sortedInfo.order,
            },
            {
                title: "Problem",
                dataIndex: "problem",
                key: 'problem'
            },
            {
                title: "Penyebab",
                dataIndex: "penyebab",
                key: 'penyebab'
            },
            {
                title: "Solusi",
                dataIndex: "solusi",
                key: 'solusi'
            },
            {
                title: "Durasi",
                dataIndex: "totaldowntime",
                key: 'totaldowntime'
            },
            {
                title: "RefLog",
                dataIndex: "refnumber",
                key: 'refnumber'
            },
            {
                title: "Status",
                dataIndex: 'status',
                key: 'status',
                filters: [
                    { text: 'Done', value: 'Done' },
                    { text: 'Open', value: 'Open' },
                    { text: 'Pending', value: 'Pending' },
                ],
                filteredValue: filteredInfo.status || null,
                onFilter: (value, record) => record.status.includes(value),
                fixed: 'right',
                render: (data) => {
                    return {
                        props : {
                            style: {color: data==='Done'? '#000' : data==='Open'? '#db0' : 'red'}
                        },
                        children: <span>{data}</span>
                    }
                }
            },
        ]

        return (
            <>
            <div className='w-100'>
                <Spin spinning={showLoader} delay={500} indicator={loader} tip="Please wait..." size='large'>
                    <h1 className='txt-white'>Export Data Trouble ET</h1>
                    <div className='row-sp'>
                        <div>
                            <label className='txt-white'>Filter By Tanggal Done</label>
                            <DatePicker.RangePicker onCalendarChange={(date) => this.filterByTanggalDone(date, 'tanggal_done')} />
                        </div>
                        <div>
                            <label className='txt-white'>Jenis Laporan</label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "jenislaporan")}>
                                <Select.Option key={null}>- ALL</Select.Option>
                                <Select.Option key="ADUAN">Aduan</Select.Option>
                                <Select.Option key="PEKERJAAN">Pekerjaan</Select.Option>
                                <Select.Option key="PERMASALAHAN">Permasalahan</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <label className='txt-white'>Projek</label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "no_projek")}>
                                <Select.Option key={null}>- ALL</Select.Option>
                                {dataProjek?.map(data => 
                                    <Select.Option key={data.no_projek}>{data.nama_projek}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div>
                            <label className='txt-white'>Perangkat</label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "no_perangkat")}>
                                <Select.Option key={null}>- ALL</Select.Option>
                                {dataPerangkat?.map(data => 
                                    <Select.Option key={data.no_perangkat}>{data.nama_perangkat}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div>
                            <label className='txt-white'>Penyebab</label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "no_penyebab")}>
                                <Select.Option key={null}>- ALL</Select.Option>
                                {dataPenyebab?.map(data => 
                                    <Select.Option key={data.no_penyebab}>{data.penyebab}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div>
                            <label className='txt-white'>Status</label>
                            <Select style={{width: 130}} onSelect={(value) => this.filterByItem(value, "status")}>
                                <Select.Option key={null}>- ALL</Select.Option>
                                <Select.Option key="Done">Done</Select.Option>
                                <Select.Option key="Open">Open</Select.Option>
                                <Select.Option key="Pending">Pending</Select.Option>
                            </Select>
                        </div>
                    </div>
                    <Table 
                        rowKey='no'
                        columns={columns}
                        dataSource={dataTable}
                        onChange={this.handleChange}
                        // pagination={{ pageSize: 8 }}
                        scroll={{x: 'max-content'}}
                        size='small'
                    />
                    <Button icon={<ExportOutlined />} type="primary" shape="round" onClick={this.handleExportListTrouble} style={{position: 'absolute', left: 0, bottom: 10}}>
                        Export
                    </Button>
                </Spin>
            </div>
            </>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(ExportData)