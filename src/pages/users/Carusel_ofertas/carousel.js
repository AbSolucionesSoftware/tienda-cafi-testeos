import React, { useState, useEffect } from 'react';
//import Carousel from 'react-bootstrap/Carousel';
import './ofertas.scss';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import aws from '../../../config/aws';

import BannerAnim, { Element } from 'rc-banner-anim';
import 'rc-banner-anim/assets/index.css';

const BgElement = Element.BgElement;

function CarouselOfertas(props) {
	const [ index, setIndex ] = useState(0);
	const [ carousels, setCarousels ] = useState([]);
	const [ esPromocion, setEsPromocion ] = useState(false);

	useEffect(() => {
		const obtenerCarousel = async () => {
			await clienteAxios
				.get('/carousel/limite')
				.then((res) => {
					setCarousels(res.data);
				})
				.catch((res) => {});
		};
		const obtenerPromociones = async () => {
			await clienteAxios
				.get('/productos/promocion/carousel')
				.then((res) => {
					if (res.data.length === 0) {
						setEsPromocion(false);
						obtenerCarousel();
					} else {
						setEsPromocion(true);

						setCarousels(res.data);
					}
				})
				.catch((res) => {
					console.log(res);
				});
		};
		obtenerPromociones();
	}, []);

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	};


	const render = carousels.map((carousel) => {
		console.log(carousel.imagenPromocion);

			return (
				<Element prefixCls="banner-user-elem" key={carousel._id}>
				<BgElement
						onClick={() =>
							props.history.push(
								esPromocion
								? `/vista_producto/${carousel.productoPromocion._id}`
								: carousel.producto ? `/vista_producto/${carousel.producto}` : '/'
						)}
					key="bg"
					className="bg banner-elemento"
					style={{
						
						backgroundImage: `url(${esPromocion ? aws + carousel.imagenPromocion : aws + carousel.imagen})`
					}}
				>
			
				</BgElement>
				</Element>
				
			);
		
	});

	return (
		<BannerAnim activeIndex={index} onSelect={handleSelect} prefixCls="banner-user" autoPlay>
				{render}
		</BannerAnim>
	);
}

export default withRouter(CarouselOfertas);
