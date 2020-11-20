import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Space, Button, Avatar, notification, Result, Spin, Modal, List } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import aws from '../../../../config/aws';
import RegistroPromocionMasiva from './registrar_promocion_masiva';
import ActualizarPromocionMasiva from './actualizar_promo_masiva';

const { confirm } = Modal;

const PromoMasivaPrincipal = (props) => {
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ data, setData ] = useState([]);
	const [ reload, setReload ] = useState(true);

	const [ actualizar, setActualizar ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ promo, setPromo ] = useState([]);

	const obtenerPromosMasivas = async () => {
		setLoading(true);
		await clienteAxios
			.get('/promocion/masiva')
			.then((res) => {
				setData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
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
	};

	const eliminarPromocionMasiva = async (idPromoMasiva) => {
		await clienteAxios
			.delete(`promocion/masiva/${idPromoMasiva}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				notification.success({
					message: '¡Listo!',
					description: res.data.message,
					duration: 2
				});
				setReload(!reload);
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
	};

	function showDeleteConfirm(idPromoMasiva) {
		confirm({
			title: 'estas seguro de eliminar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarPromocionMasiva(idPromoMasiva);
			}
		});
	}

	const actualizarActive = (promo) => {
		setActualizar(true);
		setPromo(promo);
		setVisible(true);
	};

	useEffect(
		() => {
			obtenerPromosMasivas();
		},
		[ reload ]
	);

	return (
		<div>
			<RegistroPromocionMasiva
				reload={[ reload, setReload ]}
				visible={[ visible, setVisible ]}
				promoMasiva={promo}
				actualizar={[ actualizar, setActualizar ]}
			/>
			{/* <ActualizarPromocionMasiva
				reload={[ reload, setReload ]}
				
			/> */}
			<Spin size="large" spinning={loading}>
				<List
					itemLayout="horizontal"
					dataSource={data}
					renderItem={(item) => (
						<List.Item
							actions={[
								<Space>
									<Button
										className="d-flex justify-content-center align-items-center"
										style={{ fontSize: 16 }}
										type="primary"
										onClick={() => actualizarActive(item.productosPromoMasiva)}
									>
										<EditOutlined /> Editar
									</Button>
									<Button
										className="d-flex justify-content-center align-items-center"
										danger
										style={{ fontSize: 16 }}
										onClick={() => {
											showDeleteConfirm(item.productosPromoMasiva[0].idPromocionMasiva);
										}}
									>
										<DeleteOutlined />
										Eliminar
									</Button>
								</Space>
							]}
						>
							<List.Item.Meta
								avatar={
									window.screen.width > 768 ? (
										<div>
											{item.productosPromoMasiva.map((promo, index) => {
												if (index < 10) {
													return (
														<Avatar
															key={promo._id}
															size={64}
															src={aws + promo.productoPromocion.imagen}
														/>
													);
												}
											})}
											{item.productosPromoMasiva.length > 10 ? (
												<Avatar size={64} style={{ fontSize: 25 }}>
													+{item.productosPromoMasiva.length - 10}
												</Avatar>
											) : null}
										</div>
									) : (
										<div>
											{item.productosPromoMasiva.map((promo, index) => {
												if (index < 1) {
													return (
														<Avatar
															key={promo._id}
															size={64}
															src={aws + promo.productoPromocion.imagen}
														/>
													);
												}
											})}
											{item.productosPromoMasiva.length > 1 ? (
												<Avatar size={64} style={{ fontSize: 25 }}>
													+{item.productosPromoMasiva.length - 1}
												</Avatar>
											) : null}
										</div>
									)
								}
								title={
									<div>
										<h3 style={{ color: '#22BB33' }}>{`${item.productosPromoMasiva[0]
											.porsentajePromocionMasiva}%`}</h3>
									</div>
								}
								description={<h4>De descuento</h4>}
							/>
						</List.Item>
					)}
				/>
			</Spin>
		</div>
	);
};

export default PromoMasivaPrincipal;
