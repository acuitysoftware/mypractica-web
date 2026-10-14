import React from 'react'
import "./styles.scss"
import banner from "../../assets/home-banner.png"
import { Link, useNavigate } from 'react-router-dom'
import { BsArrowRightShort } from 'react-icons/bs'

const ExamCard = ({ exm }) => {
    const NavigateTo = useNavigate()
    return (
        <div className="exam-card">
            <img onClick={() => {
                scrollTo(0, 0);
                NavigateTo(`/examdetails/${exm?.id}`)
            }} src={exm?.image_path} alt="" />
            <p onClick={() => {
                scrollTo(0, 0);
                NavigateTo(`/examdetails/${exm?.id}`)
            }} className="exm-name">
                {exm?.name}
            </p>
            <Link onClick={() => scrollTo(0, 0)} to={`/examdetails/${exm?.id}`} className='know-details'>Know Details <BsArrowRightShort className="ico" /> </Link>

        </div>
    )
}

export default ExamCard
