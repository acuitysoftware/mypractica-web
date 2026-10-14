import React, { useEffect, useState } from 'react'
import "./styles.scss"
import { getStudentSubs } from '../../../api/student'
import Loader from '../../../common/loader/Loader'

const Subscription = () => {
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(false)
    const [subs, setSubs] = useState(null)

    const getSubs = async () => {
        try {
            setLoading(true)
            const res = await getStudentSubs();
            console.log(res)
            setSubs(res?.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getSubs()
    }, [])
    return (
        <>
            {loading ? <Loader /> : null}
            <div className="subscriptions">
                {
                    !subs || subs?.length === 0 ? <h3>No Subscriptions yet</h3> :
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
        </>
    )
}

export default Subscription
