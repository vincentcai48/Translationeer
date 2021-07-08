import { pAuth, pFirestore } from "./config";

//returns boolean, true if success, false if error.
export default async function deleteAccountFunc(): Promise<boolean>{
    const uid = pAuth.currentUser.uid;
    if(!uid) return false;
    try{
        var batch = pFirestore.batch();
        var userDoc = pFirestore.collection("users").doc(uid);
        batch.delete(userDoc);
        var docs = (await userDoc.collection("documents").get()).docs;
        docs.forEach(d=>{
            batch.delete(d.ref);
        })
        await batch.commit();
        await pAuth.currentUser.delete();
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}