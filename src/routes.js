import HomeDashboard from "./components/HomeDashboard";
import DataUser from "./components/admin/DataUser";
import DataLokasi from "./components/admin/DataLokasi";
import DataPart from "./components/admin/DataPart";
import DataPenyebab from "./components/admin/DataPenyebab";
import DataPerangkat from "./components/admin/DataPerangkat";
import DataProjek from "./components/admin/DataProject";
import DataSolusi from "./components/admin/DataSolusi";
import NoMatch404 from "./components/NoMatch404";

const routes = [
    {
        path : "/",
        exact: true,
        component: HomeDashboard
    },
    {
        path : "/admin/data-user",
        component: DataUser
    },
    {
        path : "/admin/data-perangkat",
        component: DataPerangkat
    },
    {
        path : "/admin/data-part",
        component: DataPart
    },
    {
        path : "/admin/data-penyebab",
        component: DataPenyebab
    },
    {
        path : "/admin/data-solusi",
        component: DataSolusi
    },
    {
        path : "/admin/data-project",
        component: DataProjek
    },
    {
        path : "/admin/data-lokasi",
        component: DataLokasi
    },
    {
        path : "*",
        component: NoMatch404
    }
]

export default routes