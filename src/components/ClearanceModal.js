import React from 'react';
import {
    Modal,
    Row,
    Col,
    Table
} from 'react-bootstrap'

import ClearanceCircle from './ClearanceCircle'

export default function ClearanceModal(props) {
    return (
        <>
        <Modal show={props.show} size="xl" backdrop={true} onHide={props.close} contentClassName="clearance">
            <Modal.Body>
                <Row className="header">
                    <p>
                    Cleared to - {props.details.callsign} - a{props.details.squawk}
                    </p>
                </Row>
                <Row className="mt-3">
                </Row>
            </Modal.Body>
        </Modal>
        </>
    )
}