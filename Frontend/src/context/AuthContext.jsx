import {
    createContext,
    useState
} from "react";

export const AuthContext =
    createContext();

export const AuthProvider =
({ children }) => {

    const [token, setToken] =
        useState(
            localStorage.getItem("token")
        );

    const [role, setRole] =
        useState(
            localStorage.getItem("role")
        );

    const login = (data) => {

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        localStorage.setItem(
            "userId",
            data.id
        );

        setToken(data.token);

        setRole(data.role);
    };

    const logout = () => {

        localStorage.clear();

        setToken(null);

        setRole(null);
    };

    return (

        <AuthContext.Provider
            value={{

                token,
                role,
                login,
                logout

            }}
        >

            {children}

        </AuthContext.Provider>
    );
};