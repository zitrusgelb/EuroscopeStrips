import React, {useContext, useState} from 'react';
import {
    Modal,
    Row,
    Col,
    FormControl
} from 'react-bootstrap'
import axios from 'axios'

import { RootContext } from '../RootContext'
export default function TransferModal(props) {
    const {ip, squawks} = useContext(RootContext)

    const [assr, setAssr] = useState(props.details.ass_squawk)
    const [type, setType] = useState(squawks[parseInt(props.details.ass_squawk)] !== undefined ? squawks[parseInt(props.details.ass_squawk)] : 'auto')

    const setSquawk = (value) => {
        let code
        if (value !== 'auto') {
            code = Object.keys(squawks).find(key => squawks[key] === value)
        } else {
            code = assr
        }

        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'setSquawk',
            params: {
                callsign: props.callsign,
                assr: code
            }
        })
        .then(response =>{
            if (response.data.result) {
                props.close()
            } else {
                setAssr(props.details.ass_squawk)
            }
        })
        .catch(err =>
            console.error(err)
        )
    }

    const setNext = (controller) => {
        console.log("irgendwann wird hier der nächste Controller gesetzt")
    }

    return (
        <>
        <Modal show={props.show} size="lg" backdrop={true} onHide={props.close}>
            <Modal.Body className="transfer">
                <Row>
                    <Col xs={9} className="header">
                        <Row className="title">Transfer / ASSR Menu</Row>
                        <Row className="cs">{props.details.callsign}</Row>
                    </Col>
                    <Col xs={3} className="d-flex" onClick={props.close}>
                        <div className="cancel-btn d-flex align-items-center">
                            <span>CANCEL</span>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3 mb-5">
                    <Col xs={3}><div className="fw-b action-btn">RELEASE</div></Col>
                    <Col xs={1}></Col>
                    <Col xs={3}><div className="fw-b action-btn">POINT OUT</div></Col>
                    <Col xs={1}></Col>
                    <Col xs={4}><div className="fw-b action-btn">ASSR</div></Col>
                </Row>
                <Row>
                    <Col xs={7} className="border border-1 border-dark station-list">
                        <div className="station-container">
                            <div className="title border-bottom border-1 border-dark">TRANSFER TO</div>
                            {props.controllers && props.controllers.length > 0 && props.controllers.map((c,i) => 
                                <>
                                {c.posId != parseInt(c.posId) &&
                                    <Row key={i} id={props.details.next_ctrl === c.posId ? 'next' : ''} className="station-row" onClick={() => setNext(c)}>
                                        <Col xs={3} className="border-right border-bottom border-1 border-dark py-1">{c.posId}</Col>
                                        <Col xs={9} className="border-bottom border-1 border-dark py-1">{c.frequency.substr(0, 7)}</Col>
                                    </Row>
                                }
                                </>
                            )}
                        </div>
                    </Col>
                    <Col xs={1}>
                    </Col>
                    <Col xs={4}>
                        <div className="d-flex flex-column ">
                            <span onClick={() => setSquawk('auto')} className={type === 'auto' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>AUTO ASSIGN</span>
                            {type !== 'manual' ?
                                <span onClick={() => setType('manual')}className="fw-b assr-btn">MANUAL</span>
                            :
                                <div className="assr-input">
                                    <FormControl type="number" max="7777" value={assr} onChange={(e) => setAssr(e.target.value)} autoFocus />
                                    <span onClick={() => setSquawk('vfr')} className="fw-b assr-btn man-assr">SET</span>
                                </div>
                            }
                            <span onClick={() => setSquawk('vfr')} className={type === 'vfr' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>VFR</span>
                            <span onClick={() => setSquawk('fis')} className={type === 'fis' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>FIS</span>
                            <span onClick={() => setSquawk('rsc')} className={type === 'rsc' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>RESCUE</span>
                            <span onClick={() => setSquawk('pol')} className={type === 'pol' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>POLICE</span>
                            <span onClick={() => setSquawk('acro')} className={type === 'acro' ? "fw-b assr-btn selected" : "fw-b assr-btn"}>ACROBATIC</span>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        </>
    )
}