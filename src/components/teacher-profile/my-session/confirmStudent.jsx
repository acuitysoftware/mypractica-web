import React, { useState } from 'react'
import { TeacherScheduleAccept } from '../../../api/teachers'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const ConfirmStudent = ({ acceptStudent, setOpenSc }) => {
    const [pname, setPname] = useState('')
    const [plink, setPlink] = useState('')
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    const acceptStudentRequest = async () => {
        try {
            if (!plink && !pname) {
                toast.error("PLease Provide Platform name and PLatform link")
            }
            else if (!isValidUrl(plink)) {
                toast.error("Please Provide valid link")
            }
            else {
                const res = await TeacherScheduleAccept(acceptStudent?.id, pname, plink);
                if (res?.status === false) {
                    Swal.fire({
                        title: res?.message,
                        icon: "error",
                        timer: 2000
                    })
                } else {
                    await Swal.fire({
                        title: res?.message,
                        icon: "success",
                        timer: 2000
                    })
                    setOpenSc(false)
                    window.location.reload()
                }
            }


        } catch (error) {

        }
    }
    return (
        <div className='confirmstudent'>
            <div className="confirm-student-box">
                <img src={acceptStudent?.img} alt="" />
                <p><b>Name:</b>{acceptStudent?.name}</p>
                <p><b>Time:</b>{acceptStudent?.time}</p>
                <p><b>Date:</b>{acceptStudent?.date}</p>
                <input type="text" placeholder='Platform name' onChange={(e) => setPname(e.target.value)} />
                <input type="text" placeholder='Link' onChange={(e) => setPlink(e.target.value)} />
                <p style={{ color: "red", fontSize: 10 }}>*please provide only meeting link</p>
                <div className="buts">
                    <button onClick={acceptStudentRequest}>Submit</button>
                    <button onClick={() => setOpenSc(false)}>Cancel</button>
                </div>

            </div>
        </div>
    )
}

export default ConfirmStudent
