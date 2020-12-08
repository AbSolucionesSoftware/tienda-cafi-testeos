import React, {useState} from 'react'
import { Modal} from 'antd';

import consulta_covertura from './consulta_covertura';
import Consulta_covertura from './consulta_covertura';

export default function Login_covertura() {

    const [modalVisible, setIsModalVisible] = useState(true);

    const showModal = () => {
        setIsModalVisible(true);
      };
    
    const handleOk = () => {
        setIsModalVisible(false);
    };  

    const handleCancel = () => {
        setIsModalVisible(false);
      };
    
      return (
        <div>
            <Modal
                title="Consulta de Envios"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
           >
            <Consulta_covertura handleCancel={handleCancel}/>
           </Modal>
        </div>
    )
}
