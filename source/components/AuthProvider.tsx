import React from 'react'

type User = {
  _id: string;
  username: string;
  provider: string;
  photo: string;
}

interface AuthContextProps {
  authorized: boolean;
  user: User | null;
}

const AuthContext = React.createContext<AuthContextProps>({authorized:false, user:null});
export const useAuth = () : AuthContextProps  => {
  return React.useContext(AuthContext);
};

const AuthProvider : React.FC<{children : React.ReactNode}> = ({ children }) => {
  const [authorized, setAuthorization] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function checkAuthorization() {
      const response = await fetch('/api/authed', {
        method: 'GET'
      });

      if (response.ok) {
        const user_data = await response.json();
        console.log(user_data);
        setAuthorization(true);
        setUser(user_data);
      } else {
        setAuthorization(false);
        setUser(null);
      }
    }

    checkAuthorization().catch((error) => console.error(error));
  }, []);


  return (
      <AuthContext.Provider
          value={{authorized, user}}>{children}
      </AuthContext.Provider>
  );
}

export default AuthProvider;
