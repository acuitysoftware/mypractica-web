import React, { useEffect, useState } from 'react'
import "./styles.scss"
import ico from "../../../assets/ico-practica.png"
import { getStudentAllResult } from '../../../api/student'
import { useNavigate } from 'react-router-dom'
import ExamResultDetail from './ExamResultDetail'
import Loader from '../../../common/loader/Loader'


const ExamResult = () => {
    const [allresults, setAllResults] = useState(null)
    const [openresultView, setOpenResultView] = useState(false)
    const [resultId, setResultId] = useState(false)
    const [searchName, setSearchName] = useState('')
    const [from_date, setFrom_date] = useState('')
    const [loading, setLoading] = useState(false)
    const [to_date, setTo_date] = useState('')
    const [offset, setOffset] = useState(1)
    const getAllResults = async () => {
        setLoading(true)
        try {
            const res = await getStudentAllResult(searchName, from_date, to_date, 5, offset);
            console.log(res)
            setAllResults(res?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const navigateTo = useNavigate()
    const rawDate = "2025-04-16T06:11:41.000000Z";
    const date = new Date(rawDate);

    const formatted = date.toLocaleString(); // e.g. "4/16/2025, 6:11:41 AM"
    console.log(formatted);

    useEffect(() => {
        getAllResults()
    }, [searchName, from_date, to_date, offset])
    return (
        <>
            {loading ? <Loader /> : null}
            {
                openresultView ? <ExamResultDetail setOpenResultView={setOpenResultView} resultId={resultId} /> : <div className='exam-result'>
                    <h2>Exam Result</h2>
                    {
                        allresults?.length === 0 ? null : <div className="inputs">
                            <div className="input">
                                <input type="text" placeholder='Search' onChange={(e) => setSearchName(e.target.value)} />
                            </div>
                            <div className="input">
                                <input type="date" placeholder='Start Date' onChange={(e) => setFrom_date(e.target.value)} />

                            </div>
                            <div className="input">
                                <input type="date" placeholder='End Date' onChange={(e) => setTo_date(e.target.value)} />
                            </div>
                        </div>
                    }

                    <div className="results-shown">

                        {
                            !allresults || allresults?.length === 0 ? <h3>No Exams to show</h3> :
                                allresults?.map((r) => (
                                    <div className="result-head-box">
                                        <div className="left">
                                            <div className="content">
                                                <div className="q-name">
                                                    <img src={ico} alt="" />
                                                    <h2>{r?.name}</h2>

                                                </div>
                                                <div className="enroll-updt">
                                                    <p>3778.9k+ Students Enrolled</p>
                                                    <p>{new Date(r?.last_update).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="butt-r">
                                            <button onClick={() => {
                                                setResultId(r?.id)
                                                setOpenResultView(true)
                                            }
                                            }>View Result</button>
                                        </div>
                                    </div>
                                ))
                        }


                    </div>
                    <div className="pg-butts">
                        <button disabled={offset === 1} onClick={() => setOffset(offset - 1)}>Previous</button>
                        <button disabled={allresults?.length === 0} onClick={() => setOffset(offset + 1)}>Next</button>
                    </div>
                </div>
            }

        </>
    )
}

export default ExamResult
