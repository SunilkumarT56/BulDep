import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { AuthPage } from "@/components/AuthPage";
import { VerifyPage } from "@/components/VerifyPage";
import { LandingPage } from "@/components/LandingPage";
import { SignupPage } from "@/components/SignupPage";
import { SignupStepTwo } from "@/components/SignupStepTwo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth...");
      // 1. Check for token in URL (OAuth callback)
      const params = new URLSearchParams(window.location.search);
      let token = params.get("token");

      if (token) {
        console.log("Token found in URL");
        localStorage.setItem("authToken", token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        token = localStorage.getItem("authToken");
        console.log("Token from localStorage:", token ? "Found" : "Not found");
      }

      // Fallback to hardcoded token if no dynamic token found (Preserving user's testing token)
      if (!token) {
          console.log("Using fallback hardcoded token");
          token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwOTI5NTg1Zi02MmQ0LTQ5ODgtODdmZC1jYmUzOTgxODJmNjciLCJpYXQiOjE3NjY0MDEyNzIsImV4cCI6MTc2NzAwNjA3Mn0.TkZRiEnqkhJFdDtCZcQh6_wmYhPLd4UPPoMk3nvLv3Y";
      }

      if (token) {
         try {
             console.log("Fetching /user/me with token...");
             const response = await fetch("https://untolerative-len-rumblingly.ngrok-free.dev/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
             });
             
             console.log("Response status:", response.status);
             if (response.ok) {
                 const data = await response.json();
                 console.log("Auth Data:", data);
                 // Check for authenticated status OR user object presence
                 if (data.authenticated) {
                     console.log("Setting authenticated=true");
                     localStorage.setItem("isAuthenticated", "true");
                     setIsAuthenticated(true);
                     if (data.user) {
                        setUserId(data.user.id);
                        setUserEmail(data.user.email);
                     }
                 } else {
                    console.log("Data not authenticated, logging out");
                    handleLogout();
                 }
             } else {
                 console.log("Response not OK, logging out");
                 handleLogout();
             }
         } catch (e) {
             console.log("Session check failed", e);
             setIsAuthenticated(false);
         } finally {
            console.log("Auth checking done");
            setIsAuthChecking(false);
         }
      } else {
          console.log("No token, marking check as done");
          setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://untolerative-len-rumblingly.ngrok-free.dev/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
          return;
        }
      }
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("logged_in");
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  if (isAuthChecking) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center text-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
      );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <AuthPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          !isAuthenticated ? (
            <SignupPage />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      <Route 
        path="/signup/connect" 
        element={
          !isAuthenticated ? (
            <SignupStepTwo />
          ) : (
             <Navigate to="/dashboard" replace />
          )
        } 
      />
      <Route 
        path="/verify" 
        element={<VerifyPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white font-sans antialiased">
              <Header onLogout={handleLogout} userEmail={userEmail} userId={userId} />
              <main>
                <Dashboard />
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        } 
      />
      <Route 
        path="/new" 
        element={
          isAuthenticated ? (
            <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white font-sans antialiased">
              <Header onLogout={handleLogout} userEmail={userEmail} userId={userId} />
              <main>
                <Hero />
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;
