import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import TProfile from './tprofile/TProfile';
import MySession from './my-session/MySession';
import TimeSchedule from './time-schedule/TimeSchedule';
import TchangePass from './tchange-password/TchangePass';
import { getTeacherProfile } from '../../api/teachers';
import './styles.scss';
import { useAuth } from '../../context/authContext';
import { CiMenuKebab } from 'react-icons/ci';

const TeacherProfile = ({ pageRef }) => {
  const [profile, setProfile] = useState(null);
  const [mprof, setmprof] = useState(false);
  const { logout } = useAuth();
  const teacherNavs = [
    {
      name: 'Dashboard',
      to: <Dashboard />,
    },
    {
      name: 'My Profile',
      to: <TProfile />,
    },
    {
      name: 'Time Schedule',
      to: <TimeSchedule />,
    },
    {
      name: 'My Session',
      to: <MySession />,
    },
    {
      name: 'Change Password',
      to: <TchangePass />,
    },
  ];
  const [selectedNav, setSelectedNav] = useState(teacherNavs[0].to);
  const studentProfile = async () => {
    try {
      const res = await getTeacherProfile();
      console.log(res);
      setProfile(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    studentProfile();
  }, []);
  return (
    <div className="teacher-profile" ref={pageRef}>
      <div className="sider">
        <div className="head">
          <img src={profile?.image_path} alt="" />
          <p>{profile?.name}</p>
          <div className="menu-butt-k">
            <CiMenuKebab className="menu-k" onClick={() => setmprof(!mprof)} />
          </div>
          {mprof ? (
            <div className="sider-nav-m">
              {teacherNavs?.map((st) => (
                <p
                  onClick={() => {
                    setSelectedNav(st?.to);
                    setmprof(false);
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
          {teacherNavs?.map((st) => (
            <p onClick={() => setSelectedNav(st?.to)}>{st?.name}</p>
          ))}
          <p onClick={() => logout()}>Logout</p>
        </div>
      </div>
      <div className="body-new">{selectedNav}</div>
    </div>
  );
};

export default TeacherProfile;
