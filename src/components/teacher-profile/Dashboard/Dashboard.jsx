import React, { useEffect, useState } from 'react'
import { getTeacherDashboard, TeacherBookedSchedule, TeacherScheduleReject } from '../../../api/teachers'
import { BsBarChartFill } from 'react-icons/bs'
import "./styles.scss"
import Swal from 'sweetalert2'
import ConfirmStudent from '../my-session/confirmStudent'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null)
    const [subs, setSubs] = useState(null)
    const [fromdate, setFromDate] = useState('')
    const [todate, setToDate] = useState('')
    const [statusdrp, setStatusDrp] = useState(false)
    const [statusid, setStatusId] = useState('')
    const [schedules, setSchedules] = useState(null)
    const [acceptStudent, setAcceptStudent] = useState({
    })
    const navigateTo = useNavigate()
    const [opensc, setOpenSc] = useState(false)
    const [search, setSearch] = useState(false)
    const [statusshown, setStatusShown] = useState('')


    const bookedSchedule = async () => {
        try {
            const res = await TeacherBookedSchedule("", "", 0);
            console.log(res)
            setSchedules(res?.data)
        } catch (error) {

        }
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

    useEffect(() => {
        bookedSchedule()
    }, [])
    const getDashBoard = async () => {
        try {
            const res = await getTeacherDashboard();
            console.log(res)
            setDashboard(res?.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        getDashBoard()
    }, [])


    return (
        <>
            {opensc ? <ConfirmStudent acceptStudent={acceptStudent} setOpenSc={setOpenSc} /> : null}
            <div className='dashboard-teacher'>
                <h2 className='d-head'>Dashboard</h2>
                <div className="track-records">
                    <div className="record">
                        <h2 className='counts'>{dashboard?.total_request_view}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>TOTAL REQUEST VIEWED</h2>
                    </div>
                    <div className="record">
                        <h2 className='counts'>{dashboard?.total_request_accept}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>TOTAL ACCEPTED </h2>
                    </div>
                    <div className="record">
                        <h2 className='counts'>{dashboard?.total_hours}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>TOTAL HOURS</h2>
                    </div>
                    <div className="record">
                        <h2 className='counts'>{dashboard?.total_sessions}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>TOTAL SESSIONS</h2>
                    </div>
                    <div className="record">
                        <h2 className='counts'>{dashboard?.total_payment_received}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>TOTAL PAYMENT RECIEVED</h2>
                    </div>
                    <div className="record">
                        <h2 className='counts'>{dashboard?.balance_payment}</h2>
                        <BsBarChartFill className='bar-chart' />
                        <h2 className='tests'>BALANCE PAYMENT</h2>
                    </div>
                </div>
                <div className="sessions">
                    <h2>Requested Session</h2>
                    <div className="lists">
                        {
                            schedules?.length === 0 ? <p> No Requested sessions for now</p> :
                                schedules?.map((sc) => (
                                    <div className="session">
                                        <div className="student-info">
                                            <img src={sc?.student?.image_path} alt="" />
                                            <h3>{sc?.student?.name}</h3>
                                        </div>
                                        <div className="time">
                                            <h3>Subject</h3>
                                            <p>{sc?.subject_name}</p>
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
            </div>
        </>
    )
}

export default Dashboard
