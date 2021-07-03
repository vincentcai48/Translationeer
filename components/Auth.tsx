import { useState } from "react"
import { pAuth } from "../services/config";

export default function Auth(){
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

    return <div>
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
        </div>
    </div>
}