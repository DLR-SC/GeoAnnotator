import { createContext, useState, useContext } from "react";

/** Vaadin-like session for global data exchange */
const SessionContext = createContext();

/**
 * Custom hook for easier context access and global data exchange
 * @returns {{ sessionData, setSessionData }}
 *  */ 
export function useSession() {
  const context = useContext(SessionContext);

  if (!context) throw new Error('useSession must be used within a SessionProvider');

  return context;
};

/**
 * Context Provider Component
 * @param {children} JSX-Elements
 * @returns {React.JSX.Element}
 */
export function SessionProvider ({ children }) {
  const [sessionData, setSessionData] = useState(null);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

