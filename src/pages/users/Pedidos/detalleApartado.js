import React from 'react';
import { Tag, Divider, Col, Card, Result } from 'antd';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import aws from '../../../config/aws';

const { Meta } = Card;

export default function detalleApartado(props) {
	const { detalleApartado } = props;
	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del Apartado</Divider>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">ID del Apartado: </h6>
					<p className=""> {detalleApartado._id} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Fecha de apartado:</h6>
					<p className=""> {formatoFecha(detalleApartado.createdAt)} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Estatus:</h6>
					<p className="m-0" style={{ fontSize: '15px' }}>
						<Tag
							className="ml-2"
							color={
								detalleApartado.estado === 'ACEPTADO' ? (
									'#5cb85c'
								) : detalleApartado.estado === 'PROCESANDO' ? (
									'#f0ad4e'
								) : detalleApartado.estado === 'ENVIADO' ? (
									'#5cb85c'
								) : (
									'#F75048'
								)
							}
						>
							{detalleApartado.estado === 'ACEPTADO' ? (
								'Apartado aceptado'
							) : detalleApartado.estado === 'PROCESANDO' ? (
								'Apartado en proceso'
							) : detalleApartado.estado === 'ENVIADO' ? (
								'Apartado enviado'
							) : (
								'Apartado cancelado'
							)}
						</Tag>
					</p>
				</div>
			</div>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Tipo de entrega:</h6>
					<p className="m-0" style={{ fontSize: '15px' }}>
						<Tag
							className="ml-2"
							color={detalleApartado.tipoEntrega === 'RECOGIDO' ? '#f0ad4e' : '#5cb85c'}
						>
							{detalleApartado.tipoEntrega === 'ENVIO' ? 'Envio por paqueteria' : 'Recoger a sucursal'}
						</Tag>
					</p>
				</div>
				{detalleApartado.tipoEntrega === 'ENVIO' ? (
					<div className="my-2 col-lg-4">
						<h6 className="titulos-info-pedidos">Paqueteria:</h6>
						<p> {detalleApartado.paqueteria} </p>
					</div>
				) : (
					''
				)}

				{detalleApartado.tipoEntrega === 'ENVIO' ? (
					<div className="my-2 col-lg-4">
						<h6 className="titulos-info-pedidos">Fecha de envio:</h6>
						<p> {detalleApartado.fecha_envio} </p>
					</div>
				) : (
					''
				)}
			</div>

			<Divider className="text-center">Productos del apartado</Divider>

			<div className="row">
				<Producto producto={detalleApartado.producto} />
			</div>

			{detalleApartado.tipoEntrega === 'ENVIO' ? detalleApartado.estado === 'ENVIADO' ? (
				<div>
					<Divider className="text-center">Seguimiento de Apartado</Divider>
					<Result
						icon={<FontAwesomeIcon icon={faBus} style={{ fontSize: '50px' }} />}
						title={
							<div>
								<p className="font-weight-bold">Dirección de envio:</p>
								<p>
									{' '}
									{`${detalleApartado.cliente.direccion[0].calle_numero} Colonia ${detalleApartado
										.cliente.direccion[0].colonia} ${detalleApartado.cliente.direccion[0]
										.ciudad} ${detalleApartado.cliente.direccion[0].estado} ${detalleApartado
										.cliente.direccion[0].pais}.`}{' '}
								</p>
								<p>
									{' '}
									{`Referencia: ${detalleApartado.cliente.direccion[0]
										.entre_calles}. CP: ${detalleApartado.cliente.direccion[0].cp}`}{' '}
								</p>
								<p>
									{' '}
									<span className="font-weight-bold">Codigó de seguimiento: </span>
								</p>
								<p>
									<a
										href={`${detalleApartado.url}${detalleApartado.codigo_seguimiento}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{' '}
										{detalleApartado.codigo_seguimiento}{' '}
									</a>
								</p>
							</div>
						}
					/>
				</div>
			) : (
				''
			) : (
				''
			)}
			<div className="my-2">
				<h6 className="titulos-info-pedidos h4 mt-3">
					Total: $ {formatoMexico(detalleApartado.producto.precio)}
				</h6>
			</div>
		</div>
	);
}

function Producto(props) {
	const { producto } = props;

	return (
		<div>
			<Col span={4} key={producto._id} className="col-lg-12 col-sm-12">
				<Link to={`/vista_producto/${producto._id}`}>
					<Card
						hoverable
						style={{ width: 250 }}
						cover={
							<div className="contenedor-imagen-detalle-apartado">
								<img
									alt="example"
									className="imagen-detalle-apartado"
									src={aws+producto.imagen}
								/>
							</div>
						}
					>
						<Meta
							title={producto.nombre}
							description={<h2 className="h5 precio-rebaja">${formatoMexico(producto.precio)}</h2>}
						/>
					</Card>
				</Link>
			</Col>
		</div>
	);
}
