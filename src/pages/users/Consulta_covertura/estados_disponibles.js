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

  return (
    <div>
      <div className="text-center justify-content-center align-items-center mt-5">
        {dataEstados.map((estado) => {
          if (estado.todos) {
          } else {
            const municipios = [];
            estado.municipios.map((municipio) => {
              municipios.push(municipio.municipio + "       -       ");
            });
            return (
              <div>
                <h2>Tenemos envios a:</h2>
                <Tooltip
                  key={estado._id}
                  placement="topLeft"
                  title={municipios}
                >
                  <Tag
                    style={{ fontSize: 16 }}
                    className="mt-3 tags-color"
                    visible={true}
                    key={estado._id}
                  >
                    {estado.estado}
                  </Tag>
                </Tooltip>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
