import React from 'react'
import { Table, Popconfirm, Button } from 'antd';
import FormAddUser from '../form/FormAddUser';
import SocketContext from '../../context/SocketProvider';
import Helper from '../../helpers/Helper';
import { connect } from 'react-redux';


var socket = null

class DataUser extends React.Component {
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
            no_user: 0
        }
    }

    componentDidMount(){
        socket = this.context
        if(socket){
            socket.emit('request', 'user_get')
            this.handleSocketEvent()
        }else{
            this.toReconSocket = setTimeout(() => {
                this.componentDidMount()
            }, 1000);
        }
    }

    componentWillUnmount(){
        clearTimeout(this.toReconSocket)
        if(socket){
            socket.off('response')
            socket = null
        }
    }

    handleSocketEvent = () => {
        socket.on('response', (res) => {
            console.log(res)
            if(res.code === 0 || res.code === 1 || res.code === 2 || res.code === 3){
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
        this.setState({rowDataSelected: data, showForm: true, isUpdate: true, no_user: data.no_user})
    }

    handleDeleteData = (data) => {
        socket.emit('request', `user_delete_${data.no_user}`)
    }
    
    handleAddData = () => {
        this.setState({rowDataSelected: null, showForm: true, isUpdate: false})
    }

    handleSubmitData = (submittedData) => {
        const { nama_user, username, password, alamat, telepon, status, b_active } = submittedData
        if(!this.state.isUpdate){
            console.log("SUBMIT ADD DATA", submittedData)
            socket.emit('request', `user_add_${Helper.capitalEachWord(nama_user)}_${username}_${password}_${alamat}_${telepon}_${status}`)
        }else{
            console.log("SUBMIT EDIT DATA", submittedData)
            socket.emit('request', `user_edit_${this.state.no_user}_${Helper.capitalEachWord(nama_user)}_${username}_${password}_${alamat}_${telepon}_${status}_${b_active}`)
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

        const { user } = this.props

        const columns = [
            {
                title: "No User",
                dataIndex: "no_user",
                key: 'no_user',
                sorter: (a, b) => a.no_user - b.no_user,
                sortOrder: sortedInfo.columnKey === 'no_user' && sortedInfo.order,
            },
            {
                title: "Nama User",
                dataIndex: "nama_user",
                key: 'nama_user',
                sorter: (a, b) => a.nama_user.localeCompare(b.nama_user),
                sortOrder: sortedInfo.columnKey === 'nama_user' && sortedInfo.order,
            },
            {
                title: "Username",
                dataIndex: "username",
                key: 'username',
                sorter: (a, b) => a.username.localeCompare(b.username),
                sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
            },
            {
                title: "Password",
                dataIndex: "password",
                key: 'password',
                render: (data) => 
                    <b>{"*".repeat(data.length)}</b>
            },
            {
                title: "Alamat",
                dataIndex: "alamat",
                key: 'alamat',
            },
            {
                title: "Telepon",
                dataIndex: "telepon",
                key: 'telepon',
            },
            {
                title: "Status",
                dataIndex: "status",
                key: 'status',
                filters: [
                    { text: 'ADMIN', value: 'Admin' },
                    { text: 'BACK-END', value: 'Backend' },
                ],
                filteredValue: filteredInfo.status || null,
                onFilter: (value, record) => record.status.includes(value)
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
                    dataTable.length > 1?
                    user?.no_user === dataSelected.no_user || dataSelected.status.toLowerCase() === 'backend'?
                    <>
                        <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEditData(dataSelected)}>Edit</span>&nbsp;&nbsp;
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteData(dataSelected)}>
                            <span style={{cursor: 'pointer', color: "#f39"}}>Delete</span>
                        </Popconfirm>
                    </>
                    : null : null
                
            }
        ]

        return (
            <>
            <div>
                <h1>Data User</h1>
                <Button type="text" style={{color: '#13c2c2'}} onClick={this.handleAddData} >+ New User</Button>
                <Table 
                    rowKey='no_user'
                    columns={columns}
                    dataSource={dataTable}
                    onChange={this.handleChange}
                    pagination={{ pageSize: 7 }} 
                    scroll={{x: 'max-content'}}
                    // scroll={{ y: 380 }}
                    // pagination={{ pageSize: 20 }}
                    size="small"
                />
            </div>
            <FormAddUser
                visible={showForm}
                data={rowDataSelected} 
                onClose={this.handleClose} 
                onSubmit={this.handleSubmitData}
                />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(DataUser)