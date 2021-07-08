import { useRouter } from "next/router";
import Studio from "../../components/studio/Studio";

export default function DocId(){
    const { query } = useRouter();
    const {id} = query;
    return <Studio
        isTest={false}
        id={String(id)}
    ></Studio>
}