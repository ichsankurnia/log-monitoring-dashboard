import { Table, Popconfirm, Button } from "antd"
import React from "react"
import SocketContext from "../../context/SocketProvider"
import FormPenyebab from "../form/FormPenyebab"

let socket = null

class DataPenyebab extends React.Component {
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
            no_penyebab: 0
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'penyebab_get')
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
            if(res.code === 50 || res.code === 51 || res.code === 52 || res.code === 53){
                this.setState({dataTable: res.data})
            }else if(res.code === 40){
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, no_penyebab: data.no_penyebab})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `penyebab_delete_${data.no_penyebab}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { penyebab, kategori, no_pvm, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `penyebab_add_${penyebab}_${kategori}_${no_pvm}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `penyebab_edit_${this.state.no_penyebab}_${penyebab}_${kategori}_${no_pvm}_${b_active}`)
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
                title: "No Penyebab",
                dataIndex: "no_penyebab",
                key: 'no_penyebab',
                sorter: (a, b) => a.no_penyebab - b.no_penyebab,
                sortOrder: sortedInfo.columnKey === 'no_penyebab' && sortedInfo.order,
            },
            {
                title: "Penyebab",
                dataIndex: "penyebab",
                key: 'penyebab',
                sorter: (a, b) => a.penyebab.localeCompare(b.penyebab),
                sortOrder: sortedInfo.columnKey === 'penyebab' && sortedInfo.order,
            },
            {
                title: "Kategori",
                dataIndex: "kategori",
                key: 'kategori'
            },
            {
                title: "Part/Perangkat",
                dataIndex: "nama_perangkat",
                key: 'nama_perangkat',
                sorter: (a, b) => a.nama_perangkat.localeCompare(b.nama_perangkat),
                sortOrder: sortedInfo.columnKey === 'nama_perangkat' && sortedInfo.order,
            },
            {
                title: "Jenis",
                dataIndex: "jenis",
                key: 'jenis',
                sorter: (a, b) => a.jenis.localeCompare(b.jenis),
                sortOrder: sortedInfo.columnKey === 'jenis' && sortedInfo.order,
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
                <h1>Data Penyebab</h1>
                <Button type="text" style={{color: '#13c2c2'}} onClick={this.handleAddData} >+ New Cause</Button>
                <Table 
                    rowKey='no_penyebab'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    scroll={{ y: 370 }}
                    pagination={{ pageSize: 6 }} 
                />
            </div>
            <FormPenyebab
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataPenyebab