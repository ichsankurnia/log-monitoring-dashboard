import React from "react"
import { Link } from "react-router-dom"

import { Table, Popconfirm, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled'
import EditOutlined from '@ant-design/icons/EditOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'

import SocketContext from "../../context/SocketProvider"
import FormPart from "../form/FormPart"

let socket = null

class DataPart extends React.Component {
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
            no_pvm: 0
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'part_get')
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
            if(res.code === 40 || res.code === 41 || res.code === 42 || res.code === 43){
                this.setState({dataTable: res.data})
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, no_pvm: data.no_pvm})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `part_delete_${data.no_pvm}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { nama_perangkat, jenis, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `part_add_${nama_perangkat}_${jenis}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `part_edit_${this.state.no_pvm}_${nama_perangkat}_${jenis}_${b_active}`)
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
                title: "No PVM",
                dataIndex: "no_pvm",
                key: 'no_pvm',
                sorter: (a, b) => a.no_pvm - b.no_pvm,
                sortOrder: sortedInfo.columnKey === 'no_pvm' && sortedInfo.order,
            },
            {
                title: "Nama Perangkat",
                dataIndex: "nama_perangkat",
                key: 'nama_perangkat',
                sorter: (a, b) => a.nama_perangkat.localeCompare(b.nama_perangkat),
                sortOrder: sortedInfo.columnKey === 'nama_perangkat' && sortedInfo.order,
            },
            {
                title: "Jenis",
                dataIndex: "jenis",
                key: 'jenis',
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
            },
            {
                title: "Action",
                fixed: 'right',
                render: (dataSelected) => 
                    dataTable.length > 1 &&
                    <>
                        <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEditData(dataSelected)}><EditOutlined /></span>&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteData(dataSelected)}>
                            <span style={{cursor: 'pointer', color: "#f39"}}><DeleteFilled /></span>
                        </Popconfirm>
                    </>
                
            }
        ]

        return (
            <>
            <div className='bg-blur'>
                <h1 className='txt-white'>Data Part</h1>
                <Link className='ic-back' to='/admin/menu'>
                    <HomeOutlined />
                </Link>
                <Button type="text" className='title-add' onClick={this.handleAddData} >+ New Part</Button>
                <Table 
                    rowKey='no_pvm'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: 8 }}
                    scroll={{x: 'max-content'}}
                    size='small'
                />
            </div>
            <FormPart
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataPart