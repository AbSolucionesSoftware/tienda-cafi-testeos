import React,  { useState, useEffect } from 'react'

import { Divider, Button, Select, Tag, notification, Table, Spin} from 'antd';
import { EditOutlined } from '@ant-design/icons';

import axios from 'axios';
const clienteAxios = axios.create({
    baseURL : `https://api-sepomex.hckdrk.mx/query/`
})



export default function Cobertura_envios(props) {

    const { Column} = Table;
    const [ loading, setLoading ] = useState(false);

    const [data, setData ] = useState([]);
    const [datos, setDatos] = useState([]);
    const [value, setValue] = useState([]);
    const [array, setArray] = useState([]);

    const [estado, setEstado] = useState("");
    
//************************************************************************************************************************ */
    const [covertura, setCovertura] = useState([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);

    

    const onSelectChange = (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      const listaMun = selectedRowKeys.map((res) => {
        return { idMunicipio: res };
      });
      setCovertura(listaMun);
    };

    // console.log(covertura);
    // console.log(selectedRowKeys);

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (municipio) => {
        if (value) {
          return {
            disabled: 
              municipio.municipios &&
              municipio.length !== 0 ,
              // Column configuration not to be checked
            name: 
              municipio.name,
          };
        } else {
            return{
              disabled: 
                municipio.municipios &&
                municipio.length !== 0 ,
                // Column configuration not to be checked
              name: 
                municipio.name,
            };
        }
      },
      onSelect: (record, selected, selectedRows) => {
        setCovertura(selectedRows);
      },
      onSelectAll: (selected, selectedRows) => {
        setCovertura(selectedRows);
      }
    }

    const checkearChecks = () => {
      const listaPromosActuales = covertura.map((munis) => {
        return munis.municipio;
      });
      setSelectedRowKeys(listaPromosActuales);
      console.log(listaPromosActuales);
    };
   

    // useEffect(
    //   () => {
    //       checkearChecks();
    //   }
    // );

    // const rowSelection = {
    //   onSelectChange: (selectedRowKeys, selectedRows) => {
    //     console.log(selectedRowKeys, selectedRows);
    //   },
    //   getCheckboxProps: (record) => ({
    //     disabled: record.name === 'Disabled User',
    //     // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // };

//************************************************************************************************************************ */


    const selectMunicipio = async (value) => {
      setValue(value);

      if(value){
        setEstado(value)
        setLoading(true);
        await clienteAxios
        .get(`/get_municipio_por_estado/${value}`)
        .then((res) => {
          setData(res.data.response.municipios);
          setLoading(false);
        })
        .catch((err) => {
          notification.error({
            message: 'Error del servidor',
            description: 'Paso algo en el servidor'
          });
          console.log(err);
        });
      }
    }

    function obtenerEstados(){
		clienteAxios
			.get(`/get_estados/`)
			.then((res) => {
          setDatos(res.data.response.estado);
          // console.table(res.data.response.estado);
			})
			.catch((err) => {
				notification.error({
					message: 'Error del servidor',
					description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
				});
				console.log(err);
			});
    }

    
    const onAgregarEstados = () => {
      if (selectedRowKeys.length !== 0) {
        array.push({estado, municipio: covertura})
        console.log(array);
        console.log("si entra la condicion");
      }else{
        console.log("no debe de entrar la condicion");
      }
      limpiar(); 
    }

    function limpiar() {
      setValue([]);
      setEstado();
      setCovertura([]);
      setData([]);
      //setSelectedRowKeys([]);
    }

    useEffect(() => {
        obtenerEstados();
        selectMunicipio();
    }, []);

    

    const { Option } = Select;
    // var array = [];
    // for (let municipios = 0; municipios < data.length; municipios++) {
    //     array = data[municipios];
        
    //  }

    return (
        <div>
            <div className="justify-content-center align-items-center text-center">
				    <Divider>Cobertura de Envios</Divider>
            <div style={{width: '100%'}}className="text-center">
              {
                selectedRowKeys.length !==0 ? (
                  array.map ((estado) => {
                    return (
                      <Tag key={estado.estado}>
                        {estado.estado}
                      </Tag>
                    );                      
                  })
                ) : (
                  null
                )

              }
            </div>
            <div className="row mt-4 align-items-center">
              <Select
                style={{ width: '40%' }}
                placeholder="Selecciona un estado"
                onChange={selectMunicipio}
                value={value}
              >
                {datos.length !== 0 ? (
                  datos.map((estado) => {
                  return (
                    <Option key={estado} value={estado}>
                      {estado}
                    </Option>
                  );
                  })
                  ) : (
                    <Option />
                  )}
              </Select>
              <div style={{ width: '50%', textAlign: "center" }}>
              <Spin size="large" spinning={loading}>
                <Table
                  rowSelection={rowSelection}
                  dataSource={data}
                  rowKey={(municipio) => municipio}
                  scroll={{ y: 270}}
                  pagination={false}
                >
                  <Column title={"Municipios"}/>
                </Table>
              </Spin>
							</div>
            </div>
               
            <Button 
                className="mt-4 text-center"
                size="large"
                type="primary"
                onClick={onAgregarEstados}
                >
                <EditOutlined style={{ fontSize: 24 }} /> Actualizar
            </Button>
            {/* <Button
            className="mt-4 text-center"
            size="large"
            type="primary"
            onClick={limpiar}
            >
              Limpiar
            </Button> */}

			</div>
        </div>
    )

}




