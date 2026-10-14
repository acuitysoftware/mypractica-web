import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import Login from '../../../components/login/Login';
import Signup from '../../../components/signup/Signup';
import PageWrapper from '../../../common/pagewrapper/PageWrapper';

const Authentication = () => {
  const [logintype, setLoginType] = useState('STUDENT');
  const pageScroll = useRef();
  const scrollToSectioninitial = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToSectioninitial(pageScroll);
  }, []);
  return (
    <PageWrapper>
      <div className="auth-box" ref={pageScroll}>
        <div className="left">
          <Login logintype={logintype} setLoginType={setLoginType} />
        </div>
        <div className="right">
          <Signup logintype={logintype} setLoginType={setLoginType} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Authentication;
