import HomeDashboard from "./components/HomeDashboard";
import DataUser from "./components/admin/DataUser";
import DataLokasi from "./components/admin/DataLokasi";
import DataPart from "./components/admin/DataPart";
import DataPenyebab from "./components/admin/DataPenyebab";
import DataPerangkat from "./components/admin/DataPerangkat";
import DataProjek from "./components/admin/DataProject";
import DataSolusi from "./components/admin/DataSolusi";
import NoMatch404 from "./components/NoMatch404";
import TroubleET from "./components/log/TroubleET";

const routes = [
    {
        path : "/index",
        layout: '/admin',
        component: HomeDashboard
    },
    {
        path : "/data-user",
        layout: '/admin',
        component: DataUser
    },
    {
        path : "/data-perangkat",
        layout: '/admin',
        component: DataPerangkat
    },
    {
        path : "/data-part",
        layout: '/admin',
        component: DataPart
    },
    {
        path : "/data-penyebab",
        layout: '/admin',
        component: DataPenyebab
    },
    {
        path : "/data-solusi",
        layout: '/admin',
        component: DataSolusi
    },
    {
        path : "/data-project",
        layout: '/admin',
        component: DataProjek
    },
    {
        path : "/data-lokasi",
        layout: '/admin',
        component: DataLokasi
    },
    {
        path : "/data-log",
        layout: '/admin',
        component: TroubleET
    },
    {
        path : "/*",
        layout: '/admin',
        component: NoMatch404
    }
]

export default routes