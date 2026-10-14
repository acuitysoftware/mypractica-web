import React, { useEffect, useState } from 'react'
import "./styles.scss"
import { BsBarChartFill } from 'react-icons/bs'
import { getStudentDashboard, getStudentSubs } from '../../../api/student'

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null)
    const [subs, setSubs] = useState(null)
    const getDashBoard = async () => {
        try {
            const res = await getStudentDashboard();
            console.log(res)
            setDashboard(res?.data)
        } catch (error) {

        }
    }
    const getSubs = async () => {
        try {
            const res = await getStudentSubs();
            console.log(res)
            setSubs(res?.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getDashBoard()
    }, [])
    useEffect(() => {
        getSubs()
    }, [])
    return (
        <div className='dashboard-student'>
            <h2 className='d-head'>Dashboard</h2>
            <div className="track-records">
                <div className="record">
                    <h2 className='counts'>{dashboard?.total_test_subscribe}</h2>
                    <BsBarChartFill className='bar-chart' />
                    <h2 className='tests'>TOTAL TESTS SUBSCRIBE</h2>
                </div>
                <div className="record">
                    <h2 className='counts'>{dashboard?.total_test_attempted}</h2>
                    <BsBarChartFill className='bar-chart' />
                    <h2 className='tests'>TOTAL TESTS ATTEMPTED</h2>
                </div>
                <div className="record">
                    <h2 className='counts'>{dashboard?.average_score}</h2>
                    <BsBarChartFill className='bar-chart' />
                    <h2 className='tests'>AVERAGE SCORE OF ATTEMPTED EXAMS</h2>
                </div>
            </div>
            <div className="subscriptions">
                {
                    subs?.map((s) => (
                        <div className="subscrip">
                            <div className="h">
                                <span>{s?.exam_name}</span>
                            </div>
                            <div className="money">
                                <h1>₹ {s?.price}</h1>
                            </div>
                            <div className="butt">
                                <button>Subscribed</button>
                            </div>
                        </div>
                    ))
                }


            </div>
        </div>
    )
}

export default Dashboard
