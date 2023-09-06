import { createContext } from "react";


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let user = 5    


    let contextData = {
        user:user,
      
    }

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}
