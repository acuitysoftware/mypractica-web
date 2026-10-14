import React, { useState } from 'react'
import "./styles.scss"
import PageWrapper from '../../../common/pagewrapper/PageWrapper'
import ico from "../../../assets/ico-practica.png"
import { forgetPassword } from '../../../api/auth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { ThreeCircles } from 'react-loader-spinner'

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const navigateTo = useNavigate()
    const submitOtp = async () => {
        setLoading(true)
        try {
            if (!email || email.length === 0) {
                setLoading(false)
                toast.error("Please Enter Email")
            } else {
                const res = await forgetPassword(email);
                if (res?.status === false) {
                    setLoading(false)
                    await Swal.fire({
                        title: res?.message,
                        icon: "error",
                        timer: 2000
                    })
                } else {
                    setLoading(false)
                    await Swal.fire({
                        title: res?.message,
                        icon: "success",
                        timer: 2000
                    })
                    navigateTo(`/forgot-password-otp/${email}`)
                }
            }

        } catch (error) {
            setLoading(false)
            await Swal.fire({
                title: "Something Went Wrong",
                icon: "error",
                timer: 2000
            })
        }
    }
    return (
        <PageWrapper>
            <div className="forget-password">
                <div className="fp-box">
                    <img src={ico} alt="" />
                    <h2>Forget Your Password?</h2>
                    <p>Enter your email below</p>
                    <input type="email" placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
                    {
                        loading ?
                            <button>
                                <ThreeCircles
                                    visible={true}
                                    height="30"
                                    width="30"
                                    color="#fff"
                                    ariaLabel="three-circles-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </button> : <button onClick={submitOtp}>Get Otp</button>

                    }

                </div>
            </div>
        </PageWrapper>
    )
}

export default ForgetPassword
