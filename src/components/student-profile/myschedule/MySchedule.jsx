import React, { useEffect, useState } from 'react'
import "./styles.scss"
import { getStudentSchedule } from '../../../api/student'
import Loader from '../../../common/loader/Loader'

const MySchedule = () => {
    const [schedule, setSchedule] = useState(null)
    const [loading, setLoading] = useState(false)
    const userSchedule = async () => {
        try {
            setLoading(true)
            const res = await getStudentSchedule();
            console.log(res?.data)
            setSchedule(res?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    useEffect(() => {
        userSchedule()
    }, [])
    return (
        <>
            {loading ? <Loader /> : null}
            <div className='my-schedule'>
                <h2 className='hd'>Recent Schedule</h2>
                {
                    !schedule || schedule?.length === 0 ? <h3 style={{ marginTop: "40px", textAlign: "center" }}>No Schedules to show</h3> :
                        <div className="table-sch">
                            {
                                schedule?.map((s) => (
                                    <div className="pay-the-sc-teacher">
                                        <div className="teacher-info">
                                            <img src={s?.teacher?.image_path} alt="" />
                                            <div className="techer-info-contents">
                                                <p className='hd'>{s?.teacher?.name}</p>
                                                <p className='qualify'>({s?.teacher?.education})</p>
                                                <p className='subs'>{s?.teacher?.subject}</p>
                                            </div>
                                        </div>
                                        <div className="time">
                                            <h3>Time</h3>
                                            <p>{s?.time}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Date</h3>
                                            <p>{s?.date}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Joining Platform</h3>
                                            <p>{s?.platform_name}</p>
                                        </div>
                                        <div className="time">
                                            <h3>Amount</h3>
                                            <p>₹ {s?.amount}</p>
                                        </div>
                                        <div className="time amount">
                                            <h3>Action</h3>
                                            {
                                                s?.current_status === "Pending" ? <button className='pending'>Pending</button> : s?.current_status === "Acceppted" ? <button className='pay-now' onClick={() => window.open(s?.link, '_blank')}>Join</button> : s?.current_status === "Rejected" ? <button className='reject'>Rejected</button> : <button className='complete'>Completed</button>
                                            }
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                }

            </div>
        </>
    )
}

export default MySchedule
