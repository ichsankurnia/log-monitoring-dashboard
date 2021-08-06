import { /* Table,  */Popconfirm, Button, Spin, DatePicker } from "antd"
import { Table } from "ant-table-extensions";
import { ExportOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons';
import moment from "moment"
import React from "react"
import { addNewTroubleET, deleteTroubleET, getAllTroubleET, getDetailTroubleET, getOneTroubleET, updateTroubleET } from "../../api"
import FormTroubleET from "../form/FormTroubleET"
import ExportExcel from "../../helpers/ExportExcel";
import { connect } from "react-redux";
import ModalDetailTroubleET from "../modal/ModalDetailTroubleET";

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

class TroubleET extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            allData: [],
            dataTable: [],
            filteredInfo: null,
            sortedInfo: null,
            showForm: false,
            isUpdate: false,
            no_ticket: 0,
            rowDataSelected: {},
            showDetailTicket: false,
            detailTicket: null,
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
    }

    componentWillUnmount(){
        this.is_mounted = false
    }


    handleGetDetailTrouble = async (ticketNum) => {
        this.setState({showLoader: true})
        const res = await getOneTroubleET(ticketNum)

        console.log('GET Detail Trouble ET :', res)
        if(res.data){
            if(res.data.code === 0){
                this.setState({rowDataSelected: res.data.data})
            }else{
                return false
            }
        }else{
            return false
        }
        return true
    }


    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleEditData = async (data) => {
        const getDetail = await this.handleGetDetailTrouble(data.no)
        if(getDetail){
            this.setState({showForm: true, isUpdate: true, showLoader: false, no_ticket: data.no})
        }else{
            alert('cannot get detail trouble et')
        }
    }

    handleDeleteData = async (data) => {
        const res = await deleteTroubleET(data.no)
        
        console.log('Delete TroubleET :', res)
        if(res.data?.code === 0){
            this.handleGetAllData()
        }else{
            alert('fail deleting ticket')
        }
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = async (ticketNum, submittedData) => {
        this.setState({showLoader: true})
        let res = null

        if(this.state.isUpdate){
            res = await updateTroubleET(ticketNum, submittedData.data)
        }else{
            submittedData.data.no = await ticketNum

            res = await addNewTroubleET(submittedData)
        }

        console.log(`${this.state.isUpdate? 'Update' : 'Add new'} TroubleET :`, res)
        if(res.data?.code === 0){
            this.handleGetAllData()
        }else{
            alert(`${this.state.isUpdate? 'Update' : 'Add new'} TroubleET failed`)
        }

        this.setState({showForm: false, showLoader: false})
    }


    filterByTanggalDone = (date, param) => {
        let dataTable = [...this.state.allData]
        let result = []
        if(date && date[0] && date[1]){
            result = dataTable.filter(res => {
                return moment(res[param], moment(res[param]).creationData().format).isBetween(date[0], date[1])
            })
            this.setState({dataTable: result})
        }else{
            this.setState({dataTable: this.state.allData})
        }
    }

    handleExportListTrouble = () => {
        ExportExcel.exportListTroubleET(this.props.user, this.state.dataTable)
    }


    handleShowDetailTicket = async (data) => {
        this.setState({showLoader: true})
        const res = await getDetailTroubleET(data.no)

        console.log("Detail TroubleET :", res)
        if(res.data?.code === 0){
            this.setState({showDetailTicket: true, detailTicket: res.data.data})
        }else{
            alert('fail get detail trouble et')
        }
        this.setState({showLoader: false})
    }

    handleClose = () => {
        this.setState({showForm: false})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showForm, showLoader, rowDataSelected, showDetailTicket, detailTicket } = this.state
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
                sorter: (a, b) => a.nama_part.localeCompare(b.nama_part),
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
            {
                title: "Action",
                fixed: 'right',
                render: (dataSelected) => 
                    dataTable.length > 1 &&
                    <>
                        <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEditData(dataSelected)}>Edit</span>&nbsp;&nbsp;
                        <span style={{marginRight: 5, cursor: 'pointer'}} onClick={() => this.handleShowDetailTicket(dataSelected)}><EyeTwoTone /></span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteData(dataSelected)}>
                            <span style={{cursor: 'pointer', color: "#f39"}}>Delete</span>
                        </Popconfirm>
                    </>
                
            }
        ]

        return (
            <>
            <div>
                <Spin spinning={showLoader} delay={500} indicator={loader} tip="Please wait..." size='large'>
                    <h1>Data Trouble ET</h1>
                    <Button type="text" style={{color: '#13c2c2'}} onClick={this.handleAddData} >+ New Trouble</Button>
                    <label>Filter By Tanggal Masalah</label>
                    <DatePicker.RangePicker onCalendarChange={(date) => this.filterByTanggalDone(date, 'tanggal_masalah')} />
                    <label>Filter By Tanggal Done</label>
                    <DatePicker.RangePicker onCalendarChange={(date) => this.filterByTanggalDone(date, 'tanggal_done')} />
                    <Button icon={<ExportOutlined />} type="primary" shape="round" onClick={this.handleExportListTrouble}>
                        Export
                    </Button>
                    <Table 
                        rowKey='no'
                        columns={columns}
                        dataSource={dataTable}
                        onChange={this.handleChange}
                        pagination={{ pageSize: 8 }}
                        scroll={{x: 'max-content'}}
                        size='small'
                        // searchableProps={{ fuzzySearch: true }}
                        // exportableProps={{showColumnPicker: true}}
                        searchable
                    />
                </Spin>
            </div>
            {showForm && 
                <FormTroubleET
                    data={rowDataSelected} 
                    onClose={this.handleClose} 
                    onSubmit={this.handleSubmitData}
                    />
            }
            <ModalDetailTroubleET onClose={() => this.setState({showDetailTicket: false})} visible={showDetailTicket} data={detailTicket} />
            </>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(TroubleET)