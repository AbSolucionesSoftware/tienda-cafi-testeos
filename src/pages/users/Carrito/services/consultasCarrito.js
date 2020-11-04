import clienteAxios from '../../../../config/axios';
import { message } from 'antd';

export async function actualizarCantidad(cliente, articulo, categoria, cantidad, medida, token) {
    var datos = {};
	switch (categoria) {
		case 'otros':
            datos = {
                cantidad: cantidad
            }
			break;
		case 'ropa':
            datos = {
                cantidad: cantidad,
                talla: medida
            }
			break;
		case 'calzado':
            datos = {
                cantidad: cantidad,
                numero: medida
            }
			break;
		default:
			break;
    }
	await clienteAxios
		.put(`/carrito/${cliente}/articulo/${articulo}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
            message.success(res.data.message);
		})
		.catch((err) => {
			console.log(err);
        });
        return true;
}
