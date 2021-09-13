import React from "react"
import { Link } from "react-router-dom"
import { /* Table, */ Popconfirm, Button, Spin } from 'antd';
import { Table } from "ant-table-extensions";
import DeleteFilled from '@ant-design/icons/DeleteFilled'
import EditOutlined from '@ant-design/icons/EditOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";

import SocketContext from "../../context/SocketProvider"
import FormSolusi from "../form/FormSolusi"

const loader = <LoadingOutlined style={{ fontSize: 32 }} spin />;

let socket = null

class DataSolusi extends React.Component {
    static contextType = SocketContext

    constructor(props){
        super(props)

        this.state = {
            dataTable: [],
            filteredInfo: null,
            sortedInfo: null,
            showForm: false,
            showLoader: true,
            rowDataSelected: {},
            isUpdate: false,
            id_solusi: 0
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'solusi_get')
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
            if(res.code === 60 || res.code === 61 || res.code === 62 || res.code === 63){
                this.setState({dataTable: res.data})
            }else if(res.code === 50){
                console.log(res.message)
            }else{
                alert(res.message)
            }
            this.setState({showLoader: false})
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, id_solusi: data.id_solusi})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `solusi_delete_${data.id_solusi}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        this.setState({showLoader: true})
        const { nama_solusi, no_penyebab, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `solusi_add_${nama_solusi}_${no_penyebab}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `solusi_edit_${this.state.id_solusi}_${nama_solusi}_${no_penyebab}_${b_active}`)
        }
        this.setState({showForm: false})
    }


    handleClose = () => {
        this.setState({showForm: false})
    }

    render(){
        let { dataTable, filteredInfo, sortedInfo, showForm, rowDataSelected, showLoader } = this.state
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const columns = [
            {
                title: "ID Solusi",
                dataIndex: "id_solusi",
                key: 'id_solusi',
                sorter: (a, b) => a.id_solusi - b.id_solusi,
                sortOrder: sortedInfo.columnKey === 'id_solusi' && sortedInfo.order,
            },
            {
                title: "Solusi",
                dataIndex: "nama_solusi",
                key: 'nama_solusi',
                sorter: (a, b) => a.nama_solusi.localeCompare(b.nama_solusi),
                sortOrder: sortedInfo.columnKey === 'nama_solusi' && sortedInfo.order,
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
                <Spin spinning={showLoader} delay={500} indicator={loader} size='large'>
                    <h1 className='txt-white'>Data Solusi</h1>
                    <Button type="text" className='title-add' onClick={this.handleAddData} >+ New Solution</Button>
                    <Link className='ic-back' to='/admin/menu'>
                        <HomeOutlined />
                    </Link>
                    <Table 
                        rowKey='id_solusi'
                        columns={columns}
                        dataSource={dataTable}
                        onChange={this.handleChange}
                        pagination={{ pageSize: hScreen/96 }}
                        scroll={{x: 'max-content'}}
                        size='small'
                        searchable
                    />
                </Spin>
            </div>
            <FormSolusi
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

export default DataSolusi