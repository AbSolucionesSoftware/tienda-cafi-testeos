import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Spin, notification, Result } from 'antd';
// import Pagination from '../../../components/Pagination/pagination';
// import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import '../Productos/productos.scss';
import './bannerPromocion.scss'
import DOMPurify from 'dompurify';
import aws from '../../../config/aws';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function CardsProductos(props) {
    const {categoria} = props;
	//const { location, history } = props.propiedades;
	//const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    
    useEffect(() => {
        async function obtenerProductos(limit, page) {
            setLoading(true);
            await clienteAxios
                .get(`/productos/filter?categoria=${categoria}`)
                .then((res) => {
                    console.log(res.data);
                    setProductos(res.data.posts);
                    setProductosPaginacion(res.data.posts);
                    setLoading(false);
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

       obtenerProductos()
    }, [categoria])


	const render = productos.map((productos, index) => (
		<div key={productos._id} className="size-col col-lg-2 col-6">
			
			<Link to={`/vista_producto/${productos._id}`}>
			{ index <= 5 ?(
				
				<Card.Grid hoverable style={gridStyle} className="border contenedor-card-producto-principal">
					<Card
						bodyStyle={{ padding: 10, backgroundColor: '#F7F7F7', minHeight: 100 }}
						className="contenedor-card-body"
						cover={
							<div className="contenedor-imagen-oferta">
								{productos.todos.length !== 0 ? (
									productos.todos.map((promo) => {
										return (
											<div class="contenedor-oferta">
												<h5 className="shadow">OFERTA</h5>
											</div>
										);
									})
								) : (
									<div className="d-none" />
								)}

								<div className="contenedor-imagen-producto-principal">
									<img
										className="imagen-producto-principal"
										alt="producto"
										src={aws+productos.imagen}
									/>
								</div>
							</div>
						}
					>
						<div className="contenedor-titulos-productos titulo-elipsis">
							<h1 className="titulo-producto">{productos.nombre}</h1>
							<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.descripcion) }} />
						</div>
						{!productos.todos.length ? (
							<div className="contenedor-precios-productos">
								<h3 className="h5 precio-rebaja">${formatoMexico(productos.precio)}</h3>
							</div>
						) : (
							productos.todos.map((promo) => {
								return (
									<div className="contenedor-precios-productos" key={promo._id}>
										<h2 className="h5 precio-producto rebajado mr-2">
											${formatoMexico(productos.precio)}
										</h2>
										<h3 className="h5 precio-rebaja d-inline mr-1">
											${formatoMexico(promo.precioPromocion)}
										</h3>
										<p className="h4 porcentaje-descuento d-inline">
											{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
										</p>
									</div>
								);
							})
						)}
					</Card>
				</Card.Grid>
				
				) : ""}
			</Link>
			
		</div>
	));

	return (
		<Spin size="large" spinning={loading}>
			{/* <div className="principal-productos"><p>NUESTROS PRODUCTOS</p></div> */}
			<div className="d-flex justify-content-center align-items-center">
				<div className="justify-content-center align-items-center">
					<div style={{ maxWidth: '95vw' }} className="row mt-4 d-flex justify-content-center align-items-center">

						{productos.length ? (
							render
						) : (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Articulo no encontrado" />
							</div>
						)}
					</div>
				</div>
			</div>
			{/* <Pagination
				blogs={productosPaginacion}
				location={location}
				history={history}
				limite={window.screen.width < 768 ? 12 : 40}
			/> */}
		</Spin>
	);
}

export default CardsProductos;