import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

const apiPython = axios.create({
    baseURL: 'http://localhost:5001',

})

export const insertLawToken = payload => api.post(`/lawToken`, payload)
export const getAllLawTokens = () => api.get(`/lawTokens`)
export const updateLawTokenById = (id, payload) => api.put(`/lawToken/${id}`, payload)
export const deleteLawTokenById = id => api.delete(`/lawToken/${id}`)
export const getLawTokenById = id => api.get(`/lawToken/${id}`)

export const getLawTree = document => apiPython.get(`/getLawTree/${document}`)

const apis = {
    insertLawToken,
    getAllLawTokens,
    updateLawTokenById,
    deleteLawTokenById,
    getLawTokenById,
    getLawTree,
}

export default apis