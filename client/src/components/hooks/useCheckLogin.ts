import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";

const useCheckLogin = () => {
    const loginState   =  useContext(AuthContext);
    if (!loginState) {
        throw new Error("useAuth must be used within AuthContext.Provider");
      }
 
    return loginState;
}


export default useCheckLogin;