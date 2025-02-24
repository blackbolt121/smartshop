import React, { useEffect, useState } from "react";
import { FormControl, Input, Button, Card, Typography, FormHelperText, FormLabel } from "@mui/joy";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios";
import { TokenPayload } from "../types/TokenPayload";
import {saveTokens, getAccessToken} from "../store/auth"

const Signup = () => {

    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);


    useEffect(()=> {
        if(getAccessToken() != null && getAccessToken() != undefined){
            navigate("/")
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar si las contraseñas coinciden
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validar si todos los campos están completos
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        // Aquí iría el código para crear el usuario (enviar a un backend, etc.)
        setError(null); // Limpiar el error
        alert("Signup")

        let request  = await axios.post("http://localhost:8080/auth/register", {
            "email": email,
            "password": password,
            "name": name
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })

        const tokenAuth: TokenPayload = request.data

        saveTokens(tokenAuth.access_token, tokenAuth.refresh_token)

        console.log(tokenAuth)

        navigate("/")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card variant="outlined" className="w-full max-w-sm p-8 space-y-6">
                <Typography level="h4" sx={{ textAlign: "center" }}>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FormControl required>
                            <FormLabel required>
                                Name
                            </FormLabel>
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                            {error && name === "" && (
                                <FormHelperText sx={{ color: "red" }}>Name is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="email">
                                Email
                            </FormLabel>
                            <Input
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            {error && email === "" && (
                                <FormHelperText sx={{ color: "red" }}>Email is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="password">
                                Password
                            </FormLabel>
                            <Input
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            {error && password === "" && (
                                <FormHelperText sx={{ color: "red" }}>Password is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="confirmpassword">
                                Confirm password
                            </FormLabel>
                            <Input
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            {error && confirmPassword === "" && (
                                <FormHelperText sx={{ color: "red" }}>Confirm Password is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    {error && password !== confirmPassword && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <Button type="submit" fullWidth>
                        Sign Up
                    </Button>
                </form>
                <div className="text-center">
                    <Typography level="body-lg" color="primary">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Log in
                        </Link>
                    </Typography>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
