import React, { useContext, useState, useEffect } from 'react';
import {
    Col,
    Row
} from 'react-bootstrap'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt, faBan } from '@fortawesome/free-solid-svg-icons'


import upArrow from '../upArrow.svg'
import downArrow from '../downArrow.svg'

import { RootContext } from '../RootContext'

import TransferModal from '../components/TransferModal'

export default function Strip(props) {
    const { ip } = useContext(RootContext)

    const [details, setDetails] = useState([])
    const [runs, setRuns] = useState(0)
    const [flightDir, setFlightDir] = useState("")
    const [open, setOpen] = useState(false)

    const [transferOpen, setTransferOpen] = useState(false)
    const [transferDetails, setTransferDetails] = useState([])

    const loadDetails = () => {
        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getAircraftDetails',
            params: {
                callsign: props.callsign
            }
        })
        .then(response =>{
            setDetails(response.data.result)
        })
        .catch(err =>
            console.error(err)
        )
    }

    const padZeros = (number, digits) => {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }

    const getUTCTimeToPoint = (minutesToPointStr) => {
        const mintoPoint = Number(minutesToPointStr);
        if (mintoPoint < 0) return '';
        const tsnow = new Date();
        tsnow.setMinutes(tsnow.getMinutes() + mintoPoint);
        return padZeros(tsnow.getUTCHours(), 2).concat(padZeros(tsnow.getUTCMinutes(), 2));
      }
      
      const getAltitude = (rawAltitude, rfl) => {
        if (rawAltitude === 'A00') {
          return rfl;
        }
        return rawAltitude;
      }

    useEffect(() => {
        let isMounted = true
        if(!isMounted) return;
        const intervalId = setInterval(() => {
            loadDetails()
            getFlightDir()
        }, 5000);
        return () => {
            clearInterval(intervalId);
            isMounted = false
        }
    }, [loadDetails])

    const getFlightDir = () => {
        if(runs > 1) return
        setFlightDir(details.direction)
        setRuns(runs + 1)
    }
    return (
        <Row className={"strip " + flightDir} nogutters >
        {!open ?
            <>
            <Col xs={2} onClick={() => setOpen(!open)}>
                <Row className="fw-b">
                    {getUTCTimeToPoint(details.next_time)} {details.next_point}
                </Row>
            </Col>
            <Col className="fw-b d-flex justify-content-between mr-1" xs={1}>
                {getAltitude(details.cfl, details.rfl)}
                {details.climb_descend && details.climb_descend === 'D' && <img src={downArrow} height="45px" width="auto" alt="" />}
                {details.climb_descend && details.climb_descend === 'C' && <img src={upArrow} height="45px" width="auto" alt="" />}
            </Col>
            <Col className="fs-s" xs={1}>
                <Row>
                    {details.rfl}
                </Row>
                <Row className="b-t fc-blue">
                    R{details.ass_rate === '0' ? '' : details.ass_rate}
                </Row>
            </Col>
            <Col xs={3} onClick={() => {setTransferOpen(true); setTransferDetails(details)}}>
                <span className="fs-s">{details.type}</span> <span className="fs-l fw-b">{props.callsign}</span>
            </Col>
            <Col>
                <Row><Col className="border-0 pl-0" xs={5}>{details.adep}</Col><Col className="border-0 pl-0" xs={5}>{details.ades}</Col></Row>
            </Col>
            <Col xs={1} className="buttons">
                <FontAwesomeIcon icon={faArrowsAlt} size="xs" />
            </Col>
            </>
            :
            <>
            <Col xs={2} onClick={() => setOpen(!open)} className="d-flex align-items-stretch">
                <Row>
                    <Row>{details.copn_point}</Row>
                    <Row className="fw-b">{getUTCTimeToPoint(details.next_time)} {details.next_point}</Row>
                    <Row>{getUTCTimeToPoint(details.copx_time).substr(2,4)} {details.copx_point}</Row>
                </Row>
            </Col>
            <Col className="d-flex justify-content-between mr-1 flex-column" xs={1}>
                <Row>
                    <Col className="d-flex justify-content-between border-0 pl-0">
                        <span className="fw-b">{getAltitude(details.cfl, details.rfl)}</span>
                        {details.climb_descend && details.climb_descend === 'D' && <img src={downArrow} height="100%" width="auto" alt="" />}
                        {details.climb_descend && details.climb_descend === 'C' && <img src={upArrow} height="100%" width="auto" alt="" />}
                    </Col>
                </Row>
                <Row className="b-t">
                    <Col className="border-0 pl-0">
                        
                    </Col>
                    <Col className="border-0 pl-0">
                        
                    </Col>
                </Row>
            </Col>
            <Col className="fs-s" xs={1}>
                <Row>
                    {details.rfl}
                </Row>
                <Row className="b-t fc-blue">
                    R{details.ass_rate === '0' ? '' : Number(details.ass_rate) / 1000}
                </Row>
                <Row className="fc-red">
                    R{details.ass_rate == '0' ? '' : Number(details.ass_rate) / 1000}
                </Row>
                <Row className="b-t">
                    <div className="d-flex flex-column">{getAltitude(details.copx_alt, details.rfl)}<span className="fs-xs">{details.next_ctrl}</span></div>
                </Row>
            </Col>
            <Col xs={3} onClick={() => {setTransferOpen(true); setTransferDetails(details)}}>
                <Row className="d-flex justify-content-end">
                    <Col className="border-0 pl-0" xs={4}>
                        {details.type}
                    </Col>
                    <Col className="border-0 pl-0" xs={1}>
                        {props.assigned && <>x</>}
                    </Col>
                    <Col className="border-0" xs={2}>
                        {details.wtc}
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <span className="fs-l fw-b">{props.callsign}</span>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col className="border-0 pl-0" xs={3}>
                    {details.squawk}
                    </Col>
                    {details.ass_squawk !== details.squawk && <Col className="fc-red border-0 pl-1" xs={3}>{details.ass_squawk}</Col>}
                </Row>
                <Row>
                    <Col className="border-0 pl-0">RULE</Col>
                    <Col className="border-0 pl-0 text-right pr-2">{details.fp_speed}</Col>
                </Row>
            </Col>
            <Col>
                <Row><Col className="border-0 pl-0" xs={5}>{details.adep}</Col><Col className="border-0 pl-0" xs={5}>{details.ades}</Col></Row>
                <Row><Col className="border-0 pl-0" xs={5}>CLRD WPT</Col><Col className="border-0 pl-0" xs={5}>CLRD ARR</Col><Col className="border-0 pl-0 ml-auto" xs={2}>RWY</Col></Row>
                <Row>CLRD COORD WPT</Row>
                <Row><p className="scratch-pad">{details.spad}</p></Row>
            </Col>
            <Col xs={1} className="buttons">
                <Row><FontAwesomeIcon icon={faArrowsAlt} /></Row>
                <Row><FontAwesomeIcon icon={faBan} /></Row>
            </Col>
            </>
        }
        <TransferModal show={transferOpen} details={transferDetails} close={() => setTransferOpen(false)} />
        </Row>
    )
}