import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';

export async function AgregarPedido(
	idcliente,
	producto,
	sugerencia,
	categoriaProducto,
	categoriaSugerencia,
	cantidadProducto,
	cantidadSugerencia,
	medidaProducto,
	medidaSugerencia,
	total,
	token
) {
	var pedido = [];
	if (categoriaProducto === 'Ropa' && categoriaSugerencia === 'Ropa') {
		// ambas tallas
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				talla: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				talla: medidaSugerencia
			}
		];
	} else if (categoriaProducto === 'Ropa' && categoriaSugerencia === 'Calzado') {
		// talla producto y numero sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				talla: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				numero: medidaSugerencia
			}
		];
	} else if (categoriaProducto === 'Ropa' && categoriaSugerencia === 'Otros') {
		// talla producto y sin medida sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				talla: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia
			}
		];
	} else if (categoriaProducto === 'Calzado' && categoriaSugerencia === 'Calzado') {
		// numero producto y numero sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				numero: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				talla: medidaSugerencia
			}
		];
	} else if (categoriaProducto === 'Calzado' && categoriaSugerencia === 'Ropa') {
		// numero producto y talla sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				numero: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				talla: medidaSugerencia
			}
		];
	} else if (categoriaProducto === 'Calzado' && categoriaSugerencia === 'Otros') {
		// numero producto y sin medida sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto,
				numero: medidaProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia
			}
		];
	} else if (categoriaProducto === 'Otros' && categoriaSugerencia === 'Otros') {
		// sin medida producto y sin medida sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia
			}
		];
	} else if (categoriaProducto === 'Otros' && categoriaSugerencia === 'Ropa') {
		// sin medida producto y talla sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				talla: medidaSugerencia
			}
		];
	} else if (categoriaProducto === 'Otros' && categoriaSugerencia === 'Calzado') {
		// sin medida producto y numero sugerencia
		pedido = [
			{
				producto: producto,
				cantidad: cantidadProducto
			},
			{
				producto: sugerencia,
				cantidad: cantidadSugerencia,
				numero: medidaSugerencia
			}
		];
	}

	await clienteAxios
		.post(
			'/pedidos/',
			{
				cliente: idcliente,
				pedido: pedido,
				total: total,
				estado_pedido: 'En proceso'
			},
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => {
			window.location.href = `/confirmacion_compra/${res.data.pedido._id}`
		})
		.catch((err) => {
			if(err.response){
				notification.error({
					message: 'Error',
					description: err.response.data.message,
					duration: 2
				});
			}else{
				notification.error({
					message: 'Error de conexion',
					description: 'Al parecer no se a podido conectar al servidor.',
					duration: 2
				});
			}
		});
}
