import React, { createContext, useState, useContext } from 'react';

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <BannerContext.Provider value={{ showBanner, setShowBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);