import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import logo from "../../assets/logo-practica.png";
import fb from "../../assets/fb.png";
import insta from "../../assets/insta.png";
import yt from "../../assets/yt.png";
import { HiOutlineMenu } from "react-icons/hi";
import Menu from "./Menu";
import { useAuth } from "../../context/authContext";
import { fetchSiteSettings, fetchSocialLinks } from "../../api/cms";
import { IoMdLogOut } from "react-icons/io";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [ham, setHam] = useState(false);
  const { user, logout } = useAuth();
  const navigateTo = useNavigate();
  const location = useLocation();

  const [setting, setSetting] = useState(null);
  const logoutUser = async () => {
    await logout();
    await Swal.fire({
      title: "Logged Out Successfully",
      icon: "success",
      timer: 1500,
    });
    navigateTo("/sign-in");
  };
  const siteSettings = async () => {
    try {
      const res = await fetchSiteSettings();
      console.log(res);
      setSetting(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    siteSettings();
  }, []);

  const [socials, setSocials] = useState(null);
  const socialLinks = async () => {
    try {
      const res = await fetchSocialLinks();
      console.log(res);
      setSocials(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    socialLinks();
  }, []);

  return (
    <>
      {ham ? <Menu setHam={setHam} /> : null}
      <div className="header">
        <div className="upper-header">
          <div className="left-side">
            {/* <div className="elms">
              <BiSolidPhoneCall className="ico" />
              <a
                style={{ textDecoration: "none", color: "white", fontSize: 13 }}
                href={`tel: ${setting?.phone}`}
              >
                {setting?.phone}
              </a>
            </div> */}
            <div className="elms">
              <IoMdMail className="ico" />
              <a
                style={{ textDecoration: "none", color: "white", fontSize: 13 }}
                href={`mailto: ${setting?.email}`}
              >
                {setting?.email}
              </a>
            </div>
          </div>
          <div className="right-side">
            <div className="socials">
              {socials?.map((e) => (
                <a href={e?.link}>
                  <i
                    className={`fab ${e.icon}`}
                    style={{
                      color: e.color,
                      background: "#fff",
                      borderRadius: "50%",
                      fontSize: 20,
                    }}
                  ></i>
                </a>
              ))}
            </div>
            {user ? (
              <div className="log-butt">
                <Link to={"/profile"} className="loginbutton">
                  <FaUser className="ico" />
                  {user?.data?.name}
                </Link>
                <div className="log-out-butt">
                  <button onClick={() => logoutUser()}>
                    <IoMdLogOut className="ico" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="log-butt">
                <button
                  className="loginbutton"
                  onClick={() => {
                    if (location.pathname === "/sign-in") {
                      window.scrollTo({
                        top: 700,
                        behavior: "smooth",
                      });
                    } else {
                      navigateTo("/sign-in");
                    }
                  }}
                >
                  <FaUser className="ico" />
                  LOGIN
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="lower-header">
          <Link to={"/"} className="logo-link">
            <img src={setting?.logo_path} alt="" />
          </Link>
          <div className="links">
            {user ? (
              <Link to={"/profile"} className="link">
                My Dashboard
              </Link>
            ) : null}
            <Link to={"/"} className="link">
              Home
            </Link>
            <Link to={"/exam"} className="link">
              Exam
            </Link>
            <Link to={"/contact-us"} className="link">
              Contact Us
            </Link>
          </div>
          <div className="link-ham">
            <HiOutlineMenu className="ham" onClick={() => setHam(true)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
