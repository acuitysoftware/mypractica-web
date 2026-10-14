import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.scss";
import PageWrapper from "../../common/pagewrapper/PageWrapper";
import coach from "../../assets/coach-exm.png";
import { GoQuestion } from "react-icons/go";
import { IoNewspaperOutline, IoTimeOutline } from "react-icons/io5";
import { BsLightningCharge } from "react-icons/bs";
import ico from "../../assets/ico-practica.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchSubscriptionList, getExamDetails } from "../../api/exams";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";
import PurchaseExam from "../../components/puchaseExam/PurchaseExam";
import { getStudentSubs } from "../../api/student";
import Loader from "../../common/loader/Loader";
import { fetchBanners } from "../../api/cms";

const ExamDetails = () => {
  const overviewRef = useRef(null);
  const coachingRef = useRef(null);
  const testSeriesRef = useRef(null);
  const quizzesRef = useRef(null);
  const infoRef = useRef(null);
  const papersRef = useRef(null);
  const pageScroll = useRef(null);

  const { id } = useParams();
  const [exm_details, setExm_Details] = useState(null);
  const navigateTo = useNavigate();
  const { user, logout } = useAuth();
  const [exam_p, setExam_P] = useState(null);
  const [exams, setExams] = useState(null);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [exm_select, setExm_Select] = useState(null);
  const [mysubs, setMySubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollToSectioninitial = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToSection = (id) => {
    const ref = sectionRefs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannerText] = useState(null);
  const getBanners = async () => {
    try {
      const res = await fetchBanners("exam");
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
  const fetchStudentSubscriptions = async () => {
    try {
      const res = await getStudentSubs();
      setMySubs(res?.data);
    } catch (error) {}
  };
  const fetchSubscription = async () => {
    try {
      if (!mysubs || !exm_details) return;

      const myExamNames = new Set(mysubs.map((sub) => sub.exam_name));
      const res = await fetchSubscriptionList();

      const filtered_data = res?.data?.filter(
        (exam) => !myExamNames.has(exam.exam_name),
      );

      setExams(filtered_data);

      setExam_P(
        res?.data?.find((e) => e.exam_name === exm_details?.exam?.name),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const examDetails = async () => {
    try {
      setLoading(true);
      const response = await getExamDetails(id);
      setExm_Details(response?.data);
      setLoading(false);
    } catch (error) {}
  };
  const sectionRefs = useMemo(() => {
    const refs = {};
    exm_details?.tabs?.forEach((tab) => {
      refs[tab.tab_id] = React.createRef();
    });
    return refs;
  }, [exm_details?.tabs]);

  console.log(exm_details);
  console.log(exam_p);
  console.log(user);
  useEffect(() => {
    examDetails();
  }, []);
  useEffect(() => {
    scrollToSectioninitial(pageScroll);
  }, [exm_details?.tabs]);
  useEffect(() => {
    fetchStudentSubscriptions();
  }, []);
  useEffect(() => {
    if (mysubs && exm_details) {
      fetchSubscription();
    }
  }, [mysubs, exm_details]);

  return (
    <>
      {loading ? <Loader /> : null}
      {purchaseModal ? (
        <PurchaseExam
          setPurchaseModal={setPurchaseModal}
          exam={exams}
          price={exam_p?.price}
          exm_select={exm_select}
          desc={exm_details?.subscription?.description}
        />
      ) : null}
      <PageWrapper head={exm_details?.exam?.name} dynamictitle Img={bannerimg}>
        <div className="exam-details-box">
          {/* <div className="details-nav" ref={pageScroll}>
                        <span onClick={() => scrollToSection(overviewRef)}>Overview</span>
                        <span onClick={() => scrollToSection(coachingRef)}>Super Coaching</span>
                        <span onClick={() => scrollToSection(testSeriesRef)}>Test Series</span>
                        <span onClick={() => scrollToSection(quizzesRef)}>Quizzes</span>
                        <span onClick={() => scrollToSection(infoRef)}>Exam Info</span>
                        <span onClick={() => scrollToSection(papersRef)}>Prev. Papers</span>
                    </div> */}
          <div className="details-nav" ref={pageScroll}>
            {exm_details?.tabs?.map((tab) => (
              <span
                key={tab.tab_id}
                onClick={() => scrollToSection(tab.tab_id)}
              >
                {tab.tab_name}
              </span>
            ))}
          </div>
          <div className="overview" ref={sectionRefs["overview"]}>
            <div
              className="overview-text"
              dangerouslySetInnerHTML={{
                __html: exm_details?.exam?.description,
              }}
            ></div>
            <div className="overview-boxes">
              <h3>{exm_details?.exam?.name} Overview</h3>
              <div className="over-cards">
                <div className="card-over">
                  <p className="head">Total Exams</p>
                  <p className="texts series-names">
                    <p>
                      Total Exam Series -{" "}
                      {Math.abs(
                        exm_details?.exam?.free_series_count -
                          exm_details?.exam?.paid_series_count,
                      )}
                    </p>
                    <p>
                      Total Free Series - {exm_details?.exam?.free_series_count}
                    </p>
                    <p>
                      Total Paid Series - {exm_details?.exam?.paid_series_count}
                    </p>
                    <p>
                      Total Free Quizes - {exm_details?.exam?.free_quize_count}
                    </p>
                    <p>
                      Total Paid Quizes - {exm_details?.exam?.paid_quize_count}
                    </p>
                  </p>
                </div>
                <div className="card-over">
                  <p className="head">Exam Date</p>
                  <div
                    className="texts"
                    dangerouslySetInnerHTML={{
                      __html: exm_details?.exam?.exam_date,
                    }}
                  ></div>
                </div>
                <div className="card-over">
                  <p className="head">Eligibility</p>
                  <p className="texts">
                    {exm_details?.exam?.eligibility
                      ? exm_details?.exam?.eligibility
                      : "None"}
                  </p>
                </div>
                <div className="card-over">
                  <p className="head">Official Notification</p>
                  <p className="texts">
                    <a
                      href={exm_details?.exam?.exam_document_path}
                      download={true}
                    >
                      Download Pdf
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {!user || user?.data?.role_name === "TEACHER" || !exam_p ? null : (
            <div className="super-coaching" ref={sectionRefs["super-coaching"]}>
              <div className="left">
                <img src={exm_details?.exam?.image_path} alt="" />
              </div>
              <div className="right">
                <div className="head">
                  <h1>{exam_p?.exam_name}</h1>
                </div>

                <p className="subtext">
                  {exm_details?.subscription?.offer_text}
                </p>
                <div className="pricing">
                  <p className="price-total">₹3999</p>
                  <p className="price-offer">₹{exam_p?.price}</p>
                </div>
                {3999 - exam_p?.price < 0 ? null : (
                  <div className="totalsave">
                    <p> 🎁 Your Total Savings ₹{3999 - exam_p?.price}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setPurchaseModal(true);
                    setExm_Select(exam_p?.id);
                  }}
                  className="purchase-now"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          )}

          <div className="test-series" ref={sectionRefs["series"]}>
            <div className="free-test-series">
              <h2>{exm_details?.exam?.name} Free Test </h2>
              <div className="free-test-cards">
                {exm_details?.free_series?.length === 0 ? (
                  <p>No Free Test are available</p>
                ) : (
                  exm_details?.free_series?.map((e) => (
                    <div className="free-test-card">
                      <p className="head">
                        <span>{e.chapter_name}</span>
                        <span className="users">
                          {" "}
                          <BsLightningCharge
                            style={{ color: "#FF9500" }}
                          />{" "}
                          138.7k Users
                        </span>
                      </p>
                      <div className="q-details">
                        <p>
                          <GoQuestion />
                          {e.series_sets?.length} tests
                        </p>
                        {/* <p>
                          <IoNewspaperOutline />
                          {e.total_marks} Marks
                        </p> */}
                        <p>
                          <IoTimeOutline />
                          {e.total_time} Mins
                        </p>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: e?.Languages }}
                        className="p-two"
                      ></div>
                      <div
                        className="chap-list"
                        dangerouslySetInnerHTML={{ __html: e?.description }}
                      ></div>
                      <button className="free">Free</button>
                      <div className="set-names">
                        {e?.series_sets?.map((s) => {
                          // Combine date and time string into a single ISO-like format
                          const startDateTimeString = `${s.start_date}T${s.start_time}`;
                          const startDateTime = new Date(startDateTimeString);
                          const now = new Date();
                          console.log(startDateTimeString);
                          console.log(now);

                          const hasStarted = now >= startDateTime;

                          return (
                            <div className="set" key={s.id}>
                              <p>Exam Set : {s.set_name}</p>
                              {hasStarted ? (
                                <button
                                  className="start-now"
                                  onClick={async () => {
                                    if (user) {
                                      navigateTo(
                                        `/series/${e.id}?seriesid=${s.id}`,
                                      );
                                    } else {
                                      await Swal.fire({
                                        title: "Please Login First",
                                        timer: 1500,
                                        icon: "error",
                                      });
                                      navigateTo("/sign-in");
                                    }
                                  }}
                                >
                                  Start Now
                                </button>
                              ) : (
                                <p style={{ color: "#888" }}>
                                  Start in {s.start_date} at {s.start_time}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="paid-series">
              <h2>{exm_details?.exam?.name} Test Series</h2>

              <div className="paid-series-cards">
                {exm_details?.paid_series?.length === 0 ? (
                  <p>No Paid Test Series Available</p>
                ) : (
                  exm_details?.paid_series?.map((e) => (
                    <div className="paid-series-card">
                      <div className="head">
                        <div className="upper">
                          <img src={ico} alt="" />
                          <span className="users">
                            {" "}
                            <BsLightningCharge
                              style={{ color: "#FF9500" }}
                            />{" "}
                            138.7k Users
                          </span>
                        </div>
                        <p className="lower">{e.chapter_name}</p>
                      </div>

                      <div
                        dangerouslySetInnerHTML={{ __html: e?.Languages }}
                        className="p-two"
                      ></div>
                      <div
                        className="chap-list"
                        dangerouslySetInnerHTML={{ __html: e?.description }}
                      ></div>
                      {exams?.find(
                        (e) => e.exam_name === exm_details?.exam?.name,
                      ) ? (
                        <button
                          onClick={() => {
                            setPurchaseModal(true);
                            setExm_Select(exam_p?.id);
                          }}
                        >
                          View Test Series
                        </button>
                      ) : (
                        <button
                          className="start-now"
                          onClick={async () => {
                            if (user) {
                              navigateTo(`/series/${e.id}`);
                            } else {
                              await Swal.fire({
                                title: "Please Login First",
                                timer: 1500,
                                icon: "error",
                              });
                              navigateTo("/sign-in");
                            }
                          }}
                        >
                          Start Now
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* QUIZ SECTION */}
          <div className="quiz" ref={sectionRefs["quizze"]}>
            <h2>{exm_details?.exam?.name} Latest Quizzes</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: exm_details?.exam?.quizze_description,
              }}
            ></div>
            <h3>{exm_details?.exam?.name} Free Quizzes</h3>
            <div className="quiz-cards">
              {exm_details?.free_quize?.length === 0 ? (
                <p>Sorry No Free Quizes</p>
              ) : (
                exm_details?.free_quize?.map((e) => (
                  <div className="quiz-card">
                    <h3>{e.name}</h3>
                    {/* <span className="exm-tag">
                      <IoNewspaperOutline />
                      SSC CHSL
                    </span> */}
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#34C759",
                        color: "#fff",
                        borderRadius: 6,
                        marginLeft: 20,
                      }}
                    >
                      Free
                    </span>
                    <p className="expires">
                      Expires in:{" "}
                      <span>
                        {e.expiry_date
                          ? `${e.expiry_date} Days`
                          : "Not Provided"}
                      </span>
                    </p>
                    <div className="ques">
                      <p>Questions</p>
                      <p>{e.no_of_questions}</p>
                    </div>
                    <div className="total">
                      <p>Total Time</p>
                      <p>{e.total_time} mins</p>
                    </div>
                    <div className="butt">
                      <button
                        onClick={async () => {
                          if (user) {
                            navigateTo(`/quizes/${e.id}`);
                          } else {
                            await Swal.fire({
                              title: "Please Login First",
                              timer: 1500,
                              icon: "error",
                            });
                            navigateTo("/sign-in");
                          }
                        }}
                        className="button"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <h3>{exm_details?.exam?.name} Paid Quizzes</h3>
            <div className="quiz-cards">
              {exm_details?.paid_quize?.length === 0 ? (
                <p>No Paid Quiz available</p>
              ) : (
                exm_details?.paid_quize?.map((e) => (
                  <div className="quiz-card">
                    <h3>{e.name}</h3>
                    {/* <span className="exm-tag">
                      <IoNewspaperOutline />
                      SSC CHSL
                    </span> */}
                    {exams?.find(
                      (e) => e.exam_name === exm_details?.exam?.name,
                    ) ? (
                      <span
                        style={{
                          padding: "4px 8px",
                          background: "#FF3B30",
                          color: "#fff",
                          borderRadius: 6,
                        }}
                      >
                        Paid
                      </span>
                    ) : null}

                    <p className="expires">
                      Expires in:{" "}
                      <span>
                        {e.expiry_date
                          ? `${e.expiry_date} Days`
                          : "Not Provided"}
                      </span>
                    </p>
                    <div className="ques">
                      <p>Questions</p>
                      <p>{e.no_of_questions}</p>
                    </div>
                    <div className="total">
                      <p>Total Time</p>
                      <p>{e.total_time} mins</p>
                    </div>
                    <div className="butt">
                      {exams?.find(
                        (e) => e.exam_name === exm_details?.exam?.name,
                      ) ? (
                        <button
                          onClick={() => {
                            setPurchaseModal(true);
                            setExm_Select(exam_p?.id);
                          }}
                        >
                          Buy Exam fot Quiz
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (user) {
                              navigateTo(`/quizes/${e.id}`);
                            } else {
                              await Swal.fire({
                                title: "Please Login First",
                                timer: 1500,
                                icon: "error",
                              });
                              navigateTo("/sign-in");
                            }
                          }}
                          className="button"
                        >
                          Start Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* examinfo */}
          <div className="exam-info" ref={sectionRefs["exam-info"]}>
            <h2>{exm_details?.exam?.name} Exam Info</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: exm_details?.exam?.exam_info,
              }}
            ></div>
            {exm_details?.exam?.exam_document_path ? (
              <a download href={exm_details?.exam?.exam_document_path}>
                Download PDF
              </a>
            ) : null}
          </div>
          {/* prev-paper */}
          <div className="prev-paper" ref={sectionRefs["previous-paper"]}>
            <h2>{exm_details?.exam?.name} Exam Prev. Paper</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: exm_details?.exam?.previous_paper_description,
              }}
            ></div>
            <div className="prev-paper-cards">
              {exm_details?.previous_paper?.map((e) => (
                <div className="prev-card">
                  <h3>{e.name}</h3>
                  {e.file_path ? (
                    <a download href={e.file_path}>
                      Download PDF
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default ExamDetails;
