import axios from 'axios'
import 'dotenv';

const clienteAxios = axios.create({
    baseURL : 'https://tienda-prueba-back.herokuapp.com/api'
})

export default clienteAxios