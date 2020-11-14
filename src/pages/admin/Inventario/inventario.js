import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Table, Tag, Input, notification, Badge, Spin, Row, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import './inventario.scss';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import GetDataFromExcelJusTInput from '../../../components/excel';

const { Search } = Input;

function Inventario(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ loading, setLoading ] = useState(false);
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
	const [ visible, setVisible ] = useState('d-none');
	const [ reload, setReload ] = useState(true);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	useEffect(
		() => {
			obtenerProductos(20, page);
		},
		[ page, reload ]
	);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'codigo',
			key: 'codigo',
			render: (text) => (!text ? <p className="h5">-</p> : <p className="h5">{text}</p>)
		},
		{
			title: 'Producto',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (text) => <p className="h5">{text}</p>
		},
		/* {
			title: 'tipo de Categoria',
			dataIndex: 'tipoCategoria',
			key: 'tipoCategoria',
			render: (text) => !text ? <p>-</p> : <p>{text.toLowerCase()}</p>
		}, */
		/* {
			title: 'Categoría',
			dataIndex: 'categoria',
			key: 'categoria',
			render: (text) => (!text ? <p className="h5">-</p> : <p className="h5">{text.toLowerCase()}</p>)
		},
		{
			title: 'Sub categoría',
			dataIndex: 'subCategoria',
			key: 'subCategoria',
			render: (text) => (!text ? <p className="h5">-</p> : <p className="h5">{text.toLowerCase()}</p>)
		}, */
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			render: (text) =>
				text === null ? (
					<p>-</p>
				) : text === 0 ? (
					<Badge count={text} showZero />
				) : (
					<Badge style={{ backgroundColor: '#52c41a' }} count={text} overflowCount={100000} />
				)
		},
		{
			title: 'Talla y Cantidad',
			dataIndex: 'tallas',
			key: 'tallas',
			render: (tallas) => (
				<div>
					{!tallas.length ? (
						<p className="h5">-</p>
					) : (
						tallas.map((talla) => {
							return (
								<Badge
									className="badge-inventario"
									key={talla._id}
									count={talla.cantidad}
									showZero
									style={
										talla.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<p className="h5">{talla.talla}</p>
								</Badge>
							);
						})
					)}
				</div>
			)
		},
		{
			title: 'Número y Cantidad',
			dataIndex: 'numeros',
			key: 'numeros',
			render: (numeros) => (
				<div>
					{!numeros.length ? (
						<p className="h5">-</p>
					) : (
						numeros.map((numero) => {
							return (
								<Badge
									className="badge-inventario"
									key={numero._id}
									count={numero.cantidad}
									showZero
									style={
										numero.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<p className="h5">{numero.numero}</p>
								</Badge>
							);
						})
					)}
				</div>
			)
		},
		{
			title: 'Estado',
			dataIndex: 'activo',
			key: 'activo',
			render: (estado) => (
				<div>{estado ? <Tag color="green">Activo</Tag> : <Tag color="processing">Pausado</Tag>}</div>
			)
		}
	];

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			obtenerProductos(20, page);
		} else {
			setVisible('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(
					`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}`
				)
				.then((res) => {
					setProductosRender(res.data.posts);
					setProductos(res.data.posts);
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
		}
	};

	const obtenerProductos = async (limit, page) => {
		setVisible('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosRender(res.data.posts.docs);
				setProductos(res.data.posts);
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

	return (
		<Spin size="large" spinning={loading}>
			<Row justify="center">
				<Search
					className="search-width"
					placeholder="Busca un producto"
					onSearch={(value) => obtenerProductosFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					size="large"
				/>

				<Button
					type="primary"
					size="large"
					className={`${visible} mb-5`}
					onClick={() => obtenerProductos(20, page)}
					icon={<RollbackOutlined style={{ fontSize: 24 }} />}
				>
					Volver
				</Button>
				<GetDataFromExcelJusTInput reload={[reload, setReload]} />
			</Row>
			{/* <div className="d-flex justify-content-center my-3">
				<GetDataFromExcelJusTInput reload={[reload, setReload]} />
			</div> */}
			
			<Table
				className="tabla-inventario"
				columns={columns}
				dataSource={productosRender}
				pagination={false}
				rowKey={(producto) => producto._id}
				scroll={{ x: 1200 }}
			/>
			<div className="mt-5">
				<Pagination blogs={productos} location={location} history={history} limite={20} />
			</div>
		</Spin>
	);
}
export default withRouter(Inventario);
