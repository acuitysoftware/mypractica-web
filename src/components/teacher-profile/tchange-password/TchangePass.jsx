import React, { useState } from 'react'
import "./styles.scss"
import { changePasswordAuth } from '../../../api/auth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const TchangePass = () => {
    const [old_password, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [pconfirm, setpconfirm] = useState(false)
    const [password_confirmation, setPassword_confirmation] = useState('')
    const changePassword = async (e) => {
        e.preventDefault()
        try {
            const data = {
                old_password: old_password,
                password: password,
                password_confirmation: password_confirmation
            }
            if (!old_password && !password && !password_confirmation) {
                toast.success("PLease fill up the form")
            }

            else {
                const res = await changePasswordAuth(data);
                if (res.status === false) {
                    Swal.fire({
                        title: res.message,
                        icon: "error",
                        timer: 2000
                    })
                } else {
                    Swal.fire({
                        title: res.message,
                        icon: "success",
                        timer: 2000
                    })
                }
            }

        } catch (error) {
            Swal.fire({
                title: "Something Went Wrong",
                icon: "error",
                timer: 2000
            })
        }
    }
    return (
        <div className='change-password'>
            <h2>Change Password</h2>
            <form className="full-form">
                <div className="form">
                    <div className="form-input">
                        <label>Old Password</label>
                        <input type="password" onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <label>New Password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <label>Confirm NewPassword</label>
                        <input type="password" onChange={(e) => {
                            setPassword_confirmation(e.target.value)

                        }} />
                        {pconfirm ? <p style={{ fontSize: 12, color: "red" }}>Password Doesnot Match !!</p> : null}
                    </div>
                </div>
                <button className='but' onClick={changePassword}>Change Password</button>
            </form>
        </div>
    )
}

export default TchangePass
