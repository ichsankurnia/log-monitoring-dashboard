import React from "react"
import { Link } from "react-router-dom"

import { Table, Popconfirm, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled'
import EditOutlined from '@ant-design/icons/EditOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'

import SocketContext from "../../context/SocketProvider"
import FormPerangkat from "../form/FormPerangkat"

let socket = null

class DataPerangkat extends React.Component {
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
            no_perangkat: 0
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'perangkat_get')
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
            if(res.code === 30 || res.code === 31 || res.code === 32 || res.code === 33){
                this.setState({dataTable: res.data})
            }else if(res.code === 20){
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, no_perangkat: data.no_perangkat})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `perangkat_delete_${data.no_perangkat}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { nama_perangkat, id, type, ip, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `perangkat_add_${nama_perangkat}_${id}_${type}_${ip}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `perangkat_edit_${this.state.no_perangkat}_${nama_perangkat}_${id}_${type}_${ip}_${b_active}`)
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
                title: "No Perangkat",
                dataIndex: "no_perangkat",
                key: 'no_perangkat',
                sorter: (a, b) => a.no_perangkat - b.no_perangkat,
                sortOrder: sortedInfo.columnKey === 'no_perangkat' && sortedInfo.order,
            },
            {
                title: "Nama perangkat",
                dataIndex: "nama_perangkat",
                key: 'nama_perangkat',
                sorter: (a, b) => a.nama_perangkat.localeCompare(b.nama_perangkat),
                sortOrder: sortedInfo.columnKey === 'nama_perangkat' && sortedInfo.order,
            },
            {
                title: "Kode Perangkat",
                dataIndex: "id",
                key: 'id'
            },
            {
                title: "Type",
                dataIndex: "type",
                key: 'type'
            },
            {
                title: "Location/Station",
                dataIndex: "nama_stasiun",
                key: 'nama_stasiun',
                sorter: (a, b) => a.nama_stasiun.localeCompare(b.nama_stasiun),
                sortOrder: sortedInfo.columnKey === 'nama_stasiun' && sortedInfo.order,
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
                        <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEditData(dataSelected)}><EditOutlined /></span>&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteData(dataSelected)}>
                            <span style={{cursor: 'pointer', color: "#f39"}}><DeleteFilled /></span>
                        </Popconfirm>
                    </>
                
            }
        ]

        const hScreen = window.screen.height

        return (
            <>
            <div className='bg-blur'>
                <h1 className='txt-white'>Data Perangkat</h1>
                <Link className='ic-back' to='/admin/menu'>
                    <HomeOutlined />
                </Link>
                <Button type="text" className='title-add' onClick={this.handleAddData} >+ New Device</Button>
                <Table 
                    rowKey='no_perangkat'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: hScreen/96 }}
                    scroll={{x: hScreen>768? 960 : 840}}
                    size='small'
                />
            </div>
            <FormPerangkat
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataPerangkat