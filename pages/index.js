import { useContext } from "react"
import Home from "../components/Home"
import PContext from "../services/context"
import Dashboard from "../components/Dashboard"

export default function Index() {
  const {isAuth} = useContext(PContext);

  return (
    <div className="home-container">
      {isAuth?<Dashboard></Dashboard>:<Home></Home>}
    </div>
  )
}
