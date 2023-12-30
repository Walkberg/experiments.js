import React, { ReactNode, createContext, useContext } from 'react';
import { ContractClient } from '../contract'; 


const ContractClientContext = createContext<ContractClient | null>(null);

interface UserClientProviderProps {
    contractClient:ContractClient
    children: ReactNode;
  }
  
export const ContractClientProvider = ({ contractClient, children }:UserClientProviderProps) => {
  return (
    <ContractClientContext.Provider value={contractClient}>
      {children}
    </ContractClientContext.Provider>
  );
}

export const useContractClient = (): ContractClient => {
  const client = useContext(ContractClientContext);

  if (!client) {
    throw new Error('useContractClient doit être utilisé dans un composant enfant de ContractClientProvider');
  }

  return client;
};