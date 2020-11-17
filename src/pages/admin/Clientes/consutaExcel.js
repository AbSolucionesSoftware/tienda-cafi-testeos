import React, { useState, useEffect } from 'react';

import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import aws from '../../../config/aws';

import { notification, Row} from 'antd';


import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;//ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet;//HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn;//COLUMNA DE EXCEL



function ConsutaExcel(props) {
    const token = localStorage.getItem('token');
	var decoded = Jwt(token);

    const [ consulta, setConsulta ] = useState([]);

    function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}
    
   
    useEffect(() => {
		const obtenerConsulta = async () => {
			await clienteAxios
                .get(`/cliente/todos/`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
			.then((res) => {
                    setConsulta(res.data);
                    console.log(res.data);
				})
                .catch((res) => {});
		};
		obtenerConsulta();
    }, []);


    const datos = [
		{
			render: (direccion) => {
				return direccion.map((res) => {
					return (
						<div key={res._id}>
							<p className="h5">
								{res.calle_numero}, {res.colonia}
							</p>
						</div>
					);
				});
			}
        }
    ]
 

    //

    return (
        <div>
            <Row justify="center">
            <ExcelFile element={<button>Descargar datos</button>} filename="Datos Clientes">
                <ExcelSheet data={consulta} name="Datos de clientes">
                    {/* <ExcelColumn label="Nombre" value="nombre" />
                    <ExcelColumn label="Apellido" value="apellido" />
                    <ExcelColumn label="E-Mail" value="email" />
                    <ExcelColumn label="Telefono" value="telefono" /> */}
                </ExcelSheet>
            </ExcelFile>
			</Row>
        </div>
    )
}

export default ConsutaExcel;