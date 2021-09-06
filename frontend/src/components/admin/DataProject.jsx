import React from "react"
import { Link } from "react-router-dom"

import { Table, Popconfirm, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled'
import EditOutlined from '@ant-design/icons/EditOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'

import SocketContext from "../../context/SocketProvider"
import FormProjek from "../form/FormProjek"

let socket = null

class DataProjek extends React.Component {
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

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'projek_get')
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
            if(res.code === 10 || res.code === 11 || res.code === 12 || res.code === 13){
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
                title: "No Projek",
                dataIndex: "no_projek",
                key: 'no_projek',
                sorter: (a, b) => a.no_projek - b.no_projek,
                sortOrder: sortedInfo.columnKey === 'no_projek' && sortedInfo.order,
            },
            {
                title: "Nama Projek",
                dataIndex: "nama_projek",
                key: 'nama_projek',
                sorter: (a, b) => a.nama_projek.localeCompare(b.nama_projek),
                sortOrder: sortedInfo.columnKey === 'nama_projek' && sortedInfo.order,
            },
            {
                title: "Kode Projek",
                dataIndex: "initial",
                key: 'initial',
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

        const hScreen = window.screen.height

        return (
            <>
            <div className='bg-blur'>
                <h1 className='txt-white'>Data Projek</h1>
                <Link className='ic-back' to='/admin/menu'>
                    <HomeOutlined />
                </Link>
                <Button type="text" className='title-add' onClick={this.handleAddData} >+ New Project</Button>
                <Table 
                    rowKey='no_projek'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: hScreen/96 }}
                    scroll={{x: hScreen>768? 960 : 840}}
                    size='small'
                />
            </div>
            <FormProjek
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataProjek