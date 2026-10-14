import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import ExamCard from '../../components/examcard/ExamCard';
import { fetchcourselist, getExamList } from '../../api/exams';
import Loader from '../../common/loader/Loader';
import { fetchBanners } from '../../api/cms';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const Exam = () => {
  const [courses, setCourses] = useState(null);
  const [exam, setExam] = useState(null);
  const [examId, setExamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const [cid, setCId] = useState('');

  const swiperRef = useRef(null);

  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      const el = swiperRef.current;
      if (el) {
        setCanScroll(el.scrollWidth > el.clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [courses]);

  const scroll = (direction) => {
    const el = swiperRef.current;
    if (el) {
      const scrollAmount = 300;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getBanners = async () => {
    try {
      const res = await fetchBanners('exam');
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
  const fetchCourses = async () => {
    try {
      const res = await fetchcourselist();
      console.log(res);
      setCourses(res);
    } catch (error) {}
  };
  const fetchExam = async () => {
    setIsLoading(true);
    try {
      const res = await getExamList(examId);
      console.log(res);
      setExam(res?.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const getExamsByCategory = (id) => {
    setExamId(id);
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    fetchExam();
  }, [examId]);
  return (
    <>
      {isLoading ? <Loader /> : null}
      <PageWrapper head={bannertext} Img={bannerimg}>
        <div className="exam-page">
          <div className="swiper-wrapper">
            {canScroll && (
              <button className="arrow left" onClick={() => scroll('left')}>
                <BiChevronLeft size={20} />
              </button>
            )}
            <div className="swipper" ref={swiperRef}>
              {courses?.map((course) => (
                <div
                  className={
                    course?.id === cid ? 'category-select' : 'category'
                  }
                  key={course?.id}
                  onClick={() => {
                    getExamsByCategory(course?.id), setCId(course?.id);
                  }}
                >
                  <p>{course?.name}</p>
                </div>
              ))}
            </div>
            {canScroll && (
              <button className="arrow right" onClick={() => scroll('right')}>
                <BiChevronRight size={20} />
              </button>
            )}
          </div>
          <div className="exam-row">
            {exam?.map((exm) => (
              <ExamCard key={exm?.id} exm={exm} />
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Exam;
