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
        <div>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isOtpSent ? "Verify Email" : "Register"}
                    </h2>

                    {!isOtpSent ? (
                        <>
                            <input
                                placeholder="Name"
                                value={regdata.name}
                                className="w-full border p-2 mb-4 rounded"
                                onChange={(e) => setregdata({ ...regdata, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={regdata.email}
                                className="w-full border p-2 mb-4 rounded"
                                onChange={(e) => setregdata({ ...regdata, email: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={regdata.password}
                                className="w-full border p-2 mb-4 rounded"
                                onChange={(e) => setregdata({ ...regdata, password: e.target.value })}
                            />
                            <button
                                onClick={handleRegister}
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                Enter the 6-digit code sent to <strong>{regdata.email}</strong>
                            </p>
                            <input
                                placeholder="Enter OTP"
                                value={otp}
                                className="w-full border p-2 mb-4 rounded text-center tracking-widest font-bold"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button
                                onClick={handleVerifyOtp}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Verify OTP
                            </button>
                            <button
                                onClick={() => setIsOtpSent(false)}
                                className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Back to Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Registerpage