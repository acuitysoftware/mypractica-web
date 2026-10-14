import React, { useEffect, useState } from 'react';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import './styles.scss';
import { availableTeachersDetail, schedulePurchase } from '../../api/teachers';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../common/loader/Loader';
import { fetchBanners, fetchSiteSettings } from '../../api/cms';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';

const TeacherSchedule = () => {
  const { id } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const date = query.get('date');
  const [schedule_t, setSchedule_t] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const [scid, setScid] = useState('');
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('');
  const [key, setKey] = useState('');
  const navigateTo = useNavigate();
  const { user } = useAuth();
  const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const [confirm_schedule, setConfirm_Schedule] = useState(false);
  const schedule = async () => {
    try {
      setLoading(true);
      const res = await availableTeachersDetail(id, date);
      console.log(res);
      setSchedule_t(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchKeys = async () => {
    const res = await fetchSiteSettings();
    setKey(res?.data);
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error('Failed to load Razorpay SDK.');
      return;
    }
    try {
      const options = {
        key: key?.razor_pay_key,
        amount: amount * 100,
        currency: 'INR',
        name: 'My Practica',
        description: 'Teachers Schedule Purchase',
        handler: async function (response) {
          const { razorpay_payment_id } = response;
          const data = {
            schedule_id: scid,
            transaction_id: razorpay_payment_id,
            date: date,
            topic: topic,
          };
          try {
            setLoading(true);
            const res = await schedulePurchase(data);
            if (res?.status === false) {
              setLoading(false);
              await Swal.fire({
                title: res?.message,
                icon: 'error',
                timer: 1500,
              });
            } else {
              setLoading(false);
              await Swal.fire({
                title: res?.message,
                icon: 'success',
              });
              console.log(res);
              navigateTo('/profile');
            }
          } catch (error) {
            setLoading(false);
            await Swal.fire({
              title: 'Something Went Wrong',
              icon: 'error',
              timer: 1500,
            });
            console.log(error);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Order creation error', error);
      toast.error('Error while creating Razorpay order.');
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
    schedule();
  }, []);
  useEffect(() => {
    fetchKeys();
  }, []);
  return (
    <>
      {loading ? <Loader /> : null}
      <PageWrapper head={bannertext} Img={bannerimg}>
        <div className="sc-teacher">
          <h1 className="head-av-teacher">Available Teachers</h1>
          {schedule_t?.status === false ? (
            <p
              style={{
                textAlign: 'center',
                marginTop: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 30,
              }}
            >
              Sorry No Sessions available on this date
              <Link
                to={'/available-teachers'}
                style={{
                  textDecoration: 'none',
                  padding: '10px 20px',
                  background: '#6565E2',
                  color: 'white',
                  borderRadius: '5px',
                }}
              >
                Go Back
              </Link>
            </p>
          ) : confirm_schedule ? null : (
            <div className="schedule-box">
              <div className="contents-sc">
                <div className="left">
                  <div className="teacher-info">
                    <img src={schedule_t?.data?.image_path} alt="" />
                    <div className="techer-info-contents">
                      <p className="hd">{schedule_t?.data?.name}</p>
                      <p className="qualify">({schedule_t?.data?.education})</p>
                      <p className="subs">{schedule_t?.data?.subject}</p>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <h3>
                    {day} ({schedule_t?.date})
                  </h3>
                  <div className="schedule-tags">
                    {schedule_t?.schedules?.map((s) => (
                      <button
                        disabled={s?.is_available === true ? false : true}
                        onClick={() => {
                          setAmount(s.amount);
                          setScid(s.id);
                          setTime(s.time);
                        }}
                        className={s.id === scid ? 'tag-select' : 'tag'}
                      >
                        {s?.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="input-topic">
                <h3>Enter Your Topic</h3>
                <textarea
                  onChange={(e) => setTopic(e.target.value)}
                  name=""
                  id=""
                  cols={20}
                  rows={6}
                ></textarea>
              </div>
              <button
                className="sch"
                onClick={() => {
                  if ((!amount, !scid)) {
                    toast.error('Please Select a schedule');
                  } else {
                    setConfirm_Schedule(true);
                  }
                }}
              >
                Schedule
              </button>
            </div>
          )}

          {confirm_schedule ? (
            <div className="pay-the-sc-teacher">
              <div className="teacher-info">
                <img src={schedule_t?.data?.image_path} alt="" />
                <div className="techer-info-contents">
                  <p className="hd">{schedule_t?.data?.name}</p>
                  <p className="qualify">({schedule_t?.data?.education})</p>
                  <p className="subs">{schedule_t?.data?.subject}</p>
                </div>
              </div>
              <div className="time">
                <h3>Time</h3>
                <p>{time}</p>
              </div>
              <div className="time">
                <h3>Date</h3>
                <p>{date}</p>
              </div>
              <div className="time">
                <h3>Day</h3>
                <p>{day}</p>
              </div>
              <div className="time amount">
                <h3>Amount</h3>
                <p>₹ {amount}</p>
                <button onClick={handlePayment} className="pay-now">
                  Pay Now
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </PageWrapper>
    </>
  );
};

export default TeacherSchedule;
