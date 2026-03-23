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


                    navigate('/')

                    setlogdata({
                        email: "",
                        password: ""
                    })

                }
                else {

                    if (result.status == 400) {

                        alert("Invalid email or password")

                        setlogdata({
                            email: "",
                            password: ""
                        })

                    }

                }

            } catch (error) {

                alert("Login Failed")

            }

        }
        else {

            alert("Please fill all fields")

        }

    }


    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-lg w-96">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4 rounded"
                    value={logdata.email}
                    onChange={(e) => setlogdata({ ...logdata, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                    value={logdata.password}
                    onChange={(e) => setlogdata({ ...logdata, password: e.target.value })}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-blue-600 cursor-pointer font-semibold"
                        >
                            Register
                        </span>
                    </p>
                </div>

            </div>

        </div>
    )
}

export default Loginpage