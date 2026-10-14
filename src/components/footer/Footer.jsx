import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import logo from "../../assets/logo-practica.png";
import fb from "../../assets/fb.png";
import insta from "../../assets/insta.png";
import yt from "../../assets/yt.png";
import { fetchSiteSettings, fetchSocialLinks } from "../../api/cms";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getPopularExamList } from "../../api/exams";

const Footer = () => {
  const [setting, setSetting] = useState(null);
  const [exam, setExam] = useState(null);
  const getExams = async () => {
    try {
      const res = await getPopularExamList();
      console.log(res.data);
      setExam(res.data);
    } catch (error) {}
  };
  useEffect(() => getExams(), []);
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
    <div className="footer">
      <div className="sec">
        <div className="logo">
          <img src={setting?.logo_path} alt="" />
        </div>
        <p>{setting?.footer_text}</p>

        <div className="socials">
          {socials?.map((e) => (
            <a href={e?.link}>
              <i className={`fab ${e.icon}`} style={{ color: e.color }}></i>
            </a>
          ))}
        </div>
      </div>
      <div className="sec">
        <h2>Link</h2>
        <div className="links">
          <Link className="link" onClick={() => scrollTo(0, 0)} to={"/home"}>
            <FaAngleRight onClick={() => scrollTo(0, 0)} className="ico" />
            Home
          </Link>
          <Link className="link" onClick={() => scrollTo(0, 0)} to={"/exam"}>
            <FaAngleRight className="ico" />
            Exam
          </Link>
          <Link
            className="link"
            to={"/contact-us"}
            onClick={() => scrollTo(0, 0)}
          >
            <FaAngleRight className="ico" to={"contact-us"} />
            Contact Us
          </Link>
          <Link
            className="link"
            to={"/about-us"}
            onClick={() => scrollTo(0, 0)}
          >
            <FaAngleRight className="ico" to={"about-us"} />
            About Us
          </Link>
          <Link className="link" to={"/terms"} onClick={() => scrollTo(0, 0)}>
            <FaAngleRight className="ico" to={"terms"} />
            Terms & Conditions
          </Link>
          <Link className="link" to={"/privacy"} onClick={() => scrollTo(0, 0)}>
            <FaAngleRight className="ico" to={"privacy"} />
            Privacy Policy
          </Link>
          <Link
            className="link"
            to={"/delete-account"}
            onClick={() => scrollTo(0, 0)}
          >
            <FaAngleRight className="ico" to={"privacy"} />
            Delete Account{" "}
          </Link>
        </div>
      </div>
      <div className="sec">
        <h2>Popular Exam</h2>
        <div className="links">
          {exam?.map((e) => (
            <Link
              className="link"
              onClick={() => scrollTo(0, 0)}
              to={`examdetails/${e.id}`}
            >
              <FaAngleRight className="ico" />
              {e?.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="sec">
        <h2>Contacts</h2>
        <a className="link" href={`mailto: ${setting?.email}`}>
          <GoMail className="ico" />
          {setting?.email}
        </a>
      </div>
    </div>
  );
};

export default Footer;
