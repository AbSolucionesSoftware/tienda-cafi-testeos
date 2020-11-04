import React,{useState,useEffect} from 'react'
import {Col,Row,Badge,Select,Form, Button,Spin,notification,Typography,Tag,Input} from 'antd'
import './DetalleApartado.scss';
import clienteAxios from '../../../../config/axios';
import { formatoMexico } from '../../../../config/reuserFunction';
import aws from '../../../../config/aws';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

export default function DetalleApartado(props) {

    const {detalleApartado,setEstado, setVisible} = props;
    
    const [selectEstado, setSelectEstado] = useState('')
    const [promocion, setpromocion] = useState([])
    const [ loading, setLoading ] = useState(false);
    const [ datosEnvio, setdatosEnvio ] = useState();

    const [ form ] = Form.useForm();

    const token = localStorage.getItem('token')

    function obtenerApartado(){
        clienteAxios.get(`/apartado/${detalleApartado._id}`,{
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})
        .then((res) => {
			setLoading(false);
            setpromocion(res.data.promocion)
        }).catch((err) => {
            setLoading(false)
            if(err.response){
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                    duration: 2
                });
            }else{
                notification.error({
                    message: 'Error de conexion',
                    description: 'Al parecer no se a podido conectar al servidor.',
                    duration: 2
                });
            }
        })
    }

    useEffect(() => {
        monstrarInformacionBlog({
            mensajeUser:detalleApartado.mensajeUser,
            paqueteria:detalleApartado.paqueteria,
            url:detalleApartado.url,
            codigo_seguimiento:detalleApartado.codigo_seguimiento,
        })
        obtenerApartado()
        setSelectEstado(detalleApartado.estado)
        setLoading(true)
    }, [detalleApartado])


    const handleonChange = (e) => {
        setSelectEstado(e)
    }

    const monstrarInformacionBlog = (e) => {
        form.setFieldsValue(e);
     }



    const guardarEstadoApartado = async () => {
            let data = {};
        if(selectEstado === "ENVIADO"){
            data = {
                estado: selectEstado,
                codigo_seguimiento: datosEnvio.codigo_seguimiento,
                mensajeUser: datosEnvio.mensajeUser,
                paqueteria: datosEnvio.paqueteria,
                url: datosEnvio.url,
            }
        }else{
            data = {
                estado: selectEstado,
            }
        }

        setLoading(true)
        await clienteAxios.put(`/apartado/${detalleApartado._id}`,data,{
            headers: {
                Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            setEstado(true)
            setLoading(false)
            notification.success({
                message: 'Hecho!',
                description: res.data.message,
                duration: 2
            });
            setVisible(false);
        })
        .catch((err) => {
            setLoading(false)
            if(err.response){
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                    duration: 2
                });
            }else{
                notification.error({
                    message: 'Error de conexion',
                    description: 'Al parecer no se a podido conectar al servidor.',
                    duration: 2
                });
            }
        })

    }


    return (
        <Spin size="large" spinning={loading}>
            <div className ="detalle-apartado">
                <Row>
                    <Col span={24} className="detalle-apartado__border d-block detalle-apartados">
                        <p className="h4 font-weight-bold">Datos Usuario</p>
                        <div className="col-sm-12 col-lg-6 m-2">
                            <h6 className=" m-2">Nombre: </h6>
                            <p className=" m-2">{detalleApartado.cliente[0].nombre}</p>
                            <h6 className=" m-2">Teléfono: </h6>
                            <p className=" m-2">{detalleApartado.cliente[0].telefono}</p>
                            <h6 className=" m-2">Calle: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].calle_numero}</p>}
                            <h6 className=" m-2">Calles referentes a las que vive: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].entre_calles}</p>}
                            <h6 className=" m-2">Código Postal: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].cp}</p>}
                        </div>
                        <div className="col-sm-12 col-lg-6 m-2">
                        <h6 className=" m-2">Colonia: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].colonia}</p>}
                            <h6 className=" m-2">Ciudad: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].ciudad}</p>}
                            <h6 className=" m-2">Estado: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].estado}</p>}
                            <h6 className=" m-2">País: </h6>
                            {<p className=" m-2">{detalleApartado.cliente[0].direccion[0].pais}</p>}
                        </div>
                    </Col>
                    <Col span={24} className="detalle-apartado__border d-block m-2">
                        <p className="h4 font-weight-bold">Datos producto</p>
                        <div className="">
                            <div className="DetalleApartdado-imagen">
                                <img
                                    className="img-fluid"
                                    width="200"
                                    alt="imagen de base"
                                    src={aws+detalleApartado.producto[0].imagen}
                                />
                            </div>
                            <h6 className=" m-2">Nombre: </h6>
                            <p className=" m-2">{detalleApartado.producto[0].nombre}</p>
                            <h6 className=" m-2">Código de barras: </h6>
                            {<p className=" m-2">{detalleApartado.producto[0].codigo}</p>}
                            <h6 className=" m-2">Categoría: </h6>
                            {<p className=" m-2">{detalleApartado.producto[0].categoria}</p>}
                            {promocion.length > 0 ? (
                                <div className="">
                                    <h6 className="">Precio:</h6>
                                    <Text className="h4 color-precio-apartado" delete >$ {formatoMexico(detalleApartado.producto[0].precio)}</Text> 
                                    <p className="h4">$ {formatoMexico(promocion[0].precioPromocion)}</p>
                                </div>
                            ):(<p className=" m-2">$ {formatoMexico(detalleApartado.producto[0].precio)}</p>)}



                        </div>
                    </Col>
                    <Col span={24} className="m-2">
                        <div>
                            <div>
                            <p className="h4 font-weight-bold">Estatus del pedido</p>
                                <h6 className=" m-2">{detalleApartado.producto[0].categoria === 'calzado' ? 'Numero a apartar:': detalleApartado.producto[0].categoria === 'ropa' ? 'Talla a apartar' : '' }</h6>
                                    {detalleApartado.producto[0].categoria === 'calzado' ? (
                                        <Badge className="m-2">
                                                <p 
                                                    className="detalle-contenido-talla m-2"
                                                style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '40px', height: '56px' }}
                                                >
                                                    {detalleApartado.medida[0].numero}
                                                </p>
                                            </Badge>  
                                    ): detalleApartado.producto[0].categoria === 'ropa' ? (
                                        <Badge className="m-2">
                                            <p 
                                                className="detalle-contenido-talla m-2"
                                            style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '40px', height: '56px' }}
                                            >
                                                {detalleApartado.medida[0].talla}
                                            </p>
                                        </Badge>
                                    ) : '' }
                            </div>
                           {/*  <h6 className=" m-2">Cantidad de artículos por apartar: </h6>
                            <p className=" m-2">{detalleApartado.cantidad}</p> */}

                            <h6 className=" m-2">Tipo de entrega:</h6>
                            <Tag
                                style={{size:"50px",marginBottom: 10}}
                                color={detalleApartado.tipoEntrega === 'ENVIO' ?  '#5cb85c' : '#0275d8'}
                            >
                                {detalleApartado.tipoEntrega === 'ENVIO' ? 'Envio a domicilio' : 'Recoger a sucursal'}
                            </Tag>
                            <p></p>

                            <h6 className=" m-2">Actualiza el estado del pedido:</h6>
                            <Form 
                                onFinish={guardarEstadoApartado}
                                form={form}
                            >
                            <Form.Item>
                                <Select value={selectEstado} placeholder="Seleciona una categoria" onChange={handleonChange} style={{ width: 300 }}>
                                    <Option value="PROCESANDO">En proceso</Option>
                                    {detalleApartado.tipoEntrega === "ENVIO" ? (
                                        <>
                                            <Option value="ENVIADO">Enviado</Option>
                                            <Option value="CANCELADO">Cancelado</Option>
                                        </>

                                    ):(
                                        <>
                                            <Option value="ACEPTADO">Aceptado</Option>
                                            <Option value="RECHAZADO">Rechazado</Option>
                                        </>

                                    )}

                                </Select>
                            </Form.Item>
                            {selectEstado === 'ENVIADO' ? detalleApartado.tipoEntrega === 'ENVIO' ? (
                                <div className="row">
                                    <div className="col-lg-8">
                                        <h6>Mensaje:</h6>
                                        <Form.Item  name="mensajeUser">
                                            <TextArea rows={4} name="mensajeUser" onChange={e => setdatosEnvio({ ...datosEnvio, mensajeUser: e.target.value })} />
                                        </Form.Item>
                                        <h6>Paquetería:</h6>
                                        <Form.Item  name="paqueteria">
                                            <Input   name="paqueteria" placeholder="Paqueteria" onChange={e => setdatosEnvio({ ...datosEnvio, paqueteria: e.target.value })}/>
                                        </Form.Item>
                                        <h6>Url de vinculación:</h6>
                                        <Form.Item  name="url">
                                            <Input   name="url" placeholder="Url de vinculacion del paquete" onChange={e => setdatosEnvio({ ...datosEnvio, url: e.target.value })}/>
                                        </Form.Item>
                                        <h6>Número de seguimiento:</h6>
                                        <Form.Item  name="codigo_seguimiento">
                                            <Input   name="codigo_seguimiento" placeholder="Numero de seguimiento del paquete" onChange={e => setdatosEnvio({ ...datosEnvio, codigo_seguimiento: e.target.value })}/>
                                        </Form.Item>
                                    </div>
                                </div>
                            ) : "" : "" }


                            <Form.Item wrapperCol={{offset: 10, span: 8}}>
                                 <Button className="d-flex justify-content-center align-items-center" type="primary" htmlType="submit" >
                                    Guardar
                                </Button>
                            </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    )
}
