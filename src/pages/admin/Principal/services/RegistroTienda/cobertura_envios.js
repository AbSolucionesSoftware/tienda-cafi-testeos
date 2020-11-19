import React,  { useState, useEffect } from 'react'

import { Divider, Button, Tree, TreeSelect, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import axios from 'axios';
const clienteAxios = axios.create({
    baseURL : `https://api-sepomex.hckdrk.mx/query/`
})

export default function Cobertura_envios() {

    const [value, setValue ] = useState([]);
    const { SHOW_PARENT } = TreeSelect;
    const [datos, setDatos] = useState([]);

    function obtenerEstados(){
		clienteAxios
			.get(`/get_estados/`)
			.then((res) => {
                setDatos(res.data.response.estado);
                console.log(res.estado);
			})
			.catch((err) => {
				notification.error({
					message: 'Error del servidor',
					description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
				});
				console.log(err);
			});
    }
    
    console.log(datos);

    useEffect(() => {
        obtenerEstados();
    }, []);

    const treeData = [
        {
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-0',
              key: '0-0-0',
            },
          ],
        },
        {
          title: 'Node2',
          value: '0-1',
          key: '0-1',
          children: [
            {
              title: 'Child Node3',
              value: '0-1-0',
              key: '0-1-0',
            },
          ],
        },
      ];
    


        const onChange = value => {
            console.log('onChange ', value);
            setValue(value );
          };

        const tProps = {
            treeData,
            value: value,
            onChange: onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            placeholder: 'Por favor seleccione los municipios deseados',
            style: {
              width: '50%',
            },
          };

    return (
        <div>
            <div className="justify-content-center align-items-center text-center">
				<Divider>Cobertura de Envios</Divider>

            <div className="mt-4 align-items-center">
                <TreeSelect 
                    {...tProps}
                />
            </div>
               
            <Button 
                className="mt-4 text-center"
                size="large"
                type="primary">
                <EditOutlined style={{ fontSize: 24 }} /> Actualizar cobertura de envio
            </Button>

			</div>
        </div>
    )

}




