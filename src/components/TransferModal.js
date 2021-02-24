import React from 'react';
import {
    Modal,
    Row,
    Col
} from 'react-bootstrap'

export default function TransferModal(props) {
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
                    <Col xs={7}>
                        TRANSFER CONTAINER
                    </Col>
                    <Col xs={1}>
                    </Col>
                    <Col xs={4}>
                        <div className="d-flex flex-column ">
                            <span className="fw-b assr-btn selected">AUTO ASSIGN</span>
                            <span className="fw-b assr-btn">MANUAL</span>
                            <span className="fw-b assr-btn">VFR</span>
                            <span className="fw-b assr-btn">FIS</span>
                            <span className="fw-b assr-btn">RESCUE</span>
                            <span className="fw-b assr-btn">POLICE</span>
                            <span className="fw-b assr-btn">PARAJUMPING</span>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        </>
    )
}