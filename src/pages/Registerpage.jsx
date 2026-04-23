import React, { useState } from 'react'
import { registerAPI, verifyOTPAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';

function Registerpage() {
    const navigate = useNavigate()
    const [regdata, setregdata] = useState({ name: "", email: "", password: "" })
    const [otp, setOtp] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)

    const handleRegister = async () => {
        const { name, email, password } = regdata
        if (name && email && password) {
            try {
                const result = await registerAPI(regdata)
                if (result.status === 201) {
                    if (result.data.is_verified) {
                        alert("Registration Successful");
                        navigate('/login');
                    } else {
                        alert("OTP sent to your email. Please verify.");
                        setIsOtpSent(true);
                    }
                } else {
                    alert(result.data.message || "Registration Failed");
                }
            } catch (error) {
                alert("Registration Failed");
            }
        } else {
            alert("Please fill all fields");
        }
    };

    const handleVerifyOtp = async () => {
        if (otp) {
            try {
                const result = await verifyOTPAPI({ email: regdata.email, otp });
                if (result.status === 200) {
                    alert("Email verified successfully! You can now login.");
                    navigate('/login');
                } else {
                    alert(result.data.message || "Verification Failed");
                }
            } catch (error) {
                alert("Verification Failed");
            }
        } else {
            alert("Please enter OTP");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white font-inter px-6">
            <div className="w-full max-w-[400px] animate-fade-in py-20">
                <div className="text-center mb-12">
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{isOtpSent ? "Verification" : "Membership"}</span>
                    <h2 className="text-[40px] font-black font-heading uppercase tracking-tighter leading-none mb-4">
                        {isOtpSent ? "Secure." : "Register."}
                    </h2>
                    <p className="text-gray-500 text-xs font-light tracking-wide">
                        {isOtpSent ? `Enter the 6-digit code sent to ${regdata.email}` : "Join the collective of refined technology."}
                    </p>
                </div>

                <div className="space-y-6">
                    {!isOtpSent ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                <input
                                    placeholder="Alaric Vance"
                                    value={regdata.name}
                                    className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-xs font-light focus:border-gold outline-none transition-all placeholder:text-gray-800"
                                    onChange={(e) => setregdata({ ...regdata, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Protocol</label>
                                <input
                                    type="email"
                                    placeholder="name@architecture.com"
                                    value={regdata.email}
                                    className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-xs font-light focus:border-gold outline-none transition-all placeholder:text-gray-800"
                                    onChange={(e) => setregdata({ ...regdata, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Secure Key</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={regdata.password}
                                    className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-xs font-light focus:border-gold outline-none transition-all placeholder:text-gray-800"
                                    onChange={(e) => setregdata({ ...regdata, password: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleRegister}
                                className="w-full bg-white text-black py-6 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all active:scale-[0.98] mt-4"
                            >
                                Create Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">OTP Sequence</label>
                                <input
                                    placeholder="000000"
                                    value={otp}
                                    className="w-full bg-[#0a0a0a] border border-white/5 px-6 py-4 text-center text-xl font-black tracking-[0.5em] focus:border-gold outline-none transition-all placeholder:text-gray-900"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                className="w-full bg-gold text-white py-6 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold-light transition-all active:scale-[0.98] mt-4"
                            >
                                Verify Sequence
                            </button>
                            <button
                                onClick={() => setIsOtpSent(false)}
                                className="w-full text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-2"
                            >
                                Back to Protocol
                            </button>
                        </>
                    )}
                    
                    {!isOtpSent && (
                        <div className="text-center mt-10">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                                Already a Member?{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-white cursor-pointer font-black border-b border-white/10 hover:border-white transition-all pb-0.5 ml-2"
                                >
                                    Login
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Registerpage