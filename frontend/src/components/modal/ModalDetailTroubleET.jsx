import { Drawer, Button } from 'antd';
import moment from 'moment';
import Helper from '../../helpers/Helper';
import 'moment/locale/id'  // without this line it didn't work

const rowFlex = {
    display: 'flex', flexDirection: 'row'
}
const colFlex = {
    display: 'flex', flexDirection: 'column'
}
const titleStyle = {
    minWidth: 225, width: '225px', fontSize: 20
}

const ModalDetailTroubleET = ({onClose, visible, data}) => {
    moment.locale('es')
    
    return (
      <>
        <Drawer
            title="Detail Trouble ET"
            width={720}
            placement='left'
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button onClick={onClose} type="primary">
                        O K
                    </Button>
                </div>
            }
        >
        {data &&
            <div style={colFlex}>
                <div style={rowFlex}>
                    <label style={titleStyle}>No Ticket</label>
                    <label style={{fontSize: 20}}>: {data.no}</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Tanggal Masalah</label>
                    <label style={{fontSize: 20}}>: {moment(data.tanggal_masalah, moment(data.tanggal_masalah).creationData().format).format('dddd, DD MMMM YYYY')} {data.jam_masalah}</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Tanggal Done</label>
                    <label style={{fontSize: 20}}>: {moment(data.tanggal_done, moment(data.tanggal_done).creationData().format).format('dddd, DD MMMM YYYY')} {data.jam_done}</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Total Downtime</label>
                    <label style={{fontSize: 20}}>: {data.totaldowntime}</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Jenis Laporan</label>
                    <label style={{fontSize: 20}}>: {data.jenislaporan}</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Projek</label>
                    <label style={{fontSize: 20}}>: {data.nama_projek} ({data.no_projek})</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Lokasi</label>
                    <label style={{fontSize: 20}}>: {data.nama_stasiun} ({data.ip})</label>
                </div>
                <div style={rowFlex}>
                    <label style={titleStyle}>Perangkat</label>
                    <label style={{fontSize: 20}}>: {data.nama_perangkat}</label>
                </div>
                {data.nama_part &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Part</label>
                    <label style={{fontSize: 20}}>: {data.nama_part}</label>
                </div>
                }
                <div style={rowFlex}>
                    <label style={titleStyle}>Problem</label>
                    <label style={{fontSize: 20}}>: {data.problem}</label>
                </div>
                {data.penyebab &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Penyebab</label>
                    <label style={{fontSize: 20}}>: {data.penyebab}</label>
                </div>
                }
                <div style={rowFlex}>
                    <label style={titleStyle}>Solusi</label>
                    <label style={{fontSize: 20}}>: {data.solusi}</label>
                </div>
                {data.sumber &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Sumber</label>
                    <label style={{fontSize: 20}}>: {data.sumber}</label>
                </div>
                }
                {data.refnumber &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Ref Number</label>
                    <label style={{fontSize: 20}}>: {data.refnumber}</label>
                </div>
                }
                {data.refnotrouble &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Ref No Trouble</label>
                    <label style={{fontSize: 20}}>: {data.refnotrouble}</label>
                </div>
                }
                {data.teknisi &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Teknisi</label>
                    <label style={{fontSize: 20}}>: {data.teknisi}</label>
                </div>
                }
                {data.arah_gate &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Arah Gate</label>
                    <label style={{fontSize: 20}}>: {data.arah_gate}</label>
                </div>
                }
                <div style={rowFlex}>
                    <label style={titleStyle}>Status</label>
                    <label style={{fontSize: 20}}>: {data.status}</label>
                </div>
                <br />
                {data.pic_before &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Picture Before</label>
                    <img src={Helper.getASCIIAsBase64(data.pic_before)} alt="pic_before" />
                </div>
                }
                <br />
                {data.pic_after &&
                <div style={rowFlex}>
                    <label style={titleStyle}>Picture After Done</label>
                    <img src={Helper.getASCIIAsBase64(data.pic_after)} alt="pic_after" />
                </div>
                }
            </div>
        }
        </Drawer>
      </>
    );
}

export default ModalDetailTroubleET