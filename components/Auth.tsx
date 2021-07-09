import { useContext, useState } from "react"
import { googleAuthProvider, pAuth } from "../services/config";
import PContext from "../services/context";

export default function Auth(){
    const {isMobile} = useContext(PContext);
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [errorM,setErrorM] = useState<string|null>(null);

    const login = async () =>{
        try{
            var res = await pAuth.signInWithEmailAndPassword(email,password);
        }catch(e){
            setErrorM(e.message);
        }
    }

    const createUser = async () =>{
        try{
            var res = await pAuth.createUserWithEmailAndPassword(email,password);
        }catch(e){
            setErrorM(e.message);
        }
    }

    const googleLogin = async () => {
        try{
            if(isMobile) await pAuth.signInWithRedirect(googleAuthProvider);
            else await pAuth.signInWithPopup(googleAuthProvider);
        }catch(e){
            console.error(e);
        }
      };

    return <div id="auth-container">
        <h4>Login</h4>
        <div className="ep-auth">
            <input 
                className="auth-input"
                placeholder="Email"
                type="text"
                value={email}
                onChange={e=>setEmail(e.target.value)}
            ></input>
            <input 
                className="auth-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
            ></input>
            {errorM&&<div className="errorM">
                {errorM}
            </div>}
            <div className="button-container row">
                <button className="sb" onClick={login}>Login</button>
                <button className="tb ml15" onClick={createUser}>Create Account</button>
            </div>
            <div id="google-login-area" className="row">
                <p>OR</p>
                <button onClick={googleLogin} id="header-login-button">
                  <div id="google-logo"></div>
                  <div>Google Login</div>
            </button>
            </div>
        </div>
    </div>
}