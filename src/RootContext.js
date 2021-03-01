import React, { useEffect, useState } from 'react';

export const RootContext = React.createContext();
export default function RootContextProvider({ children }){
    const [ip, setIp] = useState(localStorage.getItem('euroscope-adress') ? JSON.parse(localStorage.getItem('euroscope-adress')) : window.location.hostname)
    const [commSettings, setCommSettings] = useState({connected: false, commKey: "", address: "",})
    
    const [squawks, setSquawks] = useState({
        '7000': 'vfr',
        '0020': 'rsc',
        '0036': 'pol',
        '7740': 'fis',
        '0027': 'acro'
    })

    const loadSettings = () => {
        let settings = localStorage.getItem('commSettings');
        settings = JSON.parse(settings)
        if (settings) setCommSettings(settings);
    }

    useEffect(() => {
        let host = localStorage.getItem('euroscope-adress');
	    if (host) {
            host = JSON.parse(host)
            setIp(host);
        } else {
            setIp(window.location.hostname)
        }
    }, [setIp])

    const defaultContext = {
        ip,
        setIp,
        commSettings,
        setCommSettings,
        squawks
    };
    return (
    <RootContext.Provider value={defaultContext}>
        {children}
    </RootContext.Provider>
    );
}
