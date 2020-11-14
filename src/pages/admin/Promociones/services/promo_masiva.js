import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import {
	Button,
	Input,
	Slider,
	Table,
	Avatar,
	notification,
	Result,
	Spin,
	Form,
	Col,
	Alert,
	Select,
	Tooltip
} from 'antd';
import { RollbackOutlined, ClearOutlined, UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import './registrar_promocion.scss';
import InfiniteScroll from 'react-infinite-scroller';
import aws from '../../../../config/aws';

const { Search } = Input;
const demo = { height: '500px', overflow: 'auto' };
const { Option } = Select;

const Promo_masiva = (props) => {
	const token = localStorage.getItem('token');

	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();
	const [ reloadData, setReloadData ] = useState(false);
	const [ visible, setVisible ] = useState('d-none');

	const [ loading, setLoading ] = useState(false);
	const [ loadingList, setLoadingList ] = useState(true);
	const [ loadingSelect, setLoadingSelect ] = useState(false);
	const [ disabled, setDisabled ] = useState(true);
	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ disabledSumit, setDisabledSumit ] = useState(true);
	const [ inputValue, setInputValue ] = useState(0);
	const reload = props.reload;

	const [ categoriasDB, setCategoriasDB ] = useState([]);
	const [ categoria, setCategoria ] = useState();
	const [ subcategoriasDB, setSubcategoriasDB ] = useState([]);
	const [ subcategoria, setSubcategoria ] = useState();
	const [ generosDB, setGenerosDB ] = useState([]);
	const [ genero, setGenero ] = useState();

	useEffect(
		() => {
			if (reload) {
				limpiar();
			}
			obtenerCategorias();
			obtenerGeneros();
			obtenerProductos((res) => {
				setData(res.data.posts.docs);
				setTotalDocs(res.data.posts.totalDocs);
				setPage(res.data.posts.nextPage);
			});
		},
		[ reload, reloadData ]
	);

	const limpiarFiltros = () => {
		setCategoria();
		setSubcategoria();
		setGenero();
		setPage(1);
		setHasMore(true);
		setReloadData(true);
	};

	const limpiar = () => {
		setInputValue(0);
		setPage(1);
		setHasMore(true);
		setProducto([]);
		setDisabledSumit(true);
	};

	const error = (err) => {
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
	};

	const obtenerProductos = (callback) => {
		setReloadData(false);
		setVisible('d-none');
		setLoadingList(true);
		clienteAxios
			.get(`/productos?limit=${12}&page=${page}`)
			.then((res) => {
				callback(res);
				setLoadingList(false);
			})
			.catch((err) => {
				setLoadingList(false);
				error(err);
			});
	};

	const handleInfiniteOnLoad = () => {
		setLoadingList(true);
		if (data.length === totalDocs) {
			setLoadingList(false);
			setHasMore(false);
			return;
		}
		obtenerProductos((res) => {
			setPage(res.data.posts.nextPage);
			setData(data.concat(res.data.posts.docs));
		});
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => {
		setInputValue(value);
		console.log(value)
		if(value > 0){
			setDisabled(false);
		}else{
			setDisabled(true);
		}
	};

	const subirPromocion = async () => {
		/* setLoading(true);
		const formData = new FormData();
		formData.append('productoPromocion', producto._id);
		formData.append('precioPromocion', precioPromocion);
		await clienteAxios
			.post(`/productos/promocion/`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				setLoading(false);
				error(err);
			}); */
	};

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			setPage(1);
			setHasMore(true);
			setReloadData(true);
		} else {
			setVisible('ml-1 d-flex justify-content-center align-items-center');
			setLoadingList(true);
			await clienteAxios
				.get(
					`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}`
				)
				.then((res) => {
					setData(res.data.posts);
					setLoadingList(false);
				})
				.catch((err) => {
					setLoadingList(false);
					error(err);
				});
		}
	};

	const obtenerFiltrosDivididos = async (categoria, subcategoria, genero) => {
		var cat = categoria;
		var sub = subcategoria;
		var gen = genero;

		if (categoria === undefined) {
			cat = '';
		}
		if (subcategoria === undefined) {
			sub = '';
		}
		if (genero === undefined) {
			gen = '';
		}

		setLoadingList(true);
		await clienteAxios
			.get(`/productos/filter?categoria=${cat}&subcategoria=${sub}&genero=${gen}`)
			.then((res) => {
				console.log(res);
				setData(res.data.posts);
				setLoadingList(false);
			})
			.catch((err) => {
				setLoadingList(false);
				error(err);
			});
	};

	async function obtenerCategorias() {
		setLoadingSelect(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCategoriasDB(res.data);
				setLoadingSelect(false);
			})
			.catch((res) => {
				setLoadingSelect(false);
			});
	}
	async function obtenerGeneros() {
		await clienteAxios
			.get('/productos/agrupar/generos')
			.then((res) => {
				setGenerosDB(res.data);
			})
			.catch((err) => {
				error(err);
			});
	}

	const selectCategoria = (categoria) => {
		setCategoria(categoria);
		setSubcategoria(null);
		if (genero && genero.length !== 0) {
			obtenerFiltrosDivididos(categoria, undefined, genero);
		} else {
			obtenerFiltrosDivididos(categoria);
		}
		categoriasDB.map((res) => {
			if (categoria === res.categoria) {
				setSubcategoriasDB(res.subcCategoria);
			}
		});
	};
	const selectSubCategoria = (subcategoria) => {
		setSubcategoria(subcategoria);
		if (genero && genero.length !== 0) {
			obtenerFiltrosDivididos(categoria, subcategoria, genero);
		} else {
			obtenerFiltrosDivididos(categoria, subcategoria);
		}
	};
	const selectGenero = (genero) => {
		setGenero(genero);
		if (categoria && categoria.length !== 0 && !subcategoria) {
			obtenerFiltrosDivididos(categoria, undefined, genero);
		} else if (categoria && subcategoria && categoria.length !== 0 && subcategoria.length !== 0) {
			obtenerFiltrosDivididos(categoria, subcategoria, genero);
		} else if (!categoria && !subcategoria && genero) {
			obtenerFiltrosDivididos(undefined, undefined, genero);
		}
	};

	/* Checklist */
	const columns = [
		{
			title: 'Imagen',
			dataIndex: 'imagen',
			render: (imagen) => <Avatar src={aws + imagen} />
		},
		{
			title: 'Producto',
			dataIndex: 'nombre'
		}
	];
	const [ promocionMasiva, setPromocionMasiva ] = useState([]);
	const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
	const hasSelected = selectedRowKeys.length > 0;

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
		selectedRowKeys.map((res) => {
			setPromocionMasiva([ ...promocionMasiva, { idproducto: res._id } ]);
		});
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	/* Checklist fin */

	return (
		<Spin size="large" spinning={loading}>
			<div className="d-lg-flex d-sm-block">
				<div className="col-12 col-lg-6 border-bottom">
					<div className=" mt-2 d-flex justify-content-center">
						<Alert
							showIcon
							message="En este apartado puedes agregar promociones masivas, por categoria elegida"
							type="info"
						/>
					</div>
					<Spin size="large" spinning={loadingList}>
						<div className=" mt-3 row justify-content-center">
							<Search
								placeholder="Busca un producto"
								onSearch={(value) => obtenerProductosFiltrados(value)}
								style={{ width: 350, height: 40, marginBottom: 10 }}
								enterButton="Buscar"
								size="large"
							/>

							<Button
								type="primary"
								size="large"
								className={visible}
								onClick={() => {
									setPage(1);
									setHasMore(true);
									setReloadData(true);
								}}
								icon={<RollbackOutlined style={{ fontSize: 24 }} />}
							>
								Volver
							</Button>
						</div>
						<div className="d-flex justify-content-center">
							<Select
								value={categoria}
								size="small"
								placeholder="Categoria"
								style={{ width: 120 }}
								onChange={selectCategoria}
								loading={loadingSelect}
							>
								{categoriasDB.length !== 0 ? (
									categoriasDB.map((res) => {
										return (
											<Option key={res.categoria} value={res.categoria}>
												{res.categoria}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Select
								disabled={!categoria ? true : false}
								value={subcategoria}
								size="small"
								placeholder="Subcategoria"
								style={{ width: 120 }}
								onChange={selectSubCategoria}
								value={subcategoria}
							>
								{subcategoriasDB.length !== 0 ? (
									subcategoriasDB.map((res) => {
										return (
											<Option key={res._id} value={res._id}>
												{res._id}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Select
								value={genero}
								size="small"
								placeholder="Genero"
								style={{ width: 120 }}
								onChange={selectGenero}
							>
								{generosDB.length !== 0 ? (
									generosDB.map((res) => {
										return (
											<Option key={res._id} value={res._id}>
												{res._id}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Tooltip placement="bottom" title="Limpiar filtros">
								<ClearOutlined className="ml-2" style={{ fontSize: 20 }} onClick={limpiarFiltros} />
							</Tooltip>
						</div>
						{loading ? (
							<div />
						) : data.length === 0 ? (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result
									status="404"
									title="Articulo no encontrado"
									subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
								/>
							</div>
						) : (
							<div style={demo}>
								<div className="my-2">
									<span style={{ marginLeft: 8 }}>
										{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
									</span>
								</div>
								<InfiniteScroll
									initialLoad={false}
									pageStart={1}
									loadMore={handleInfiniteOnLoad}
									hasMore={!loading && hasMore}
									useWindow={false}
									threshold={5}
								>
									<Table
										rowKey={(producto) => producto}
										rowSelection={rowSelection}
										columns={columns}
										dataSource={data}
										pagination={false}
									/>
								</InfiniteScroll>
							</div>
						)}
					</Spin>
				</div>
				<div className="col-12 col-lg-6">
					<div className="mt-5">
						<div className="d-flex justify-content-center my-3">
							<h2 className={selectedRowKeys.length !== 0 ? 'd-none' : 'd-block'}>Selecciona los productos que quieres aplicarles una promoción</h2>
							{selectedRowKeys.map((res, index) => {
								if (index < 6) {
									return <Avatar size={64} src={aws + res.imagen} />;
								}
							})}
							{selectedRowKeys.length > 6 ? (
								<Tooltip
									title={selectedRowKeys.map((res, index) => {
										if (index >= 6) {
											return <p>{res.nombre}</p>;
										}
									})}
									placement="bottomRight"
									autoAdjustOverflow
								>
									<Avatar size={64} style={{ fontSize: 25 }}>
										+{selectedRowKeys.length - 6}
									</Avatar>
								</Tooltip>
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
									value={typeof inputValue === 'number' ? inputValue : 0}
									marks={{ 0: '0%', 50: '50%', 100: '100%' }}
								/>
								<Button disabled={disabled} onClick={subirPromocion}>
									Guardar promoción masiva
								</Button>
							</Col>
						</div>
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default Promo_masiva;
