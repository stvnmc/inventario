import { createContext, useState } from "react";

export const RouterContext = createContext();

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context) {
    console.warn(
      "userContext not found. Make sure you are using UserProvider."
    );
  }

  return context;
};

export const UserProvider = ({ children }) => {
  const [first, setfirst] = useState(null);

  return <RouterContext.Provider value={{}}>{children}</RouterContext.Provider>;
};
