import React, { useEffect, useState, useCallback } from 'react';

export const RootContext = React.createContext();
export default function RootContextProvider({ children }){
    const [ip, setIp] = useState(window.location.hostname)

    const loadIp = () => {
        let host = localStorage.getItem('euroscope-adress');
        if (host) setIp(host);
    }

    useEffect(() => {
        loadIp();
    }, [loadIp])

    const defaultContext = {
        ip,
        setIp
    };
    return (
    <RootContext.Provider value={defaultContext}>
        {children}
    </RootContext.Provider>
    );
}