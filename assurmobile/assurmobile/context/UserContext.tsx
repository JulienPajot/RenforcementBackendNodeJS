import { createContext, use, useContext, useState } from "react";

type UserContextType = {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children?: any }) => {
    const [user, setUser] = useState(undefined);
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );

}

export const useCurrentUser = () => useContext(UserContext);
export default UserProvider;