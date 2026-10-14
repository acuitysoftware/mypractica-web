import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import StudentProfile from '../../components/student-profile/StudentProfile';
import TeacherProfile from '../../components/teacher-profile/TeacherProfile';
import { fetchBanners } from '../../api/cms';

const Profile = () => {
  const { user, logout } = useAuth();
  console.log(user);
  const navigateTo = useNavigate();
  const [bannerimg, setBannerImg] = useState(null);
  const [bannerimgT, setBannerImgT] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const [bannertextT, setBannerTextT] = useState(null);
  const getBanners = async () => {
    try {
      const res = await fetchBanners('my-account');
      console.log(res);
      setBannerImg(res?.data?.image_path);
      setBannerText(res?.data?.banner_text);
    } catch (error) {
      console.log(error);
    }
  };
  const getBannersTearcher = async () => {
    try {
      const res = await fetchBanners('my-account-teacher');
      console.log(res);
      setBannerImgT(res?.data?.image_path);
      setBannerTextT(res?.data?.banner_text);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);
  useEffect(() => {
    getBannersTearcher();
  }, []);
  const logoutUser = async () => {
    await logout();
    await Swal.fire({
      title: 'Logged Out Successfully',
      icon: 'success',
      timer: 1500,
    });
    navigateTo('/sign-in');
  };
  const pageScroll = useRef();
  const scrollToSectioninitial = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToSectioninitial(pageScroll);
  }, []);
  return (
    <PageWrapper
      Img={user?.data?.role_name === 'STUDENT' ? bannerimg : bannerimgT}
      head={user?.data?.role_name === 'STUDENT' ? bannertext : bannertextT}
    >
      {user?.data?.role_name === 'STUDENT' ? (
        <StudentProfile pageRef={pageScroll} />
      ) : (
        <TeacherProfile pageRef={pageScroll} />
      )}
    </PageWrapper>
  );
};

export default Profile;
