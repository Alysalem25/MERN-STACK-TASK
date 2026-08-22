// "use client";

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
// } from "react";

// import api from "@/lib/api";
// import {
//     saveAuthData,
//     getAuthToken,
//     getAuthUser,
//     logout as clearAuth,
//     AuthUser,
// } from "@/lib/auth";

// interface AuthContextType {
//     user: AuthUser | null;
//     isAuthenticated: boolean;
//     loading: boolean;

//     login: (
//         email: string,
//         password: string
//     ) => Promise<void>;

//     logout: () => Promise<void>;
// }

// const AuthContext = createContext < AuthContextType | undefined > (
//     undefined
// );

// export function AuthProvider({
//     children,
// }: {
//     children: ReactNode;
// }) {
//     const [user, setUser] = useState < AuthUser | null > (null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const initializeAuth = async () => {
//             const token = getAuthToken();

//             if (!token) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await api.auth.profile();

//                 const currentUser = response.user;

//                 setUser(currentUser);

//                 saveAuthData(token, currentUser);
//             } catch (error) {
//                 console.error("Auth initialization failed:", error);

//                 clearAuth();
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         initializeAuth();
//     }, []);

//     const login = async (
//         email: string,
//         password: string
//     ) => {
//         const response = await api.auth.login({
//             email,
//             password,
//         });

//         const { token, user } = response;

//         if (!token || !user) {
//             throw new Error("Invalid login response");
//         }
//         saveAuthData(token, user);

//         setUser(user);
//     };

//     const logout = async () => {
//         try {
//             if (getAuthToken()) {
//                 await api.auth.logout();
//             }
//         } catch (error) {
//             console.error("Logout request failed:", error);
//         } finally {
//             clearAuth();
//             setUser(null);
//         }
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 isAuthenticated: !!user,
//                 loading,
//                 login,
//                 logout,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);

//     if (!context) {
//         throw new Error(
//             "useAuth must be used inside AuthProvider"
//         );
//     }

//     return context;
// }

"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import api from "@/lib/api";
import {
    saveAuthData,
    getAuthToken,
    getAuthUser,
    logout as clearAuth,
    AuthUser,
} from "@/lib/auth";

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    authLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = getAuthToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.auth.profile();
                const currentUser = response.user;
                setUser(currentUser);
                saveAuthData(token, currentUser);
            } catch (error) {
                console.error("Auth initialization failed:", error);
                clearAuth();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (
        email: string,
        password: string
    ) => {
        const response = await api.auth.login({
            email,
            password,
        });

        const { token, user } = response;

        if (!token || !user) {
            throw new Error("Invalid login response");
        }
        saveAuthData(token, user);
        setUser(user);
    };

    const logout = async () => {
        try {
            if (getAuthToken()) {
                await api.auth.logout();
            }
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            clearAuth();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                authLoading: loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}