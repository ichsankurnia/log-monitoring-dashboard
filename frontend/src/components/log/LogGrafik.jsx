import React from "react"
import { getGrafik } from "../../api"

import { 
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import ModalGrafik from "../modal/ModalGrafik";

const setDataGraph = (arrData, idLabel, label) => {
    const arrRes = []
    arrData.forEach(item => {
        const obj = {
            key: `${item[idLabel]}`,
            id: idLabel,
            name: item[label].length > 25? item[label].substring(0, 25) + '...' : item[label],
            fullname: item[label],
            count_1: parseInt(item.counts),
            count_2: parseInt(item.counts),
            cnt: parseInt(item.counts)/2,
        }
        arrRes.push(obj)
    })
    return arrRes
}

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#413ea0', '#4b0082'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name, payload }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const persen = `${(percent * 100).toFixed(0)}%`

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${persen} (${value}) ${payload.code_projek}`}
        </text>
    );
};

const CustomTooltip = ({ active, payload, color }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p style={{color}}>{payload[0].payload.fullname}</p>
                <p style={{color}}>{payload[0].payload.id  + ' : ' + payload[0].payload.key}</p>
                <p style={{color}}>{`Total Masalah : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const DeviceTooltip = ({ active, payload, color }) => {
    const data = payload[0]?.payload
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p style={{color}}>{data.fullname}</p>
                <p style={{color}}>{data.id  + ' : ' + data.key}</p>
                <p style={{color}}>{`Location : ${data.location}`}</p>
                <p style={{color}}>{`Project : ${data.project}`}</p>
                <p style={{color}}>{`Total Masalah : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
//     return <text x={x + width / 2} y={y} fill="#fff" textAnchor="middle" dy={-6}>{`${value}`}</text>;
// };

class LogGrafik extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            queryDetail: '',
            showModal: false,
            showLoader: false,
            dataMasalah: null,
            dataProjek: null,
            dataPerangkat: null,
            dataPart: null,
            dataPenyebab: null,
        }
    }

    componentDidMount(){
        this.fecthGrafik()
    }

    fecthGrafik = async () => {
        const res = await getGrafik()

        console.log('GET GRAFIK :', res)
        this.setState({showLoader: false})
        if(res.data){
            if(res.data.code === 0){
                let arrProjek = []
                res.data.data.projek.forEach(item => {
                    const obj = {
                        key: `${item.no_projek}`,
                        id: 'no_projek',
                        name: item.nama_projek.length > 25? item.nama_projek.substring(0, 25) + '...' : item.nama_projek,
                        fullname: item.nama_projek,
                        code_projek: item.initial,
                        count: parseInt(item.counts),
                        cnt: parseInt(item.counts)/2,
                    }
                    arrProjek.push(obj)
                })

                let arrPerangkat = []
                res.data.data.perangkat.forEach(item => {
                    const obj = {
                        key: `${item.no_perangkat}`,
                        id: 'no_perangkat',
                        name: item.nama_perangkat.length > 25? item.nama_perangkat.substring(0, 25) + '...' : item.nama_perangkat,
                        fullname: item.nama_perangkat,
                        location: item.nama_stasiun,
                        project: item.nama_projek,
                        count_1: parseInt(item.counts),
                        count_2: parseInt(item.counts),
                        cnt: parseInt(item.counts)/2,
                    }
                    arrPerangkat.push(obj)
                })

                const arrPart = setDataGraph(res.data.data.part, 'no_pvm', 'nama_part')
                const arrPenyebab = setDataGraph(res.data.data.penyebab, 'no_penyebab', 'penyebab')

                this.setState({
                    dataMasalah: res.data.data.masalah,
                    dataProjek: arrProjek,
                    dataPerangkat: arrPerangkat,
                    dataPart: arrPart,
                    dataPenyebab: arrPenyebab
                })
            }else{
                alert(res.data.message)
            }
        }else{
            alert(`${res.config?.baseURL} ${res.message}`)
        }
    }

    handleShowDetail = (query) => {
        this.setState({queryDetail: query, showModal: true})
    }

    render(){
        const {showLoader, showModal, queryDetail, dataMasalah, dataProjek, dataPerangkat, dataPart, dataPenyebab} = this.state
        return (
            <div className='grafik-container'>
    
                <div className='grafik-header'>
                    <div className='grafik-header-box'>
                        <p className='grafik-header-count'>{dataMasalah?.masalah_selesai_hari_ini}</p>
                        <div className='grafik-header-sub'>
                            <p className='grafik-header-title'>Today's Done</p>
                            <p className='grafik-header-view'
                                onClick={() => this.handleShowDetail("tanggal_done=current_date and status='Done'")}>
                                View Details
                            </p>
                        </div>
                    </div>
                    <div className='grafik-header-box'>
                        <p className='grafik-header-count'>{dataMasalah?.masalah_belum_selesai_hari_ini}</p>
                        <div className='grafik-header-sub'>
                            <p className='grafik-header-title'>Today's Unfinished</p>
                            <p className='grafik-header-view'
                                onClick={() => this.handleShowDetail("tanggal_done=current_date and status='Open' or status ='Pending'")}
                            >
                                View Details
                            </p>
                        </div>
                    </div>
                    <div className='grafik-header-box'>
                        <p className='grafik-header-count'>{dataMasalah?.total_masalah_selesai}</p>
                        <div className='grafik-header-sub'>
                            <p className='grafik-header-title'>Total Done</p>
                            <p className='grafik-header-view'
                                onClick={() => this.handleShowDetail("status='Done'")}
                            >
                                View Details
                            </p>
                        </div>
                    </div>
                    <div className='grafik-header-box'>
                        <p className='grafik-header-count'>{dataMasalah?.total_masalah_belum_selesai}</p>
                        <div className='grafik-header-sub'>
                            <p className='grafik-header-title'>Total Unfinished</p>
                            <p className='grafik-header-view'
                                onClick={() => this.handleShowDetail("status='Open' or status='Pending'")}
                            >
                                View Details
                            </p>
                        </div>
                    </div>
                </div>
    
                <div className='grafik-body'>
                    <div className='bg-blur grafik-body-box'>
                        <h1 className='grafik-body-boxtitle'>Most Project Problems</h1>
                        {dataProjek &&
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart width={400} height={400} margin={{top: -20, right: 90, bottom: 10, left: 50}}>
                                <Legend layout="vertical" verticalAlign="middle" align="right"/>
                                <Pie
                                    data={dataProjek}
                                    dataKey="count"
                                    nameKey='fullname'
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                >
                                    {dataProjek.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        }
                    </div>
                    <div className='bg-blur grafik-body-box'>
                        <h1 className='grafik-body-boxtitle'>Most Device Problems</h1>
                        {dataPerangkat &&
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart
                                    width={500}
                                    height={400}
                                    data={dataPerangkat}
                                    margin={{ top: 7, right: 20, bottom: 20, left: 20}}
                                    >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis dataKey="name" textAnchor= "end" sclaeToFit="true" verticalAnchor= "start" interval={0} angle='-12' stroke="#fff" fontSize={12} />
                                    <YAxis stroke='#fff'/>
                                    <Tooltip content={<DeviceTooltip color="#413ea0" />} />
                                    {/* <Area type="monotone" dataKey="count_1" fill="#8884d8" stroke="#8884d8" /> */}
                                    <Bar dataKey="count_1" barSize={30} fill="#413ea0" />
                                    <Line type="monotone" dataKey="count_2" stroke="#ff7300" />
                                    <Scatter dataKey="cnt" fill="red" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        }
                    </div>
                    <div className='bg-blur grafik-body-box'>
                        <h1 className='grafik-body-boxtitle'>Most Device (Part) Problems</h1>
                        {dataPart &&
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart
                                    width={500}
                                    height={400}
                                    data={dataPart}
                                    margin={{ top: 7, right: 20, bottom: 20, left: 20}}
                                    >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    {/* <XAxis dataKey="key" scale="band" stroke='#fff' /> */}
                                    <XAxis dataKey="name" textAnchor= "end" sclaeToFit="true" verticalAnchor= "start" interval={0} angle='-14' stroke="#fff" fontSize={11} />
                                    <YAxis stroke='#fff'/>
                                    <Tooltip content={<CustomTooltip color='#4b0082' />} />
                                    <Bar dataKey="count_1" barSize={30} fill="#4b0082" /* label={renderCustomBarLabel} */ />
                                    <Line type="monotone" dataKey="count_2" stroke="#ff7300" />
                                    <Scatter dataKey="cnt" fill="red" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        }
                    </div>
                    <div className='bg-blur grafik-body-box'>
                        <h1 className='grafik-body-boxtitle'>Most Common Cause of Problems</h1>
                        {dataPenyebab &&
                        <ResponsiveContainer width="100%" height="90%">
                            <ComposedChart
                                width={500}
                                height={400}
                                data={dataPenyebab}
                                margin={{ top: 7, right: 10, bottom: 20, left: 20}}
                                >
                                <CartesianGrid stroke="#f5f5f5" />
                                {/* <XAxis dataKey="key" scale="band" stroke='#fff' /> */}
                                <XAxis dataKey="name" textAnchor= "end" sclaeToFit="true" verticalAnchor= "start" interval={0} angle='-12' stroke="#fff" fontSize={8} />
                                <YAxis stroke='#fff'/>
                                <Tooltip content={<CustomTooltip color='#00C49F' />} />
                                <Bar dataKey="count_1" barSize={30} fill="#00C49F" />
                                <Line type="monotone" dataKey="count_2" stroke="#ff7300" />
                                <Scatter dataKey="cnt" fill="red" />
                            </ComposedChart>
                        </ResponsiveContainer>
                        }
                    </div>
                </div>
                {showModal && <ModalGrafik query={queryDetail} onClose={() => this.setState({showModal: false})} />}
            </div>
        )
    }
}

export default LogGrafik