import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginReg.css";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 login">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="form-toggle">
                    <button className="active">Login</button>
                    <button onClick={() => navigate('/register')}>Signup</button>
                </div>
                <h1 className="text-2xl font-bold mb-4 m-2">Login Form</h1>
                <form>
                    <div className="mb-4 m-2">
                        <input type="email" placeholder="Email Address" className="w-full border p-2 rounded" />
                    </div>
                    <div className="mb-4 m-2">
                        <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
                    </div>
                    <div className="text-right mb-4 m-2">
                        <a href="#" className="text-blue-500">Forgot password?</a>
                    </div>
                    <button className="w-full bg-blue-900 text-white p-2 rounded">Login</button>
                </form>
                <p className="mt-4 m-2">Not a member? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>Signup now</span></p>
            </div>
        </div>
    );
}
