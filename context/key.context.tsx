import * as React from 'react';

interface IKeyContext {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

export const KeyContext = React.createContext<IKeyContext>({} as IKeyContext);

export const KeyContextProvider: React.FC = ({ children }) => {
  const [apiKey, setApiKey] = React.useState<string>('');

  return (
    <KeyContext.Provider value={React.useMemo(() => ({ apiKey, setApiKey }), [apiKey, setApiKey])}>
      {children}
    </KeyContext.Provider>
  );
};
