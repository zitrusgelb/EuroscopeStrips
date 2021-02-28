import React, {useContext, useState } from 'react';
import {
    Modal,
    Row,
    Col,
    Form,
    Button
} from 'react-bootstrap'
import { RootContext } from '../RootContext'

export default function SettingsModal(props) {
    const {commSettings, setCommSettings, ip, setIp} = useContext(RootContext)

    const [serverAdress, setServerAddress] = useState(commSettings?.address)
    const [key, setKey] = useState(commSettings?.key)

    const [esIp, setESIp] = useState(ip)
    
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const save = () => {
        let commKey = key
        if(!key){
            commKey = makeid(6)
            setKey(commKey)
        }

        let settings = {connected: false, commKey: commKey, adress: serverAdress};
        setCommSettings(settings);

        settings = JSON.stringify(settings)
        localStorage.setItem('commSettings', settings);
        
    }

    const saveIp = () => {
        setIp(esIp)
        localStorage.setItem('euroscope-adress', esIp)
    }

    return (
        <>
        <Modal show={props.show} size="xl" backdrop={true} onHide={props.close} contentClassName="settings">
            <Modal.Body>
                <Row className="header">
                    <p>
                    Settings
                    </p>
                </Row>
                <Form>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="commserver">
                                <Form.Label>Server</Form.Label>
                                <Form.Control type="text" value={serverAdress} placeholder="Adresse des Servers" onChange={(e) => setServerAddress(e.target.value)} disabled={commSettings.connected}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="channelPassword">
                                <Form.Label>Key</Form.Label>
                                <Form.Control type="text" placeholder="Key des Kanals" value={key} disabled={commSettings.connected} onChange={(e) => setKey(e.target.value)}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="button" xs={2}>
                            <Button onClick={() => {save()}}>Einstellungen speichern</Button>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Col>
                                <Form.Group controlId="euroscopeIp">
                                    <Form.Label>EuroScope Ip</Form.Label>
                                    <Form.Control type="text" placeholder="Ip-Adresse von EuroScope" value={esIp} onChange={(e) => setESIp(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col className="button" xs={2}>
                                <Button onClick={() => {saveIp()}}>IP-Adresse speichern und verbinden</Button>
                            </Col>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>

                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}