import React, { useState } from 'react'
import "./styles.scss"
import PageWrapper from '../../../common/pagewrapper/PageWrapper'
import ico from "../../../assets/ico-practica.png"
import toast from 'react-hot-toast'
import { resetPassword } from '../../../api/auth'
import Swal from 'sweetalert2'
import { ThreeCircles } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')
    const [loading, setLoading] = useState(false)
    const navigateTo = useNavigate()

    const data = {
        email: email,
        password: password,
        password_confirmation: password_confirmation
    }

    const ResetthePassword = async () => {
        setLoading(true)
        try {
            if (!email || !password || !password_confirmation) {
                setLoading(false)
                toast.error("Please fill up all the fields")

            } else {
                const res = await resetPassword(data);
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
                    navigateTo(`/sign-in`)
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
            <div className="reset-password">
                <div className="reset-box">
                    <img src={ico} alt="" />
                    <h1>Reset Your Password</h1>
                    <input type="email" placeholder='Enetr Your Email' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Enetr Your Password' onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder='Confirm Your Password' onChange={(e) => setPasswordConfirmation(e.target.value)} />
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
                        </button> : <button
                            onClick={ResetthePassword} className="verify-btn">Reset Password</button>
                    }
                </div>
            </div>
        </PageWrapper>
    )
}

export default ResetPassword
