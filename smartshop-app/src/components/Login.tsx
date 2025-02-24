import React, { useEffect, useState } from "react";
import { Typography, Card, Input, Button, FormControl, FormLabel } from "@mui/joy";
import { Link } from "react-router-dom";
import { getAccessToken, saveTokens } from "../store/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TokenPayload } from "../types/TokenPayload";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(function validateAccess() {
    const token = getAccessToken();
    if (token) {
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, []);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }
    setError(null);
    try {
      const auth = await axios.post("http://localhost:8080/auth/login", { 
        email: email, 
        password: password 
      }, { 
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        } 
      });
      if (auth.status !== 200) {
        setError("Email or password is incorrect");
        return;
      }
      let credentials: TokenPayload = auth.data;
      saveTokens(credentials.access_token, credentials.refresh_token);
      navigate("/"); // Redirect to home after login
    }catch (error) {
      setError("Email or password is incorrect");
      console.log(error);
      return;
    }
    
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card variant="outlined" className="w-full max-w-sm p-8 space-y-6">
        <Typography level="h4">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormControl required>
                <FormLabel htmlFor="email">
                    Email
                </FormLabel>
                <Input
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                autoComplete="email"
                />
            </FormControl>
          </div>
          <div>
            <FormControl required>
                <FormLabel>
                    Password:
                </FormLabel>
                <Input
                    name="password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
            </FormControl>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
        <div className="text-center">
          <Typography level="body-lg" color="primary">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default Login;
