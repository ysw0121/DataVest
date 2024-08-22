// tokencontext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    if (storedJwt) {
      setJwt(storedJwt);
    }
  }, []);

  const setToken = (jwt) => {
    localStorage.setItem('jwt', jwt);
    setJwt(jwt);
  };

  const getToken = () => jwt;

  const removeToken = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
  };

  return (
    <TokenContext.Provider value={{ setToken, getToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};