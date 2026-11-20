import {auth} from "@/config/firebaseConfig";
import {onAuthStateChanged, type User} from "firebase/auth";
import {useEffect, useState} from "react";

export const useGetUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {user, loading};
};