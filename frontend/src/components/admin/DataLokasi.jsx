import { Table, Popconfirm, Button } from "antd"
import React from "react"
import SocketContext from "../../context/SocketProvider"
import FormLokasi from "../form/FormLokasi"

let socket = null

class DataLokasi extends React.Component {
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
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'lokasi_get')
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
            if(res.code === 20 || res.code === 21 || res.code === 22 || res.code === 23){
                this.setState({dataTable: res.data})
            }else if(res.code === 10){
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `lokasi_delete_${data.ip}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { ip, nama_stasiun, no_projek, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `lokasi_add_${ip}_${nama_stasiun}_${no_projek}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `lokasi_edit_${ip}_${nama_stasiun}_${no_projek}_${b_active}`)
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
                title: "IP",
                dataIndex: "ip",
                key: 'ip',
                sorter: (a, b) => a.ip - b.ip,
                sortOrder: sortedInfo.columnKey === 'ip' && sortedInfo.order,
                width: 150
            },
            {
                title: "Nama Stasiun",
                dataIndex: "nama_stasiun",
                key: 'nama_stasiun',
                sorter: (a, b) => a.nama_stasiun.localeCompare(b.nama_stasiun),
                sortOrder: sortedInfo.columnKey === 'nama_stasiun' && sortedInfo.order,
            },
            {
                title: "Projek",
                dataIndex: "nama_projek",
                key: 'nama_projek',
                sorter: (a, b) => a.nama_projek.localeCompare(b.nama_projek),
                sortOrder: sortedInfo.columnKey === 'nama_projek' && sortedInfo.order,
            },
            {
                title: "Active",
                dataIndex: 'b_active',
                key: 'b_active',
                filters: [
                    { text: 'Active', value: 't' },
                    { text: 'Non Active', value: 'f' },
                ],
                filteredValue: filteredInfo.b_active || null,
                onFilter: (value, record) => {
                    return record.b_active.includes(value)
                },
                width: 150
            },
            {
                title: "Action",
                fixed: 'right',
                width: 100,
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
                <h1 className='txt-white'>Data Lokasi</h1>
                <Button type="text" className='title-add' onClick={this.handleAddData} >+ New Lokasi</Button>
                <Table 
                    rowKey='ip'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: 8 }}
                    scroll={{x: 'max-content'}}
                    size='small'
                />
            </div>
            <FormLokasi
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataLokasi