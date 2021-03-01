import React, { useContext, useState, useEffect } from 'react';
import {
    Col,
    Row,
    Container
} from 'react-bootstrap'
import axios from 'axios'
import Clock from 'react-live-clock';

import { RootContext } from '../RootContext'
import Strip from '../components/Strip'
import SettingsModal from '../components/SettingsModal'

export default function StripBoard() {
    const { ip, setIp } = useContext(RootContext)

    const [planes, setPlanes] = useState([])

    const [info, setInfo] = useState({station: 'UNICOM', frequency: "122.800"})

    const [controllers, setControllers] = useState([])

    const [runs, setRuns] = useState(0)
    //const [tokenSource] = useState(axios.CancelToken.source())

    var CancelToken = axios.CancelToken;
    var cancel;

    const loadCallsigns = () => {
        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getVisibleCallsigns'
        },
        {cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          })}
        )
        .then(response => {
            setPlanes([response.data.result[2], response.data.result[5], response.data.result[7], response.data.result[4].concat(response.data.result[3]), [], []])
        })
        .catch(err =>
            console.error(err)
        )
        setTimeout(() => {loadCallsigns()}, 20000)
    }

    const getMyInfo = () => {
        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getControllerCallsign'
        },
        {cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          })}
        )
        .then(response => {
            setInfo(prevState => ({frequency: prevState.frequency, station: response.data.result}))
        })
        .catch(err =>
            console.error(err)
        )

        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getPrimaryFrequency'
        },
        {cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          })}
        )
        .then(response => {
            setInfo(prevState => ({station: prevState.station, frequency: response.data.result}))
        })
        .catch(err =>
            console.error(err)
        )
    }

    const loadControllers = () => {
        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getControllerList'
        },
        {cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          })}
        )
        .then(response => {
            setControllers(response.data.result)
        })
        .catch(err =>
            console.error(err)
        )

        setTimeout(() => loadControllers(), 60000)
    }

    useEffect(() => {
        if(runs > 0) return
        loadCallsigns()
        setTimeout(() => getMyInfo(), 10000)
        loadControllers()
        setRuns(runs+1)
    }, [loadCallsigns, runs, setRuns, loadControllers, getMyInfo])

    const [settingsModal, setSettingsModal] = useState(false)

    return (
        <Container>
            <Row xs={3}>
                <Col>
                    <Row className="bay">
                        <div className="bay-title">INBOUND</div>
                        <div className="p-0 strip-container bay-50">
                            <div>
                                {planes && planes[0] && planes[0].map((ib, bi) => 
                                    <div key={bi}>
                                        <Strip callsign={ib} controllers={controllers}></Strip>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Row>
                    <Row className="bay">
                        <div className="bay-title">OUTBOUND</div>
                        <div className="p-0 strip-container bay-50">
                            <div>
                                {planes && planes[2] && planes[2].map((ib, bi) => 
                                    <div key={bi}>
                                        <Strip callsign={ib} controllers={controllers}></Strip>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Row>
                </Col>
                <Col>
                    <Row className="bay">
                        <div className="bay-title">HAND-OFF</div>
                        <div className="p-0 strip-container bay-25">
                            <div>
                                {planes && planes[3] && planes[3].map((ib, bi) => 
                                        <div key={bi}>
                                            <Strip callsign={ib} controllers={controllers}></Strip>
                                        </div>
                                )}
                            </div>
                        </div>
                    </Row>
                    <Row className="bay">
                        <div className="bay-title">ON FREQ</div>
                        <div className="p-0 strip-container bay-75">
                            <div>
                                {planes && planes[1] && planes[1].map((ib, bi) => 
                                        <div key={bi}>
                                            <Strip callsign={ib} assigned controllers={controllers}></Strip>
                                        </div>
                                )}
                            </div>
                        </div>
                    </Row>
                </Col>
                <Col>
                    <Row className="bay">
                    <div className="bay-title">ON FREQ</div>
                        <div className="p-0 strip-container bay-50">
                            <div>
                                {planes && planes[4] && planes[4].map((ib, bi) => 
                                        <div className="bay-title" key={bi}>
                                           <Strip callsign={ib} controllers={controllers}></Strip>
                                        </div>
                                )}
                            </div>
                        </div>
                        <Row className="bay">
                            <div className="bay-title">ON FREQ</div>
                            <div className="p-0 strip-container bay-50">
                                <div>
                                    {planes && planes[5] && planes[5].map((ib, bi) => 
                                            <div className="bay-title" key={bi}>
                                            <Strip callsign={ib} controllers={controllers}></Strip>
                                            </div>
                                    )}
                                </div>
                            </div>
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className="button-row">
                <div className="container">
                    <div className="button" onClick={() => window.open("https://edwwatciss.com")}><span>ISS</span></div>
                    <div className="button"><span>TTD</span></div>
                    <div className="button"><span>SET</span></div>
                    <div className="button"><span>APL</span></div>
                    <div className="button"><span>HOTKEY</span></div>
                    <div className="button" onClick={() => setSettingsModal(true)}><span>SETTINGS</span></div>
                    <div className="button"><span>NEW STRIP</span></div>
                    <div className="info d-flex">
                        <span className="station">{info.station}</span>
                        <span className="freq">{info.frequency}</span>
                        <span className="time"><Clock format={'HH:mm:ss'} ticking={true} /></span>
                        </div>            
                </div>
            </Row>
            <SettingsModal show={settingsModal} close={() => setSettingsModal(false)} info={info} />
        </Container>
    )
}