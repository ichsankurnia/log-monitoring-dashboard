import axios from "axios";

export const baseURL = "http://localhost:1212"
// export const baseURL = 'https://heroku-node-whatasappbe.herokuapp.com'

const api = axios.create({
    baseURL: baseURL,
    headers: {
        // authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
        "Content-Type": "application/json"
    }
})

export const getAllTroubleET = async () => {
    try {
        const data = await api.get('/api/troubleet')
        return data
    } catch (error) {
        if(error.response) return error.response
        else return JSON.parse(JSON.stringify(error))       
    }
}

export const getDetailTroubleET = async (ticketNum) => {
    try {
        const data = await api.get(`/api/troubleet/${ticketNum}`)
        return data
    } catch (error) {
        if(error.response) return error.response
        else return JSON.parse(JSON.stringify(error))       
    }
}

export const addNewTroubleET = async (payload) => {
    try {
        const data = await api.post('/api/troubleet', payload)
        return data
    } catch (error) {
        if(error.response) return error.response
        else return JSON.parse(JSON.stringify(error))
    }
}


export const updateTroubleET = async (ticketNum, payload) => {
    try {
        const data = await api.patch(`/api/troubleet/${ticketNum}`, payload)
        return data
    } catch (error) {
        if(error.response) return error.response
        else return JSON.parse(JSON.stringify(error))
    }
}


export const deleteTroubleET = async (ticketNum) => {
    try {
        const data = await api.delete(`/api/troubleet/${ticketNum}`)
        return data
    } catch (error) {
        if(error.response) return error.response
        else return JSON.parse(JSON.stringify(error))
    }
}


export default api