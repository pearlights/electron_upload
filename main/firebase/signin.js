import storage from "./config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(storage); // ! This will not work, you cant initialise auth with a storage bucket
// ! I'll do the init logic for you


export default async function signUp(email, password) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}