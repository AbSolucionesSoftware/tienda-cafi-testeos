import React from 'react';
import { Result, Button } from 'antd';
import './success.scss';
import { Link } from 'react-router-dom';

export default function ErrorPago(props) {
	const pedidoID = props.match.params.id;
	const error = props.match.params.error;

	return (
		<div className="contenedor-bgcolor-error">
			<div className="contenedor-error m-5 shadow-lg">
				<Result
					icon={
						<div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: 'flex' }}>
							<span className="swal2-x-mark">
								<span className="swal2-x-mark-line-left" />
								<span className="swal2-x-mark-line-right" />
							</span>
						</div>
					}
					title="Tu pago no ha sido aprovado"
					subTitle={error}
					extra={[
						<Link to="/">
							<Button type="primary">
								Ir a pagina principal
							</Button>
						</Link>,
                        <Link to={`/confirmacion_compra/${pedidoID}`}>
                            <Button type="primary" ghost className="mb-3">
                                Reintentar
                            </Button>
                        </Link>
					]}
				/>
			</div>
		</div>
	);
}
