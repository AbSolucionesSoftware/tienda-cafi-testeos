import React,  { useState, useEffect } from 'react'
import { Modal, Alert, Input, Button, Form, notification } from 'antd';

import axios from 'axios'
import clienteAxios from '../../../config/axios';

const consultaCodigos = axios.create({
    baseURL : `https://api-sepomex.hckdrk.mx/query/`
})

export default function Consulta_covertura(props) {

    const [alertEnvio, setAlertEnvio] = useState(false);
    const [alertRechazo, setAlertRechazo] = useState(false);


    const [value,  setValue] = useState([]);

    const [envioAprobado, setEnvioAprobado] = useState("");
    const [envioRechadazo, setEnvioRechazado] = useState("");

    const onChange = param => {
        setValue(param.target.value);
    }


    const consultaCP = () => {
        consultaCodigos
        .get(`/info_cp/${value}`)
        .then((res) => {
        const data = res.data[0].response.municipio;
        setValue([]);
            clienteAxios
                .get(`/politicasEnvio/estado/municipio/${data}`)
                .then((res) => {
                    setEnvioAprobado(res.data.message)
                    setAlertEnvio(true);
                    setAlertRechazo(false);
                })
                .catch((err) => {
                    setEnvioRechazado(err.response.data.message);
                    setAlertEnvio(false);
                    setAlertRechazo(true);
                });
        })
        .catch((err) => {
            notification.error({
            message: 'Error',
            description: 'El codigo postal insertado no existe'
            });
        });
    }


    useEffect(() => {
        // consultaCP();
    }, [])

    
    return (
        <div className="text-center align-items-center justify-content-center">
           
                {/* <Alert
					message="Consulta:"
					description="Introduce tu Codigo Postal, para consultar envios a tu Municipio"
					type="info"
					showIcon
					className="mt-2"
				/>

                <div className="justify-content-center text-center mt-3">
                    <Input 
                        name="CP"
                        placeholder="Codigo Postal" 
                        className="mt-4"
                        onChange={onChange}
                        style={{width: "50%"}} 
                    />
                </div>
                
                <div className="justify-content-center text-center mt-3">
                    <Button 
                        type="primary"
                        style={{textAlign: "center"}}
                        onClick={consultaCP}
                    >
                        Buscar
                    </Button>
                </div> */}
            
                {
                    alertEnvio === true ? (
                        <Alert
                            className="mt-4"
                            message="Excelente"
                            description={envioAprobado}
                            type="success"
                            showIcon
                            
                        />
                    ) : (
                        <div />
                    )
                }

                {
                    alertRechazo === true ? (
                        <Alert
                            className="mt-4"
                            message="Lo sentimos"
                            description={envioRechadazo}
                            type="error"
                            showIcon
                        />
                    ) : (
                        <div />
                    )
                }
        </div>
    )
}
