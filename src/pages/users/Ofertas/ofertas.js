import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Spin, Result, Col, Row } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import { Link, withRouter } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import './ofertas.scss';
import DOMPurify from 'dompurify';
import aws from '../../../config/aws';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function Ofertas(props) {
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(
		() => {
			obtenerProductos(40, page);
			window.scrollTo(0, 0);
		},
		[ page ]
	);

	console.log(productos)

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos/promociones?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				props.history.push('/error500');
			});
	}

	const render = productos.map((productos) => (
		<Col key={productos._id} className="size-col col-lg-2 col-6">
			<Link to={`/vista_producto/${productos.productoPromocion._id}`}>
				<Card.Grid hoverable style={gridStyle} className="border contenedor-card-producto-principal">
					<Card
						bodyStyle={{ padding: 10, backgrounddivor: '#F7F7F7' }}
						className="contenedor-card-body"
						cover={
							<div className="contenedor-imagen-oferta">
								<div class="contenedor-oferta">
									<h5 className="shadow">OFERTA</h5>
								</div>
								<div className="contenedor-imagen-producto-principal">
									<img
										className="imagen-producto-principal"
										alt="producto"
										src={aws+productos.productoPromocion.imagen}
									/>
								</div>
							</div>
						}
					>
						<div className="contenedor-titulos-productos titulo-elipsis">
							<h1 className="titulo-producto">{productos.productoPromocion.nombre}</h1>
							<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.productoPromocion.descripcion) }} />
						</div>
						<div className="contenedor-precios-productos">
							<h2 className="h5 precio-producto rebajado mr-2">
								${formatoMexico(productos.productoPromocion.precio)}
							</h2>
							<h2 className="h5 precio-rebaja d-inline mr-1">
								${formatoMexico(productos.precioPromocion)}
							</h2>
							<p className="h4 porcentaje-descuento d-inline">
								{agregarPorcentaje(productos.precioPromocion, productos.productoPromocion.precio)}%OFF
							</p>
						</div>
					</Card>
				</Card.Grid>
			</Link>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div className="contenedor-home-background">
				<div className="row contenedor-home-banner">
					<h4 className="mb-0 text-center font-weight-bold">¡Encuentra ofertas todos los días!</h4>
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{productos.length ? (
							render
						) : (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Aun no hay ofertas" />
							</div>
						)}
					</Row>
				</div>
			</div>
			<Pagination blogs={productosPaginacion} location={location} history={history} />
		</Spin>
	);
}

export default withRouter(Ofertas);
