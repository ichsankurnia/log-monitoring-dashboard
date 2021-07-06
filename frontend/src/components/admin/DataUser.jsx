import React from 'react'

import { Table, Popconfirm, Space } from 'antd';
import FormAddUser from '../form/FormAddUser';

const data = [];

for (let i = 1; i < 46; i++) {
    if(i%2 === 0){
        data.push({
            key: i,
            name: `Ichsan King ${i}`,
            age: 32,
            address: `Makkah, Park Lane no. ${i}`,
        });
    }else{
        data.push({
            key: i,
            name: `Mute queen ${i}`,
            age: 32,
            address: `Madinah, Park Lane no. ${i}`,
        });
    }
}

class DataUser extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        showEditForm: false,
        rowDataSelected: null
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleEdit = (data) => {
        this.setState({rowDataSelected: data, showEditForm: true})
    }

    handleDelete = (data) => {
        console.log(data)
    }

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                filters: [
                    { text: 'Ichsan', value: 'Ichsan' },
                    { text: 'Ories', value: 'Ories' },
                ],
                filteredValue: filteredInfo.name || null,
                onFilter: (value, record) => record.name.includes(value),
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                sorter: (a, b) => a.age - b.age,
                sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                filters: [
                    { text: 'Makkah', value: 'Makkah' },
                    { text: 'Madinah', value: 'Madinah' },
                ],
                filteredValue: filteredInfo.address || null,
                onFilter: (value, record) => record.address.includes(value),
                sorter: (a, b) => a.address.length - b.address.length,
                sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Action',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (rowData) =>
                    data.length >= 1 ? (
                        <>
                            <span style={{cursor: 'pointer', color: "#39f"}} onClick={() => this.handleEdit(rowData)}>Edit</span>&nbsp;&nbsp;
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(rowData)}>
                                <span style={{cursor: 'pointer', color: "#39f"}}>Delete</span>
                            </Popconfirm>
                        </>
                    ) : null,
                // render: () => 
                // <>
                //     <span style={{cursor: 'pointer', color: "#39f"}}>Edit</span>&nbsp;&nbsp;
                //     <span style={{cursor: 'pointer', color: "#39f"}}>Delete</span>
                // </>
            },
        ];

        return (
            <>
                <FormAddUser 
                    visible={this.state.showEditForm} 
                    onClose={() => this.setState({showEditForm: false})}
                    data={this.state.rowDataSelected}
                />
                <div style={{padding: 20}}>
                    <Space style={{ marginBottom: 16 }}>
                        Data User
                    </Space>
                    <Table
                        columns={columns} 
                        dataSource={data} 
                        onChange={this.handleChange}
                        // scroll={{ y: 380 }}
                        // pagination={{ pageSize: 20 }} 
                        size="small"
                    />
                </div>
            </>
        );
    }
}

export default DataUser