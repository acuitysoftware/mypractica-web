import React, { useEffect, useState } from 'react';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import { fetchBanners, fetchCMS } from '../../api/cms';
import './styles.scss';

const AboutUs = () => {
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const [cmstext, setCMSText] = useState('');
  const getBanners = async () => {
    try {
      const res = await fetchBanners('about-us');
      console.log(res);
      setBannerImg(res?.data?.image_path);
      setBannerText(res?.data?.banner_text);
    } catch (error) {
      console.log(error);
    }
  };
  const getCms = async () => {
    try {
      const res = await fetchCMS('about-us');
      setCMSText(res?.data);
      console.log(res);
    } catch (error) {}
  };
  useEffect(() => {
    getBanners();
  }, []);
  useEffect(() => {
    getCms();
  }, []);
  return (
    <PageWrapper head={bannertext} Img={bannerimg}>
      <div className="cms-extr">
        {cmstext?.image_1_path && <img src={cmstext?.image_1_path} alt="" />}
        <h1>{cmstext?.title}</h1>
        <p>{cmstext?.title_2}</p>
        <div dangerouslySetInnerHTML={{ __html: cmstext?.description }}></div>
      </div>
    </PageWrapper>
  );
};

export default AboutUs;
