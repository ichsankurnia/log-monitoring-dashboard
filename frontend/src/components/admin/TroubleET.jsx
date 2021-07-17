import { Table, Popconfirm, Button } from "antd"
import moment from "moment"
import React from "react"
import { getAllTroubleET } from "../../api"
import SocketContext from "../../context/SocketProvider"
import FormTroubleET from "../form/FormTroubleET"

let socket = null

class TroubleET extends React.Component {
    static contextType = SocketContext

    constructor(props){
        super(props)

        this.state = {
            dataTable: [],
            filteredInfo: null,
            sortedInfo: null,
            showForm: false,
            rowDataSelected: {},
            isUpdate: false,
            no_projek: 0
        }
    }

    handleGetAllData = async () => {
        const res = await getAllTroubleET()
        console.log('Get all trouble ', res)

        if(res.data){
            if(res.data.code === 0){
                this.setState({dataTable: res.data.data})
            }
        }
    }

    componentDidMount(){
        this.handleGetAllData()

        socket = this.context
        if(socket){
            // socket.emit('request', 'projek_get')
            this.handleSocketEvent()
        }else{
            this.toReconSocket = setTimeout(() => {
                this.componentDidMount()
            }, 1000);
        }
    }

    componentWillUnmount(){
        clearTimeout(this.toReconSocket)
        socket.off('response')
        socket = null
    }

    handleSocketEvent = () => {
        socket.on('response', (res) => {
            console.log(res)
            if(res.code === 13){
                this.setState({dataTable: res.data})
            }else if(res.code === 77 || res.code === 78 || res.code === 10 || res.code === 20|| res.code === 30|| res.code === 40|| res.code === 50|| res.code === 60){
                console.log(res.message)
            }else{
                alert(res.message)
            }
        })
    }

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleEditData = (data) => {
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, no_projek: data.no_projek})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `projek_delete_${data.no_projek}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { nama_projek, initial, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `projek_add_${nama_projek}_${initial}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `projek_edit_${this.state.no_projek}_${nama_projek}_${initial}_${b_active}`)
        }
        this.setState({showForm: false})
    }


    handleClose = () => {
        this.setState({showForm: false})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showForm, rowDataSelected } = this.state
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
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteData(dataSelected)}>
                            <span style={{cursor: 'pointer', color: "#f39"}}>Delete</span>
                        </Popconfirm>
                    </>
                
            }
        ]

        return (
            <>
            <div>
                <h1>Data Trouble ET</h1>
                <Button type="text" style={{color: '#13c2c2'}} onClick={this.handleAddData} >+ New Trouble</Button>
                <Table 
                    rowKey='no'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: 9 }}
                    scroll={{x: 'max-content'}}
                    size='small'
                />
            </div>
            <FormTroubleET
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default TroubleET