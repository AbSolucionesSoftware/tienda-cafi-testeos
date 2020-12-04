import React,  { useState, useEffect } from 'react'
import axios from 'axios'

import './coberturaEnvios.scss';
import { Divider, Button, Select, Tag, notification, Table, Spin, Modal, Tooltip, Checkbox} from 'antd';
import { EditOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

import clienteAxios from '../../../../../config/axios';

const consultaEstados = axios.create({
    baseURL : `https://api-sepomex.hckdrk.mx/query/`
})

export default function Cobertura_envios(props) {

    const token = localStorage.getItem('token');
    const { confirm } = Modal;
    const { Option } = Select;
    const { Column} = Table;

    const [ loading, setLoading ] = useState(false);
    const [ reload, setReload ] = useState(false);
    const [ municipioGuardado, setMunicipioGuardado] = useState([]);
    const [ idEstado, setIdEstado] = useState([]);

    const [municipiosApi, setMunicipiosApi ] = useState([]);
    const [estadosApi, setEstadoApi] = useState([]);
    const [value, setValue] = useState([]);

    const [dataEstados, setDataEstados] = useState([]);
    const [estado, setEstado] = useState("");

    const errors = (err) => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
          duration: 2
        });
      } else {
        notification.error({
          message: 'Error de conexion',
          description: 'Al parecer no se a podido conectar al servidor.',
          duration: 2
        });
      }
    };
    
//************************************************************************************************************************ */
    const [covertura, setCovertura] = useState([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);

    const onSelectChange = (parametros) => {
      setSelectedRowKeys(parametros);
      const listaMun = parametros.map((res) => {
        return res;
      });
      setCovertura(listaMun);
    };


    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (municipio) => {
        if (value) {
          return {
            disabled: 
              municipio.municipio &&
              municipio.length !== 0 ,
              // Column configuration not to be checked
            name: 
              municipio.name,
          };
        } else {
            return{
              disabled: 
                municipio.municipio &&
                municipio.length !== 0 ,
                // Column configuration not to be checked
              name: 
                municipio.name,
            };
        }
      },onSelect: (record, selected, selectedRows) => {
        setCovertura(selectedRows);
      },onSelectAll: (selected, selectedRows) => {
        setCovertura(selectedRows);
      }
    }

    const checkearChecks = () => {
      const listaMunicipios = municipioGuardado.map((municipio) => {
        return municipio;
      });
      setSelectedRowKeys(listaMunicipios);
    }

//************************************************************************************************************************ */
    
    const selectMunicipio = (value) => {
      setValue(value);
      setMunicipioGuardado([]);
      setIdEstado();

      if(value){
        setEstado(value)
        setLoading(true);
          consultaEstados
          .get(`/get_municipio_por_estado/${value}`)
          .then((res) => {
            setLoading(false);
            const datosApiMunicipios = res.data.response.municipios;
            setMunicipiosApi(res.data.response.municipios);
            const arrayMunicipio = [];
            dataEstados.forEach(estado => {
              if (value === estado.estado) {
                setIdEstado(estado._id);
                estado.municipios.map((municipio) => {
                  for (let i = 0; i < datosApiMunicipios.length; i++) {
                   if (datosApiMunicipios[i] === municipio.municipio ) {
                     arrayMunicipio.push(municipio.municipio);
                   }
                  }
                })
              }
            });
            setSelectedRowKeys(arrayMunicipio);
          })
          .catch((err) => {
            notification.error({
              message: 'Error del servidor',
              description: 'Paso algo en el servidor'
            });
          });
      }
    }

    function obtenerEstados(){
      consultaEstados
			.get(`/get_estados/`)
			.then((res) => {
        setEstadoApi(res.data.response.estado);
			})
			.catch((err) => {
				notification.error({
					message: 'Error del servidor',
					description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
				});
			});
    }

    const arrayMunicipio = [];
    for (let i = 0; i < covertura.length; i++) {
      arrayMunicipio.push({"municipio": covertura[i]});
    }
    const enviarDatos = async () => {
      if (selectedRowKeys.length !== 0 ) {
        const nuevoEstado = {
          estado:estado, municipios: arrayMunicipio
        };

        limpiar();
        
        if(idEstado) {
          await clienteAxios
          .put(`/politicasEnvio/estados/${idEstado}`, nuevoEstado,{
            headers: {
              Authorization: `bearer ${token}`
            }
          })
          .then((res) => {
            notification.success({
              message: "Actualizacion Exitosa",
              duration: 2
            });
            setReload(res);
          })
          .catch((err) => {
            errors(err);
          });
        }else{
          await clienteAxios
          .post(`/politicasEnvio/estados/`, nuevoEstado,{
            headers: {
              Authorization: `bearer ${token}`
            }
          })
          .then((res) => {
            notification.success({
              message: "Registro Exitoso",
              duration: 2
            });
            setReload(res);
          })
          .catch((err) => {
            errors(err);
          });
        }
      }
    }

    const traerDatos = async () => {
      clienteAxios
			.get(`/politicasEnvio/estados/`)
			.then((res) => {
          setDataEstados(res.data);
          setReload(true);
			})
			.catch((err) => {
				notification.error({
					message: 'Error del servidor',
					description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
				});
			});
    }

    const deleteEstado = (state) => {
      confirm({
        title: 'Eliminando Estado',
        icon: <ExclamationCircleOutlined />,
        content: `¿Estás seguro que deseas eliminar el Estado?`,
        okText: 'Eliminar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          clienteAxios
            .delete(`/politicasEnvio/estados/${state._id}`, {
              headers: {
                Authorization: `bearer ${token}`
              }
            })
            .then((res) => {
              notification.success({
                message: 'Estado Eliminado',
              });
              setReload(res);
            })
            .catch((err) => {
              if (err.response) {
                notification.error({
                  message: 'Error',
                  description: err.response.data.message,
                  duration: 2
                });
              } else {
                notification.error({
                  message: 'Error de conexion',
                  description: 'Al parecer no se a podido conectar al servidor.',
                  duration: 2
                });
              }
            });
        }
      });
    };
    
    useEffect(() => {
      obtenerEstados();
      if (value) {
        checkearChecks();
      }
    }, []);

    useEffect(() => {
      enviarDatos();
      traerDatos();
    }, [reload])

    function limpiar() {
      setValue([]);
      setMunicipiosApi([]);
      setSelectedRowKeys([]);
      setMunicipioGuardado([]);
      setIdEstado();
    }

    return (
      <div className="mt-5">
        <div className="row text-center">
        
          <div className="col-lg-6">
            <Select
              style={{ width: '70%' }}
              placeholder="Selecciona un estado"
              onChange={selectMunicipio}
              value={value}
            >
              {estadosApi.length !== 0 ? (
                estadosApi.map((estado) => {
                return (
                  <Option key={estado} value={estado}>
                    {estado}
                  </Option>
                );
                })
                ) : (
                  <Option />
                )
              }
            </Select>

            <Checkbox className="mt-2">
              Envio a todo Mexico (Sin exepcion)
            </Checkbox>

            <div className="text-center mt-3">
              {
              dataEstados.map((estado) => {
              const municipios = [];
                estado.municipios.map((municipio) => {
                  municipios.push(municipio.municipio  +  "       -       ");
                })
                  return(
                    <Tooltip key={estado._id} placement="topLeft" title={municipios}>   
                      <Tag
                        className="mt-3 tags-color" 
                        visible={true} 
                        closable
                        onClick={() => selectMunicipio(estado.estado)}
                        onClose={() => deleteEstado(estado)} 
                        key={estado._id}                 
                      >
                        {estado.estado}
                      </Tag>
                    </Tooltip>
                  )
              })
              }
            </div>
          </div>

          <div style={{ width: '50%', textAlign: "center" }}>
          <Spin size="large" spinning={loading}>
            <Table
              className=""
              rowSelection={rowSelection}
              dataSource={municipiosApi}
              rowKey={(municipio) => municipio}
              scroll={{ y: 300}}
              pagination={false}
            >
              <Column title={"Municipios"}/>
            </Table>
          </Spin>
          </div>
        </div>
                  
        <div className="justify-content-center align-items-center text-center mt-4">
          <Button 
              className="mt-4 m-3 text-center px-4"
              size="large"
              type="primary"
              onClick={enviarDatos}
              >
              <EditOutlined style={{ fontSize: 24 }} /> 
              Agregar
          </Button>
        
          <Button
            className="mt-4 m-3 text-center px-4"
            size="large"
            type="primary"
            onClick={limpiar}
          >
            <DeleteOutlined style={{ fontSize: 20 }}/>
            Limpiar
          </Button>
        </div>
      </div>
    )

}