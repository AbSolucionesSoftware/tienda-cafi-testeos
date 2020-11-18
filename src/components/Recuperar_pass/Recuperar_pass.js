import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { notification, Form, Input, Button } from 'antd';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export default function Recuperar_pass() {
    const onFinish = () => {

    }
    

    return (
        <div>
            <div className="col-12">
                <Form {...layout}  name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item label="Correo" >
                        <Form.Item name="email" rules={[ { required: true, message: 'El email es obligatorio!' } ]} noStyle >
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" className="color-boton">
                            Continuar
                        </Button>
                    </Form.Item>
                    
                </Form>
            </div>
        </div>
    )
}
