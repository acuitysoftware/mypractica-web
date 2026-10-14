import React, { useEffect, useState } from 'react';
import './styles.scss';
import banner from '../../assets/home-banner.png';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import ExamCard from '../../components/examcard/ExamCard';
import playstore from '../../assets/play-store.png';
import applestore from '../../assets/apple-store.png';
import adver from '../../assets/adver.png';
import { getExamList, getPopularExamList } from '../../api/exams';
import Loader from '../../common/loader/Loader';
import { Link } from 'react-router-dom';
import { fetchBanners, fetchCMS, fetchhomesecTeachers } from '../../api/cms';
import { GoPlus } from 'react-icons/go';
import VisitorForm from '../../components/visitorform/VisitorForm';

const Home = () => {
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hometext, setHomeText] = useState('');
  const [appsectext, setAppsecText] = useState('');
  const [bannerimg, setBannerImg] = useState(null);
  const [bannerimg2, setBannerImg2] = useState(null);
  const [applinks, setApplinks] = useState('');
  const [teach, setTech] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const modalShown = sessionStorage.getItem('homepageModalShown');
    if (!modalShown) {
      setShowModal(true);
      sessionStorage.setItem('homepageModalShown', 'true');
    }
  }, []);

  const getExams = async () => {
    setIsLoading(true);
    try {
      const res = await getPopularExamList();
      console.log(res.data);
      setExam(res.data);
      setIsLoading(false);
    } catch (error) {}
  };
  const getCms = async () => {
    try {
      const res = await fetchCMS('home');
      setHomeText(res?.data?.description);
      console.log(res);
    } catch (error) {}
  };

  const getAppCms = async () => {
    try {
      const res = await fetchCMS('app-section');
      setAppsecText(res?.data?.description);
      setBannerImg2(res?.data?.image_1_path);
      setApplinks(res?.data);
      console.log(res);
    } catch (error) {}
  };
  useEffect(() => {
    getAppCms();
  }, []);
  useEffect(() => {
    getCms();
  }, []);
  const getTeachers = async () => {
    try {
      const res = await fetchhomesecTeachers();
      console.log(res);
      setTech(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTeachers();
  }, []);
  const getBanners = async () => {
    try {
      const res = await fetchBanners('home');
      console.log(res);
      setBannerImg(res?.data?.image_path);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);
  useEffect(() => {
    getExams();
  }, []);
  return (
    <>
      {showModal ? <VisitorForm handleClose={setShowModal} /> : null}
      {isLoading ? <Loader /> : null}
      <div className="home">
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div
            className="heading"
            dangerouslySetInnerHTML={{
              __html: hometext,
            }}
          >
            {/* Get <span className="insider">2500+</span> <br /> Best Online
            Courses From myPractica */}
          </div>
          <Link to={'/exam'} className="find-exam-butt">
            Find Exam
            <MdKeyboardDoubleArrowRight className="ico" />
          </Link>
          <div className="teachers-section">
            <p>Teachers</p>
            <div className="teachers">
              <div className="images">
                {teach?.data?.map((e) => (
                  <img src={e?.image_path} alt="" />
                ))}

                <GoPlus className="plus" />
              </div>
              <p className="teacher-count">
                <span>{teach?.teachers_count}</span>
                Teachers
              </p>
            </div>
          </div>
        </div>
        <div className="popular-exams">
          <h2>Popular Exams</h2>
          <div className="exam-row">
            {exam?.map((e) => (
              <ExamCard key={e?.id} exm={e} />
            ))}
          </div>
          <div className="explore-exam-butt">
            <Link className="exlp-butt" to={'/exam'}>
              Explore All Exams
              <MdKeyboardDoubleArrowRight className="ico" />
            </Link>
          </div>
        </div>
        <div
          className="app-adver"
          style={{
            backgroundImage: `url(${bannerimg2})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <h1>{appsectext}</h1>
          <div className="butts">
            <a href={applinks?.description_2}>
              <img src={playstore} alt="" />
            </a>
            <a href={applinks?.description_3}>
              <img src={applestore} alt="" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
