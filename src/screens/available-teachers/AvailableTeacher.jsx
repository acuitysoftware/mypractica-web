import React, { useEffect, useState } from 'react';
import './styles.scss';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import { SlCalender } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { availableTeachersList } from '../../api/teachers';
import Loader from '../../common/loader/Loader';
import toast from 'react-hot-toast';
import { fetchBanners } from '../../api/cms';

const AvailableTeacher = () => {
  const navigateTo = useNavigate();
  const [available_t, setAvailAbleT] = useState(null);
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  const availbleTeachers = async () => {
    setLoading(true);
    try {
      const res = await availableTeachersList();
      setAvailAbleT(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getBanners = async () => {
    try {
      const res = await fetchBanners('teacher-banner');
      console.log(res);
      setBannerImg(res?.data?.image_path);
      setBannerText(res?.data?.banner_text);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);
  useEffect(() => {
    availbleTeachers();
  }, []);
  return (
    <>
      {loading ? <Loader /> : null}
      <PageWrapper head={bannertext} Img={bannerimg}>
        <div className="available-teacher">
          <h1 className="head-av-teacher">Available Teachers</h1>
          <div className="teacher-box-wrapper">
            {available_t?.map((t) => (
              <div className="teacher-av">
                <div className="left">
                  <img src={t.image_path} alt="" />
                </div>
                <div className="right">
                  <h3>{t?.name}</h3>
                  <p>{t?.education}</p>
                  <p className="subs">{t?.subject}</p>
                  <div className="date-wrapper">
                    <input
                      min={formatDate(today)}
                      max={formatDate(oneWeekLater)}
                      onChange={(e) => setDate(e.target.value)}
                      type="date"
                      name=""
                      id=""
                      placeholder="Select Date"
                    />
                    {/* <span className='custom-icon'></span> */}
                    <SlCalender className="custom-icon" />
                  </div>
                  <button
                    onClick={() => {
                      if (!date) {
                        toast.error('Please provide a date');
                      } else {
                        scrollTo(0, 0);
                        navigateTo(`/teacher-schedule/${t?.id}?date=${date}`);
                      }
                    }}
                  >
                    Schedule Your Session
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              navigateTo('/profile');
            }}
            className="backback"
          >
            Go Back
          </button>
        </div>
      </PageWrapper>
    </>
  );
};

export default AvailableTeacher;
