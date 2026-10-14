import React, { useRef, useState } from 'react'
import "./styles.scss"
import PageWrapper from '../../../common/pagewrapper/PageWrapper'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import shape from "../../../assets/shape1.png"
import shape2 from "../../../assets/shape2.png"
import { emailOtpVerifyStudent, emailOtpVerifyTeacher, resendOtpStudent, resendOtpTeacher } from '../../../api/auth';
import Swal from 'sweetalert2';
import { ThreeCircles } from 'react-loader-spinner';

const Otp = () => {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigateTo = useNavigate()
    const otpRefs = useRef([]);

    const handleOtpInput = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };
    const { email } = useParams();
    const location = useLocation();
    const type = new URLSearchParams(location.search).get("type");
    const data = {
        email: email,
        otp: otp.join("")
    }
    const onOtpCheck = async () => {
        setLoading(true)
        try {
            if (type === "STUDENT") {
                if (otp.includes("")) {
                    setLoading(false)
                    setError("Please enter all 6 digits of the OTP.");
                } else {
                    const res = await emailOtpVerifyStudent(data);
                    if (res.status === false) {
                        setLoading(false)
                        await Swal.fire({
                            title: res.message,
                            icon: "error",
                            timer: 1500
                        })

                    } else {
                        setLoading(false)
                        await Swal.fire({
                            title: res.message,
                            icon: "success",
                            timer: 1500
                        })
                        navigateTo("/sign-in")
                    }
                }


            } else if (type === "TEACHER") {
                if (otp.includes("")) {
                    setLoading(false)
                    setError("Please enter all 6 digits of the OTP.");
                } else {
                    const res = await emailOtpVerifyTeacher(data);
                    if (res.status === false) {
                        setLoading(false)
                        await Swal.fire({
                            title: res.message,
                            icon: "error",
                            timer: 1500
                        })
                    } else {
                        setLoading(false)
                        await Swal.fire({
                            title: res.message,
                            icon: "success",
                            timer: 1500
                        })
                        navigateTo("/sign-in")
                    }
                }


            }
        } catch (error) {
            setLoading(false)
        }
    }
    const resendCode = async () => {
        try {
            if (type === "STUDENT") {
                const data = {
                    email: email
                };
                const res = await resendOtpStudent(data);
                if (res.status === false) {
                    Swal.fire({
                        title: res.message,
                        timer: 1800,
                        icon: "error"
                    })
                } else {
                    Swal.fire({
                        title: res.message,
                        timer: 1800,
                        icon: "success"
                    })
                }
            } else if (type === "TEACHER") {
                const data = {
                    email: email
                };
                const res = await resendOtpTeacher(data);
                if (res.status === false) {
                    Swal.fire({
                        title: res.message,
                        timer: 1800,
                        icon: "error"
                    })
                } else {
                    Swal.fire({
                        title: res.message,
                        timer: 1800,
                        icon: "error"
                    })
                }
            }
        } catch (error) {

        }
    }
    return (
        <PageWrapper head={"OTP"}>
            <div className="otp-page">
                <div className="otp-container">
                    <h2>OTP Verification</h2>
                    <p>Enter OTP Code Sent To {email}</p>
                    <div className="otp-inputs">
                        {Array(5).fill(0).map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                className="otp-box"
                                onChange={(e) => handleOtpInput(e, i)}
                                ref={(el) => (otpRefs.current[i] = el)}
                            />
                        ))}
                    </div>
                    <p className="resend-text">
                        Didn’t Receive OTP Code? <span onClick={resendCode} className="resend-link">Resend Code</span>
                    </p>
                    {
                        loading ? <button className='verify-btn'>
                            <ThreeCircles
                                visible={true}
                                height="30"
                                width="30"
                                color="#fff"
                                ariaLabel="three-circles-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </button> : <button onClick={onOtpCheck} className="verify-btn">Verify & Proceed</button>
                    }
                    <img src={shape} alt="" className='shapes' />
                    <img src={shape2} alt="" className='shapes2' />
                </div>
            </div>
        </PageWrapper>
    )
}

export default Otp
