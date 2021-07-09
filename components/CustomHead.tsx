import Head from "next/head"
import { useContext } from "react"
import PContext from "../services/context"

export default function CustomHead(){
    const {title} = useContext(PContext);
    return <Head>
        <title>{title||"Translationeer"}</title>
        <link rel="icon" href='/images/favicon.jpg'/>
    </Head>
}