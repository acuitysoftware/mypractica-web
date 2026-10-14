import React, { useContext, useEffect, useState } from 'react';
import './styles.scss';
import ChangePassword from './changepassword/ChangePassword';
import Dashboard from './dashboard/Dashboard';
import ExamResult from './examresult/ExamResult';
import MyProfile from './myprofile/MyProfile';
import MySchedule from './myschedule/MySchedule';
import Subscription from './subscription/Subscription';
import { useAuth } from '../../context/authContext';
import { getStudentProfile } from '../../api/student';
import { CiMenuKebab } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const StudentProfile = ({ pageRef }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigateTo = useNavigate();
  const [mprof, setmprof] = useState(false);

  const studentNavs = [
    {
      name: 'Dashboard',
      to: <Dashboard />,
    },
    {
      name: 'Home',
      to: '/home',
      page: true,
    },
    {
      name: 'Exam',
      to: '/exam',
      page: true,
    },
    {
      name: 'My Profile',
      to: <MyProfile />,
    },
    {
      name: 'My Schedule',
      to: <MySchedule />,
    },
    {
      name: 'Exam Result',
      to: <ExamResult />,
    },
    {
      name: 'Subscription',
      to: <Subscription />,
    },
    {
      name: 'Change Password',
      to: <ChangePassword />,
    },
  ];
  const studentProfile = async () => {
    try {
      const res = await getStudentProfile();
      console.log(res);
      setProfile(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    studentProfile();
  }, []);
  const [selectedNav, setSelectedNav] = useState(studentNavs[0].to);
  return (
    <div className="student-profile" ref={pageRef}>
      <div className="sider">
        <div className="head">
          <img src={profile?.image_path} alt="" />
          <p>{profile?.name}</p>
          <div className="menu-butt-k">
            <CiMenuKebab className="menu-k" onClick={() => setmprof(!mprof)} />
          </div>
          {mprof ? (
            <div className="sider-nav-m">
              {studentNavs?.map((st) => (
                <p
                  onClick={() => {
                    if (st.page === true) {
                      navigateTo(st?.to);
                    } else {
                      setSelectedNav(st?.to);
                      setmprof(false);
                    }
                  }}
                >
                  {st?.name}
                </p>
              ))}
              <p onClick={() => logout()}>Logout</p>
            </div>
          ) : null}
        </div>
        <div className="sider-nav">
          {studentNavs?.map((st) => (
            <p
              onClick={() => {
                if (st.page === true) {
                  navigateTo(st?.to);
                  scrollTo(0, 0);
                } else {
                  setSelectedNav(st?.to);
                }
              }}
            >
              {st?.name}
            </p>
          ))}
          <p onClick={() => logout()}>Logout</p>
        </div>
      </div>
      <div className="body-new">{selectedNav}</div>
    </div>
  );
};

export default StudentProfile;
