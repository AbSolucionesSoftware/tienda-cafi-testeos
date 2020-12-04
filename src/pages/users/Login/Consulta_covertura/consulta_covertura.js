import React,  { useState, useEffect } from 'react'
import { Modal, Alert, Input, Button, Form, notification } from 'antd';

import axios from 'axios'
import clienteAxios from '../../../../config/axios';

const consultaCodigos = axios.create({
    baseURL : `https://api-sepomex.hckdrk.mx/query/`
})

export default function Consulta_covertura() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cpApi, setCpApi] = useState([]);
    const [municipiosApi, setMunicipiosApi] = useState([]);
    // const [value, setValue] = ([]);
     
    const valor = [];
    const onChange = param => {
        console.log(param.target.value)
    }
    // console.log(valor);


    const consultaCP = () => {
        consultaCodigos
        .get(`/info_cp/48900`)
        .then((res) => {
        const data = res.data[0].response.municipio;
        console.log(data);
        // const datosApiMunicipios = res.data.response.municipios;
        //   setMunicipiosApi(res.data.response.municipios);
        //   const arrayMunicipio = [];
        //   dataEstados.forEach(estado => {
        //     if (value === estado.estado) {
        //       setIdEstado(estado._id);
        //       estado.municipios.map((municipio) => {
        //         for (let i = 0; i < datosApiMunicipios.length; i++) {
        //          if (datosApiMunicipios[i] === municipio.municipio ) {
        //            arrayMunicipio.push(municipio.municipio);
        //          }
        //         }
        //       })
        //     }
        //   });
        })
        .catch((err) => {
            notification.error({
            message: 'Error del servidor',
            description: 'Paso algo en el servidor'
            });
        });
    }

    const consulta = () => {

    }

    const showModal = () => {
        setIsModalVisible(true);
      };

    const handleCancel = () => {
        setIsModalVisible(false);
      };

    const handleOk = () => {
        setIsModalVisible(false);
    };  
    
    return (
        <div className="text-center align-items-center justify-content-center">
            <Modal
                title="Consulta de Envios"
                visible={true}
                onCancel={handleCancel}
                footer={null}
            >
                <Alert
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
                        style={{width: "50%"}} />
                </div>
                
                <div className="justify-content-center text-center mt-3">
                    <Button 
                        type="primary"
                        style={{textAlign: "center"}}
                        onClick={consultaCP}
                    >
                        Buscar
                    </Button>
                </div>
                

            </Modal>
        </div>
    )
}
