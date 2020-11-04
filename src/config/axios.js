import axios from 'axios'
require('dotenv').config();

const clienteAxios = axios.create({
    baseURL : process.env.REACT_APP_AXIOS
})

export default clienteAxios