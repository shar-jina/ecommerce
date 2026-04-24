import React, { useState } from 'react'
import { loginAPI } from '../services/allAPI'
import { useNavigate } from 'react-router-dom'

function Loginpage() {

    const navigate = useNavigate()

    const [logdata, setlogdata] = useState({
        email: "",
        password: ""
    })

    const handleLogin = async () => {

        const { email, password } = logdata

        if (email && password) {

            try {

                const result = await loginAPI(logdata)
                console.log(result);
                

                if (result.status == 200) {

                    alert("Login Successful")

                    // store token
                    sessionStorage.setItem("token", result.data.token)
                    sessionStorage.setItem("user",JSON.stringify(result.data.user))
                    sessionStorage.setItem("role", result.data.user.role);

                    if(result.data.user.role === "admin" || result.data.user.role === "manager" || result.data.user.role === "superadmin") {
                        navigate('/dashboard')
                    } else {
                        navigate('/')
                    }

                    setlogdata({
                        email: "",
                        password: ""
                    })

                }
                else {
                    const errorMsg = result.data?.message || result.data?.error || "Login Failed";
                    alert(errorMsg);
                    
                    if (result.status == 400) {
                        setlogdata({
                            email: "",
                            password: ""
                        })
                    }
                }

            } catch (error) {
                console.error("Login logical error:", error);
                alert("An unexpected error occurred. Please try again.");
            }

        }
        else {

            alert("Please fill all fields")

        }

    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white font-inter px-6">
            <div className="w-full max-w-[400px] animate-fade-in">
                <div className="text-center mb-12">
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Identity</span>
                    <h2 className="text-[40px] font-black font-heading uppercase tracking-tighter leading-none mb-4">Login.</h2>
                    <p className="text-gray-500 text-xs font-light tracking-wide">Enter your credentials to access the selection.</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="name@architecture.com"
                            className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-xs font-light focus:border-gold outline-none transition-all placeholder:text-gray-800"
                            value={logdata.email}
                            onChange={(e) => setlogdata({ ...logdata, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Secure Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-xs font-light focus:border-gold outline-none transition-all placeholder:text-gray-800"
                            value={logdata.password}
                            onChange={(e) => setlogdata({ ...logdata, password: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-white text-black py-6 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all active:scale-[0.98] mt-4"
                    >
                        Login
                    </button>
                    
                    <div className="text-center mt-10">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            New to the Collective?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-white cursor-pointer font-black border-b border-white/10 hover:border-white transition-all pb-0.5 ml-2"
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginpage