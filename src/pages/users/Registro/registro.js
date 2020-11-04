import React from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 }
};
const tailLayout = {
	wrapperCol: { offset: 7, span: 10 }
};

function Registro(props) {
	const onFinish = async (values) => {
		await clienteAxios
			.post('/cliente/', values)
			.then((res) => {
				const token = res.data.token;
				localStorage.setItem('token', token);
				props.history.push('/');
				notification['success']({
					message: 'Bienvenido!',
					description: 'Te has registrado correctamente',
					duration: 2
				});
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
	};

	return (
		<div className="col-12">
			<Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
				<Form.Item label="Nombre" >
					<Form.Item name="nombre" rules={[ { required: true, message: 'El nombre es obligatorio!' } ]} noStyle >
						<Input />
					</Form.Item>
				</Form.Item>

				<Form.Item label="Apellido" >
					<Form.Item name="apellido" noStyle >
						<Input />
					</Form.Item>
				</Form.Item>

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

				<Form.Item label="Confirmar contraseña" >
					<Form.Item name="repeatContrasena" rules={[ { required: true, message: 'La contraseña es obligatoria!' } ]} noStyle >
						<Input.Password />
					</Form.Item>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Registrarse
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default withRouter(Registro);
