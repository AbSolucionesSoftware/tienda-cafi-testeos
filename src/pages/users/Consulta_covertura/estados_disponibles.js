import React, { useState, useEffect } from "react";

import clienteAxios from "../../../config/axios";

import { notification, Tooltip, Tag } from "antd";

export default function Estados_disponibles() {
  const [dataEstados, setDataEstados] = useState([]);

  const traerDatos = async () => {
    clienteAxios
      .get(`/politicasEnvio/estados/`)
      .then((res) => {
        setDataEstados(res.data);
      })
      .catch((err) => {
        notification.error({
          message: "Error del servidor",
          description:
            "Paso algo en el servidor, al parecer la conexion esta fallando.",
        });
      });
  };

  useEffect(() => {
    traerDatos();
  }, []);


  const municipios = [];

  return (
    <div>
      <div className="text-center justify-content-center align-items-center mt-5">
      <h3>Tenemos envios a:</h3>
        {
          dataEstados.map((estados) => {
            estados.municipios.map((municipio) => {
              municipios.push(municipio.municipio + "       -       ");
            });

            if (estados.todos || dataEstados.length === 0) {
              
            }else{
              return( 
                <Tooltip
                  placement="left"
                  key={estados._id}
                  title={municipios}
                >
                  <Tag
                    style={{ fontSize: 16 }}
                    className="mt-3 tags-color"
                    visible={true}
                    key={estados._id}
                  >
                    {estados.estado}
                  </Tag>
                </Tooltip>
                )
            }
          })
      } 
      </div>
    </div>
  );
}
