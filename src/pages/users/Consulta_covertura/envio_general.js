import React, { useState, useEffect } from "react";
import clienteAxios from "../../../config/axios";

import { notification, Alert } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

export default function Envio_General() {
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
      <div className="text-center justify-content-center align-items-center mt-1">
        {dataEstados.map((estado) => {
          if (estado.todos) {
            return (
              <Alert
                message={"Envios a toda la Republica Mexicana"}
                type="success"
                showIcon
              >
                
              </Alert>
            );
          } else {
              return null;
          }
        })}
      </div>
    </div>
  );
}
