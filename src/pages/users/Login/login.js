import React from 'react';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import { notification, Form, Input, Button } from 'antd';

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 }
};
const tailLayout = {
	wrapperCol: { offset: 7, span: 10 }
};

function Login(props) {
	const onFinish = async (values) => {
		await clienteAxios
			.post('/cliente/auth', values)
			.then((res) => {
				const token = res.data.token;
				localStorage.setItem('token', token);
				props.history.push('/admin');
			})
			.catch((err) => {
				if(err.response){
					if (err.response.status === 404 || err.response.status === 500) {
						notification.error({
							message: 'Error',
							description: err.response.data.message,
							duration: 2
						});
					} else {
						notification.error({
							message: 'Error',
							description: 'Hubo un error',
							duration: 2
						});
					}
				}else{
					notification.error({
						message: 'Error de conexion.',
						description:
						  'Al parecer no se a podido conectar al servidor.',
					  });
				}
			});
	};

	return (
		<div className="col-12">
			<Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
				<Form.Item label="Correo" >
					<Form.Item name="email" rules={[ { required: true, message: 'El email es obligatorio!' } ]} noStyle >
						<Input />
					</Form.Item>
				</Form.Item>
				<Form.Item label="Contraseña" >
					<Form.Item name="contrasena" rules={[ { required: true, message: 'La contraseña es obligatoria!' } ]} noStyle >
						<Input.Password />
					</Form.Item>
				</Form.Item>
				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" className="color-boton">
						Continuar
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default withRouter(Login);
