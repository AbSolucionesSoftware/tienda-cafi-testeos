import React,{useState,useEffect} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { notification, Form, Input, Button,Alert  } from 'antd';
import {useParams} from 'react-router-dom';
import clienteAxios from '../../config/axios';
import './Recuperacion_pass.scss';


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export default function Recuperar_pass(props) {

    const {location,history} = props;
    const {idRecuperacion} = useParams();
    console.log(idRecuperacion);

    const [mostrarError, setmostrarError] = useState("d-none");

    useEffect(() => {
        const cambiarEstadoPass = async () => {
            await clienteAxios.put(`/restablecer/pass/:idPassword`)
            .then((res) => {
                
            })
            .catch((err) => {

            })
        }
    }, [])

    const onFinish = (values) => {
        const {password,confirmPassword} = values;
        if(password !== confirmPassword){
            setmostrarError("");
        }else{
            console.log("Son iguales");
        }
    }
    

    return (
        <FormResetPass onFinish={onFinish} mostrarError={mostrarError} />
    )
}


function FormResetPass(props){
    const { onFinish,mostrarError} = props;
    return(
        <div className="centrar-div">
            <div className="div-resetPass shadow col-12 col-lg-4 bg-white rounded">
                <p className="text-center my-4">Recuperacion de contraseña</p>
                <Form {...layout}  name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item label="Contraseña" >
                        <Form.Item name="password" rules={[ { required: true, message: 'Rellenar los campos' } ]} noStyle >
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Confirmar contraseña" >
                        <Form.Item name="confirmPassword" rules={[ { required: true, message: 'Rellenar los campos' } ]} noStyle >
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    <Alert
                        className={`mb-4 ${mostrarError}`}
                        message="Contraseña distintas"
                        description="Las contraseñas son distintas, favor de poner la misma"
                        type="error"
                    />
                    <Form.Item className="d-flex justify-content-center align-items-center text-center" >
                        <Button type="primary" htmlType="submit" className="color-boton">
                            Continuar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
