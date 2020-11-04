import React, { useState } from 'react';
import { notification, Modal, Select, Divider, Alert } from 'antd';
import { formatoMexico } from '../../../config/reuserFunction';
import { AgregarApartado } from './services/consultas_individuales';
import DatosCliente from '../Vista_Producto/subs/datos_cliente';
import aws from '../../../config/aws';

const { Option } = Select;

export default function ModalApartado(props) {
	const [ visible, setVisible ] = props.visible;
	const { carrito, cliente, token } = props;
	const [ tipoEnvio, setTipoEnvio ] = useState('');

	const handleOk = (e) => {
		if (!tipoEnvio) {
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		} else {
            AgregarApartado(cliente._id, carrito.idarticulo._id, carrito.cantidad, carrito.medida, tipoEnvio, token, carrito.idarticulo.tipoCategoria);
			setVisible(false);
		}
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	function obtenerTipoEnvio(value) {
		setTipoEnvio(value);
	}

	return (
		<Modal
			title="Nuevo Apartado"
			visible={visible}
			/* onOk={handleOk} */
			onCancel={handleCancel}
			/* cancelText="Cancelar"
			okText="Apartar" */
			width={700}
		>
			<div className="row">
				<div className="col-12 col-lg-6">
					<div className="mb-3">
						<h6 className="d-inline">Porducto: </h6>
						<p className="d-inline">{carrito.idarticulo.nombre}</p>
					</div>

					{carrito.medida.length !== 0 ? (
						<div className="mb-3">
							<h6 className="d-inline">Talla: </h6>
							{carrito.medida.map((res) => {
								if (res.talla) {
									return (
										<p key={res._id} className="d-inline">
											{res.talla}
										</p>
									);
								} else if (res.numero) {
									return (
										<p key={res._id} className="d-inline">
											{res.numero}
										</p>
									);
								}
								return null;
							})}
						</div>
					) : (
						<div />
					)}

					<div className="mb-3">
						<h6 className="d-inline">Cantidad: </h6>
						<p className="d-inline">{carrito.cantidad}</p>
					</div>
					{!carrito.promocion ? (
						<div className="mb-3">
							<h6 className="d-inline">Precio: </h6>
							<p className="d-inline">${formatoMexico(carrito.idarticulo.precio)}</p>
						</div>
					) : (
						<div className="mb-3">
							<h6 className="d-inline">Precio: </h6>
							<p className="d-inline">${formatoMexico(carrito.promocion.precioPromocion)}</p>
						</div>
					)}
					<div className="mb-3">
						<h6>Elegir tipo de envío: </h6>
						<Select style={{ width: 200 }} placeholder="Selecciona uno" onChange={obtenerTipoEnvio}>
							<Option value="ENVIO">Envio por paqueteria</Option>
							<Option value="REGOGIDO">Recoger a sucursal</Option>
						</Select>
					</div>
					<Alert
						description="Para apartar un producto necesitas tener completos tus datos"
						type="info"
						showIcon
					/>
				</div>
				<div className="col-12 col-lg-6">
					<div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
						<img
							className="imagen-producto-principal"
							alt="producto"
							src={aws+carrito.idarticulo.imagen}
						/>
					</div>
				</div>
			</div>
			<Divider>Tus datos</Divider>
				<DatosCliente token={token} clienteID={cliente._id} tipoEnvio={tipoEnvio} enviarDatos={[ handleOk ]} />
		</Modal>
	);
}
