import { ReactNode, createContext, useContext, useState } from "react";

interface User {
  username: string;
  roomID: string;
  avatar: string;
}

interface StateContextProps {
  user: User;
  setUser: (user: User) => void;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    username: "",
    roomID: "",
    avatar: "",
  });

  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ContextProvider");
  }
  return context;
};
