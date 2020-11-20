import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import {
	Drawer,
	Button,
	Input,
	Slider,
	Table,
	Avatar,
	notification,
	Result,
	Spin,
	Col,
	Select,
	Tooltip,
	Tag
} from 'antd';
import { ClearOutlined, EditOutlined, UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import aws from '../../../../config/aws';
import QueueAnim from 'rc-queue-anim';

const { Search } = Input;
const { Option } = Select;

export default function ActualizarPromocionMasiva(props) {
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ inputValue, setInputValue ] = useState(0);
	const [ reload, setReload ] = props.reload;
	const [ visible, setVisible ] = props.visible;
	const { promoMasiva } = props;

	const onClose = () => {
		setVisible(false);
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => setInputValue(value);

	const obtenerPromo = () => {
		promoMasiva.map((promo) => {
			setInputValue(promo.porsentajePromocionMasiva);
		});
	};

	const actualizarPromocion = async () => {
		setLoading(true);
		await clienteAxios
			.put(
				`/promocion/masiva/`,
				{
					idPromocionMasiva: promoMasiva[0].idPromocionMasiva,
					descuento: inputValue
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				notification.success({
					message: '¡Listo!',
					description: res.data.message,
					duration: 2
				});
				onClose();
				setReload(!reload);
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

	useEffect(
		() => {
			obtenerPromo();
		},
		[ promoMasiva ]
	);

	return (
		<div>
			<Drawer
				title="Actualizar promoción masiva"
				width={window.screen.width > 768 ? 700 : window.screen.width}
				onClose={onClose}
				visible={visible}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={onClose} style={{ marginRight: 8 }}>
							Cancelar
						</Button>
						<Button type="primary" onClick={actualizarPromocion}>
							Guardar promoción masiva
						</Button>
					</div>
				}
			>
				<Spin size="large" spinning={loading}>
					<div className="contenedor-masivas">
						<div>
							<div>
								<Avatar.Group
									maxCount={2}
									size="large"
									maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
								>
									<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
									<Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
									<Tooltip title="Ant User" placement="top">
										<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
									</Tooltip>
									<Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
								</Avatar.Group>
							</div>
							<div className="d-flex justify-content-center my-3">
								<QueueAnim type={[ 'top', 'bottom' ]} leaveReverse className="d-flex">
									{promoMasiva.map((res, index) => {
										if (index < 5) {
											return (
												<Avatar
													key={index}
													size={64}
													src={aws + res.productoPromocion.imagen}
												/>
											);
										}
									})}
								</QueueAnim>

								{promoMasiva.length > 5 ? (
									<QueueAnim type={[ 'top', 'bottom' ]} leaveReverse>
										<Tooltip
											key="demo"
											title={promoMasiva.map((res, index) => {
												if (index >= 5) {
													return <p key={res._id}>{res.productoPromocion.nombre}</p>;
												}
											})}
											placement="bottomRight"
											autoAdjustOverflow
										>
											<Avatar size={64} style={{ fontSize: 25 }}>
												+{promoMasiva.length - 5}
											</Avatar>
										</Tooltip>
									</QueueAnim>
								) : null}
							</div>
							<div className="d-flex justify-content-center">
								<Col>
									<div className="precio-box porcentaje-descuento d-inline text-center">
										<p style={{ fontSize: 25 }}> {inputValue} %OFF</p>
									</div>

									<Slider
										min={0}
										max={100}
										tipFormatter={formatter}
										onChange={onChange}
										value={inputValue}
										marks={{ 0: '0%', 50: '50%', 100: '100%' }}
									/>
								</Col>
							</div>
						</div>
					</div>
				</Spin>
			</Drawer>
		</div>
	);
}
