import '../styles/globals.scss'
import Header from '../components/Header'
import CustomHead from "../components/CustomHead"

function MyApp({ Component, pageProps }) {
  return <div>
    <CustomHead></CustomHead>
    <Header></Header>
    <Component {...pageProps} />
  </div>
}

export default MyApp
