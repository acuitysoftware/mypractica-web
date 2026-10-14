import React, { useEffect, useState } from 'react'
import "./styles.scss"
import { GoChevronDown } from "react-icons/go";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SlCalender } from 'react-icons/sl';
import { TeacherBookedSchedule, TeacherScheduleReject } from '../../../api/teachers';
import ConfirmStudent from './confirmStudent';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../common/loader/Loader';


const MySession = () => {
    const [fromdate, setFromDate] = useState('')
    const [todate, setToDate] = useState('')
    const [offset, setOffset] = useState(1)
    const [statusdrp, setStatusDrp] = useState(false)
    const [statusid, setStatusId] = useState('')
    const [schedules, setSchedules] = useState(null)
    const [loading, setLoading] = useState(false)
    const [acceptStudent, setAcceptStudent] = useState({
    })
    const navigateTo = useNavigate()
    const [opensc, setOpenSc] = useState(false)
    const [search, setSearch] = useState(false)
    const [statusshown, setStatusShown] = useState('')


    const bookedSchedule = async () => {
        try {
            setLoading(true)
            const res = await TeacherBookedSchedule("", "", "", offset);
            console.log(res)
            setSchedules(res?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }


    const getFilteredData = async () => {
        const res = await TeacherBookedSchedule(fromdate, todate, statusid, offset);
        console.log(res)
        setSchedules(res?.data)

    }

    const RejectStudent = async (e) => {
        try {
            const res = await TeacherScheduleReject(e);
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
                setStatusDrp(false)
            }
        } catch (error) {

        }
    }
    const status = [
        {
            id: 0,
            name: "Pending"
        },
        {
            id: 1,
            name: "Accepted"
        },
        {
            id: 2,
            name: "Rejected"
        },
        {
            id: 3,
            name: "Completed"
        }
    ]
    console.log(offset)

    useEffect(() => {
        bookedSchedule()
    }, [offset])
    return (
        <>
            {loading ? <Loader /> : null}
            {opensc ? <ConfirmStudent acceptStudent={acceptStudent} setOpenSc={setOpenSc} /> : null}
            <div className='my-sessions'>
                <h2>Create your Available Session Time</h2>
                <div className="filters">
                    <div className="status" onClick={() => setStatusDrp(!statusdrp)}>
                        <input type="text" readOnly placeholder='Select Status' value={statusshown} />
                        <GoChevronDown className='down' />
                        {
                            statusdrp ? <div className="stat">
                                {
                                    status?.map((s) => (
                                        <span onClick={() => {
                                            setStatusId(s?.id)
                                            setStatusDrp(false)
                                            setStatusShown(s?.name)
                                        }}>{s?.name}</span>
                                    ))
                                }
                            </div> : null
                        }
                    </div>
                    <div className="dates">
                        <DatePicker selected={fromdate}
                            onChange={(date) => setFromDate(date)} placeholderText="From Date" />
                        <SlCalender />
                    </div>
                    <div className="dates">
                        <DatePicker selected={todate}
                            onChange={(date) => setToDate(date)} placeholderText="To Date" />
                        <SlCalender />
                    </div>
                    <button className='search-button' onClick={getFilteredData}>Search</button>
                </div>
                <div className="request-sessions">
                    <h2>Request Session</h2>
                    <div className="lists">
                        {
                            !schedules || schedules?.length === 0 ? <h3>No Sessions to show</h3> :
                                schedules?.map((sc) => (
                                    <div className="session">
                                        <div className="student-info">
                                            <img src={sc?.student?.image_path} alt="" />
                                            <h3>{sc?.student?.name}</h3>
                                        </div>
                                        <div className="time">
                                            <h3>Time</h3>
                                            <p>{sc?.time}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Date</h3>
                                            <p>{sc?.date}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Joining Platform</h3>
                                            <p>{sc?.platform_name || "Not Provided Yet"}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Action</h3>
                                            {
                                                sc?.current_status === "Pending" ?
                                                    <div className="action-butts">
                                                        <button
                                                            className='act'
                                                            onClick={() => {
                                                                setAcceptStudent({
                                                                    id: sc?.id,
                                                                    img: sc?.student?.image_path,
                                                                    name: sc?.student?.name,
                                                                    time: sc?.time,
                                                                    date: sc?.date
                                                                })
                                                                setOpenSc(true)
                                                            }}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button className='rej'
                                                            onClick={() => RejectStudent(sc?.id)}
                                                        >Reject</button>
                                                    </div> : null
                                            }
                                            {
                                                sc?.current_status === "Acceppted" ? <button className='act' onClick={() => window.open(sc?.link, '_blank')}>Join</button> : null
                                            }
                                            {
                                                sc?.current_status === "Rejected" ? <button className='rejctd'>Rejected</button> : null
                                            }
                                            {
                                                sc?.current_status === "Completed" ? <button className='complt'>Completed</button> : null
                                            }

                                        </div>
                                    </div>
                                ))
                        }


                    </div>
                </div>
                <div className="pg-butts">
                    <button disabled={offset === 1} onClick={() => setOffset(offset - 1)}>Previous</button>
                    <button disabled={schedules?.length === 0} onClick={() => setOffset(offset + 1)}>Next</button>
                </div>
            </div>
        </>
    )
}

export default MySession
