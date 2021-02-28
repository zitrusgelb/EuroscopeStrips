import React, { useEffect, useState } from 'react';

export const RootContext = React.createContext();
export default function RootContextProvider({ children }){
    const [ip, setIp] = useState(window.location.hostname)
    const [commSettings, setCommSettings] = useState({connected: false, commKey: "", address: "",})

    const loadIp = () => {
        let host = localStorage.getItem('euroscope-adress');
        host = JSON.parse(host)
	console.log(host)
	if (host !== null) setIp(host);
    }

    const loadSettings = () => {
        let settings = localStorage.getItem('commSettings');
        settings = JSON.parse(settings)
        if (settings) setCommSettings(settings);
    }

    useEffect(() => {
        loadIp();
        //loadSettings();
    }, [loadIp])

    const defaultContext = {
        ip,
        setIp,
        commSettings,
        setCommSettings
    };
    return (
    <RootContext.Provider value={defaultContext}>
        {children}
    </RootContext.Provider>
    );
}
