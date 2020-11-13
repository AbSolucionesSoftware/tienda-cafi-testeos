import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : 'https://tiendaab.herokuapp.com/api'
})

export default clienteAxios