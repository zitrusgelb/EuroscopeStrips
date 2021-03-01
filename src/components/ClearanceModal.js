import React, { useState, useEffect, useCallback } from 'react';
import {
    Modal,
    Row,
    Col,
    FormCheck,
    Table
} from 'react-bootstrap'

import ClearanceCircle from './ClearanceCircle'

export default function ClearanceModal(props) {
    const [fl, setFL] = useState([])
    const [alt, setAlt] = useState([])
    const [trl, setTRL] = useState("060")

    const getFl = useCallback(() => {
        let lowFl = trl / 10 + 1;
        let highFl = 66;

        let levels = [];
        for (let i = lowFl; i <= highFl; i++) {
            let level = i * 10
            if (level < 100) {
                level = String(level)
                level= '0' + level
            }
            levels.push(level);
        }
        levels.reverse()
        setFL(levels)
    })

    const getAlt = useCallback(() => {
        let lowFl = 1
        let highFl =  trl / 10;

        let levels = [];
        for (let i = lowFl; i <= highFl; i++) {
            levels.push(i * 10);
        }
        levels.reverse()
        setAlt(levels)
    })

    const toggleDraw = () => {
        console.log("toggling route")
    }

    useEffect(() => {
        //getAlt()
        //getFl()
    }, [getAlt, getFl])

    return (
        <>
        <Modal show={props.show} size="xl" backdrop={true} onHide={props.close} contentClassName="clearance">
            <Modal.Body>
                <Row className="header">
                    <p>Cleared to - {props.details.callsign} - a{props.details.squawk}</p>
                </Row>
                <Row className="mt-3">
                    <Col className="cfl d-flex flex-column text-center" xs={1}>
                        CFL
                        <span className="mb-3 title"></span>
                        {fl && fl.map((l, i) =>
                            <span key={i} className="alt">{l}</span>
                        )}
                        <span className="spacer">-------</span>
                        {alt && alt.map((a, i) =>
                            <span key={i} className="alt">A0{a}</span>
                        )}
                    </Col>
                    <Col xs={2}>
                        <Row>
                            <Col className="d-flex flex-column align-items-center" xs={4}>
                                Frequency
                                <FormCheck checked={props.assigned} type="checkbox" className="border border-1 border-dark p-2"/>
                            </Col>
                        </Row>
                        <Row className="d-flex flex-column align-items-center mt-4">
                            Actual Rate
                            <span className="border border-1 border-dark py-2 w-100 text-center">{props.details.ass_rate}</span>
                        </Row>
                        <Row className="d-flex flex-column align-items-center mt-4 rate">
                            Cleared Rate
                            <Table>
                                <tr>
                                    <td colSpan="3" className="border-left border-right border-dark">{props.details.ass_rate}</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">3.0</td>
                                    <td rowSpan="3" className="align-middle text-center border-right border-dark">+</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">2.5</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">2.0</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">1.5</td>
                                    <td rowSpan="3" className="align-middle text-center border-right border-dark">-</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">1.0</td>
                                </tr>
                                <tr>
                                    <td className="border-left border-right border-dark">0.5</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="border-left border-right border-bottom border-dark">NML</td>
                                </tr>
                            </Table>
                        </Row>
                        <Row className="spad d-flex flex-row align-items-center">
                            Scratchpad
                            <div className="w-100 d-flex flex-row flex-nowrap">
                                <div className="border border-right border-bottom border-top border-dark w-100 p-1 text-center scratch-pad">{props.details.spad}</div>
                                <span className="border border-right border-bottom border-top border-dark p-1">DEL</span>
                            </div>
                        </Row>
                    </Col>
                    <Col></Col>
                    <Col xs={3}>
                        <Row>
                            <span className="border border-dark px-3 py-2 w-100 text-center" onClick={() => toggleDraw()}>DRAW ROUTE</span>
                        </Row>
                        <Row className="mt-3 d-flex flex-column points mb-3">
                            Points
                            <span className="border border-top border-right border-left border-dark">A</span>
                            <span className="border border-right border-left border-dark bg-dark text-white">{props.runway}</span>
                            <span className="border border-bottom border-right border-left border-dark">V</span>
                        </Row>
                        <Row className="waypoints">
                            <span className="border border-dark mr-2 mb-2 w-50">WP</span>
                            <span className="border border-dark mb-2 ml-auto w-50">WP</span>
                            <span className="border border-dark mr-2 mb-2 w-50">WP</span>
                            <span className="border border-dark mb-2 ml-auto w-50">WP</span>
                        </Row>
                    </Col>
                    <Col className="xfl d-flex flex-column text-center" xs={1}>
                        XFL
                        {fl && fl.map((l, i) =>
                            <span key={i} className="alt">{l}</span>
                        )}
                        <span className="spacer">-------</span>
                        {alt && alt.map((a, i) =>
                            <span key={i} className="alt">A0{a}</span>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} className="d-flex flex-column align-items-center">
                        <div>QNH EDDH</div>
                        <span className="qnh">Q1012</span>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        </>
    )
}