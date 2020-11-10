import { notification } from 'antd';
import clienteAxios from '../../../../config/axios';

export default async function obtenerGeneros() {
    await clienteAxios
        .get('/productos/agrupar/generos')
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            if (err.response) {
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                    duration: 2
                });
            } else {
                notification.error({
                    message: 'Error de conexion',
                    description: 'Al parecer no se a podido conectar al servidor.',
                    duration: 2
                });
            }
        });
}