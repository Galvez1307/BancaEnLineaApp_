import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabaseClient";

type User = {
  id: string;
  email?: string | null;
  token?: string | null;
} | null;

type AuthContextType = {
  user: User;
  isAllowed: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Error al obtener sesión:", error.message);
          return;
        }
        const session = data?.session;
        const sessionUser = session?.user;
        if (session && sessionUser && session.access_token) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email ?? null,
            token: session.access_token,
          });
          setIsAllowed(true);
        }
      } catch (e) {
        console.warn("restoreSession error:", e);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      Alert.alert("Error", "Supabase no está configurado");
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Error", error.message ?? "Credenciales inválidas");
        return false;
      }
      const session = data?.session;
      const sessionUser = data?.user ?? session?.user;
      if (session && sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email ?? null,
          token: session.access_token,
        });
        setIsAllowed(true);
        return true;
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Error inesperado");
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn("Error al cerrar sesión:", e);
    } finally {
      setUser(null);
      setIsAllowed(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAllowed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
