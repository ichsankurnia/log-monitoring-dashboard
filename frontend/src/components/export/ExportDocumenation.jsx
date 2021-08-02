import { Popconfirm, Button, Spin, DatePicker } from "antd"
import { Table } from "ant-table-extensions";
import { ExportOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from "moment"
import React from "react"
import { deleteTroubleET, getDetailTroubleET, getListDocumentation, updateTroubleET } from "../../api"
import FormTroubleET from "../form/FormTroubleET"
import ExportExcel from "../../helpers/ExportExcel";
import Helper from "../../helpers/Helper";
import { connect } from "react-redux";

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

class ExportDocumentation extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            allData: [],
            dataTable: [],
            filteredInfo: null,
            sortedInfo: null,
            showForm: false,
            showLoader: false,
            rowDataSelected: {}
        }
    }

    handleGetAllData = async () => {
        this.setState({showLoader: true})
        const res = await getListDocumentation()
        console.log('Get list documentation ', res)

        if(res.data){
            if(res.data.code === 0){
                this.setState({allData: res.data.data, dataTable: res.data.data})
            }
        }
        this.setState({showLoader: false})
    }

    componentDidMount(){
        this.handleGetAllData()
    }


    handleGetDetailTrouble = async (ticketNum) => {
        this.setState({showLoader: true})
        const res = await getDetailTroubleET(ticketNum)

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
            this.setState({showForm: true, showLoader: false})
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
    
    handleSubmitData = async (ticketNum, submittedData) => {
        this.setState({showLoader: true})
        const res = await updateTroubleET(ticketNum, submittedData.data)

        console.log('Update  TroubleET :', res)
        if(res.data?.code !== 0){
            alert('Update TroubleET failed')
        }
        
        this.setState({showForm: false})
        this.handleGetAllData()
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

    handleExportListTrouble = async () => {
        this.setState({showLoader: true})
        await ExportExcel.exportDocumentation(this.props.user, this.state.dataTable)
        this.setState({showLoader: false})
    }


    handleClose = () => {
        this.setState({showForm: false})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showForm, showLoader, rowDataSelected } = this.state
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
                    <img src={Helper.getASCIIAsBase64(data)} alt='' width={200} height={150} /> :
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
                    <img src={Helper.getASCIIAsBase64(data)} alt='' width={200} height={150} /> :
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'red'}}>
                        <img src="" alt='' width={100} height={50} />
                        <p>File too large, cannot load the image!</p>
                    </div>
            },
            {
                title: "Jenis Pergantian",
                dataIndex: "nama_part",
                key: 'nama_part'
            },
            {
                title: "Action",
                fixed: 'right',
                render: (dataSelected) => 
                    dataTable.length > 1 &&
                    <>
                        <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEditData(dataSelected)}>Edit</span>&nbsp;&nbsp;
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
                    <h1>Documentation Trouble ET</h1>
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
                        pagination={{ pageSize: 3 }}
                        scroll={{x: 'max-content'}}
                        size='small'
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