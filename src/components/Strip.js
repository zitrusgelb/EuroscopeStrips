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
import ClearanceModal from '../components/ClearanceModal'

export default function Strip(props) {
    const { ip, squawks } = useContext(RootContext)

    const [details, setDetails] = useState([])
    const [runs, setRuns] = useState(0)
    const [flightDir, setFlightDir] = useState("")
    const [route, setRoute] = useState("")

    const [procedure, setProcedure] = useState("")
    const [runway, setRunway] = useState("")

    const [open, setOpen] = useState(false)

    const [transferOpen, setTransferOpen] = useState(false)
    const [transferDetails, setTransferDetails] = useState([])
    
    const [clearanceOpen, setClearanceOpen] = useState(false)
    const [clearanceDetails, setClearanceDetails] = useState([])

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

    const getRoute = () => {
        if(details.nextAirway && details.nextAirway.length > 5) {
            setProcedure(details.nextAirway)
            let rwy = details.fp_route.substr(details.fp_route.length - 10).split('/')[1];
            setRunway(rwy)
        }
        if(details.extracted_rte && details.extracted_rte.length > 0) {
            let rte = details.extracted_rte.split(':').join(' ').substr(0, 20);
            setRoute(rte)
        }
    }

    useEffect(() => {
        let isMounted = true
        if(!isMounted) return;
        const intervalId = setInterval(() => {
            loadDetails()
            getRoute()
        }, 10000);
        return () => {
            clearInterval(intervalId);
            isMounted = false
        }
    }, [loadDetails])

    const getFlightDir = () => {
        if(!details) return
        if(runs > 0) return
        setFlightDir(details.direction)
        setRuns(runs + 1)
    }

    useEffect(() => {
        getFlightDir()
    }, [getFlightDir()])

    const specialSquawk = (ssr) => {
        return squawks[ssr]
    }

    return (
        <>
        {details && details.callsign &&
        <Row className={"strip " + details.direction} id={details.squawk === '7000' || details.ass_squawk === '7000' || details.squawk === '7740' || details.ass_squawk === '7740' ? 'vfr' : ''} >
        {!open ?
            <>
            <Col xs={2} onClick={() => setOpen(!open)} className="waypoint">
                <Row>
                    <div className="fw-b next">
                        {getUTCTimeToPoint(details.next_time)} {details.next_point}
                    </div>
                </Row>
            </Col>
            <Col className="fw-b d-flex justify-content-between mr-1 center" xs={1} onClick={() => {setClearanceOpen(true); setClearanceDetails(details)}}>
                {getAltitude(details.cfl, details.rfl)}
                {details.climb_descend && details.climb_descend === 'D' && <img src={downArrow} height="45px" width="auto" alt="" />}
                {details.climb_descend && details.climb_descend === 'C' && <img src={upArrow} height="45px" width="auto" alt="" />}
            </Col>
            <Col className="fs-s" xs={1}  onClick={() => {setClearanceOpen(true); setClearanceDetails(details)}}>
                <Row>
                    {details.rfl}
                </Row>
                <Row className="b-t fc-blue">
                    R{details.ass_rate === '0' ? '' : Number(details.ass_rate) / 1000}
                </Row>
            </Col>
            <Col xs={3} onClick={() => {setTransferOpen(true); setTransferDetails(details)}} className="center">
                <span className="vt-t">{details.comm_type === "t" && details.comm_type}</span> 
                <span className="fs-s">{details.type}</span> 
                <span className="fs-l fw-b">{props.callsign}</span> 
                {details.wtc === "H" && <span className="wtc-h">{details.wtc}</span>}
            </Col>
            <Col className="center">
                <span>{details.adep}</span><span>{details.ades}</span>
            </Col>
            <Col xs={1} className="buttons">
                <FontAwesomeIcon icon={faArrowsAlt} size="xs" onClick={() => props.move(1, details.callsign)}/>
            </Col>
            </>
            :
            <>
            <Col xs={2} onClick={() => setOpen(!open)} className="d-flex align-items-stretch">
                <Row>
                    <Row className="copn"><span>{details.copn_point}</span></Row>
                    <Row className="fw-b next">{getUTCTimeToPoint(details.next_time)} {details.next_point}</Row>
                    <Row className="copx">{getUTCTimeToPoint(details.copx_time).substr(2,4)} {details.copx_point}</Row>
                </Row>
            </Col>
            <Col xs={2} xl={1} onClick={() => {setClearanceOpen(true); setClearanceDetails(details)}}>
                <Row className="d-flex justify-content-between flex-column" noGutters>
                    <Row>
                        <Col className="d-flex justify-content-between border-0 pl-0 mr-1">
                            <span className="fw-b h-55">{getAltitude(details.cfl, details.rfl)}</span>
                            {details.climb_descend && details.climb_descend === 'D' && <img src={downArrow} height="55px" width="auto" alt="" />}
                            {details.climb_descend && details.climb_descend === 'C' && <img src={upArrow} height="55px" width="auto" alt="" />}
                        </Col>
                    </Row>
                    <Row className="b-t">
                        <Col className="border-0 pl-0">
                            <span>.</span>
                        </Col>
                        <Col className="pl-0">
                            <span>.</span>
                        </Col>
                    </Row>
                </Row>
            </Col>
            <Col className="fs-s" xs={1}  onClick={() => {setClearanceOpen(true); setClearanceDetails(details)}}>
                <Row>
                    {details.rfl}
                </Row>
                <Row className="b-t fc-blue">
                    R{details.ass_rate === '0' ? '' : Number(details.ass_rate) / 1000}
                </Row>
                <Row className="fc-red">
                    R{details.ass_rate === '0' ? '' : Number(details.ass_rate) / 1000}
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
                    <Col className={details.wtc === "H" ? "border-0 wtc-h" : "border-0"} xs={2}>
                        {details.wtc}
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    {details.comm_type === "/t" && <span className="vt-t">{details.comm_type}</span>}
                    <span className="fs-l fw-b">{props.callsign}</span>
                </Row>
                <Row className="d-flex">
                    <Col className="border-0 pl-0 fs-s fc-green d-flex align-items-center text-uppercase" xs={4}>{specialSquawk(details.squawk)}</Col>
                    <Col className="border-0 pl-0" xs={3}>
                    {details.squawk}
                    </Col>
                    {details.ass_squawk !== details.squawk && <Col className="fc-red border-0 pl-1 fw-b" xs={3}>{details.ass_squawk}</Col>}
                </Row>
                <Row>
                    <Col className="border-0 pl-0">{details.flt_rule}</Col>
                    <Col className="border-0 pl-0 text-right pr-2">{details.fp_speed}</Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col className="border-0 pl-0" xs={5}>{details.adep}</Col>
                    <Col className="border-0 pl-0" xs={5}>{details.ades}</Col>
                </Row>
                <Row>
                    <Col className="border-0 pl-0" xs={5}></Col>
                    <Col className="border-0 pl-0" xs={5}>{procedure}</Col>
                    <Col className="border-0 pl-0 ml-auto" xs={2}>{runway}</Col>
                </Row>
                <Row>
                    <Col className="border-0 pl-0">{route}</Col>
                </Row>
                <Row>
                    <span className="scratch-pad">{details.spad}</span>
                </Row>
            </Col>
            <Col xs={1} className="buttons d-flex align-items-center justify-content-around flex-column">
                <Row><FontAwesomeIcon icon={faArrowsAlt} size="xs" /></Row>
                <Row><FontAwesomeIcon icon={faBan} size="xs" /></Row>
            </Col>
            </>
        }
        <TransferModal show={transferOpen} details={transferDetails} controllers={props.controllers} close={() => {setTransferOpen(false); loadDetails()}} />
        <ClearanceModal show={clearanceOpen} details={clearanceDetails} assigned={props.assigned} runway={runway} controllers={props.controllers} close={() => {setClearanceOpen(false); loadDetails()}} />
        </Row>
    }
    </>
    )
}