import React, { createContext, useContext } from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

interface InsightsContextProps {
  insights: ApplicationInsights;
}

const InsightsContext = createContext<InsightsContextProps | undefined>(undefined);

export const useInsights = () => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context.insights;
};

// export const InsightsProvider: React.FC<InsightsContextProps> = ({ insights, children }) => {
//   return (
//     <InsightsContext.Provider value={{ insights }}>
//       {children}
//     </InsightsContext.Provider>
//   );
// };


export const InsightsProvider: React.FC<InsightsContextProps & { children: React.ReactNode }> = ({ insights, children }) => {
    return (
      <InsightsContext.Provider value={{ insights }}>
        {children}
      </InsightsContext.Provider>
    );
  };


