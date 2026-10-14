import React, { useEffect, useState } from 'react'
import { BiSolidPhoneCall } from 'react-icons/bi'
import { IoMdMail } from 'react-icons/io'
import yt from "../../assets/yt.png"
import fb from "../../assets/fb.png"
import insta from "../../assets/insta.png"
import { Link } from 'react-router-dom'
import { RxCross1 } from 'react-icons/rx'
import { fetchSiteSettings, fetchSocialLinks } from '../../api/cms'

const Menu = ({ setHam }) => {
    const [setting, setSetting] = useState(null)
    const siteSettings = async () => {
        try {
            const res = await fetchSiteSettings()
            console.log(res)
            setSetting(res?.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        siteSettings()
    }, [])

    const [socials, setSocials] = useState(null)
    const socialLinks = async () => {
        try {
            const res = await fetchSocialLinks()
            console.log(res)
            setSocials(res?.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        socialLinks()
    }, [])
    return (
        <div className='menu'>
            <RxCross1 className='cross' onClick={() => setHam(false)} />
            <Link className='link' onClick={() => {
                setHam(false)
                scrollTo(0, 0)
            }} to={"/"}>Home</Link>
            <Link className='link' onClick={() => {
                setHam(false)
                scrollTo(0, 0)
            }} to={"/exam"}>Exam</Link>
            <Link className='link' onClick={() => {
                setHam(false)
                scrollTo(0, 0)
            }} to={"/contact-us"}>Contact Us</Link>
            <div className="socials">
                {
                    socials?.map((e) => (
                        <a href={e?.link}><i className={`fab ${e.icon}`} style={{ color: e.color, background: "#fff", borderRadius: "50%", fontSize: 20 }}></i></a>
                    ))
                }
            </div>
            <div className="elms">
                <BiSolidPhoneCall className='ico' />
                <a style={{ textDecoration: "none", color: "black", fontSize: 14 }} href={`tel: ${setting?.phone}`}>{setting?.phone}</a>
            </div>
            <div className="elms">
                <IoMdMail className='ico' />
                <a style={{ textDecoration: "none", color: "black", fontSize: 14 }} href={`tel: ${setting?.email}`}>{setting?.email}</a>
            </div>
        </div>
    )
}

export default Menu
