import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import PageWrapper from "../../common/pagewrapper/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuizDetails,
  fetchQuizQuestions,
  QuizQuestionsSubmit,
} from "../../api/exams";
import { useAuth } from "../../context/authContext";
import qimg from "../../assets/quizimg.png";
import ico from "../../assets/ico-practica.png";
import CountDown from "../../components/countdown/CountDown";
import Loader from "../../common/loader/Loader";
import Swal from "sweetalert2";
import QuizSummary from "./QuizSummary";
import toast from "react-hot-toast";

const Quizes = () => {
  const quizid = useParams().id;
  const [offset, setOffset] = useState(0);
  const timerRef = useRef(null);
  const hasInitialTimerScroll = useRef(false);
  const [qdetail, setQDetail] = useState(null);
  const [qquestions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOption] = useState("");
  const { token } = useAuth();
  const [answers, setAnswers] = useState({});
  const [answerdata, setAnswerData] = useState([]);
  const [quizSummary, setQuizSummary] = useState(null);
  const [summaryopen, setSummaryOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeup, setTimeUp] = useState(false);
  const [startit, setStartit] = useState(false);
  const [falsedata, setFalseData] = useState("");
  const navigateTo = useNavigate();
  const [startExtraTime, setStartExtraTime] = useState(false);
  const [extraTimeUp, setExtraTimeUp] = useState(false);
  const [extraTimeUsed, setExtraTimeUsed] = useState(0);

  const [createsummary, setCreateSummary] = useState({
    exam_name: "",
    no_of_questions: "",
    answered_questions: "",
    not_answered_question: "",
    not_visited: "",
  });

  const getQuizDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchQuizDetails(quizid);
      if (res.status === false) {
        setLoading(false);
        setFalseData(res?.message);
      } else {
        setQDetail(res);
        setLoading(false);
        setCreateSummary({
          exam_name: res?.data?.name,
          no_of_questions: res?.data?.questions_count,
          answered_questions: answerdata?.length,
          not_answered_question:
            res?.data?.questions_count - answerdata?.length,
          not_visited: res?.data?.questions_count - (offset + 1),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onOptionClick = async (optKey) => {
    setAnswers((prev) => ({
      ...prev,
      [qquestions.id]: optKey, // store 'A', 'B', etc.
    }));

    await setAnswerData((prev) => {
      let found = false;
      const updated = prev.map((item) => {
        if (item.question_id === qquestions.id) {
          found = true;
          return { ...item, answered: optKey };
        }
        return item;
      });
      return found
        ? updated
        : [...updated, { question_id: qquestions.id, answered: optKey }];
    });
  };

  const getQuizQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetchQuizQuestions(quizid, offset);
      setQuestions(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(qquestions);

  console.log(answerdata);
  const data = {
    exam_id: qdetail?.data?.exam_id,
    exam_quizze_id: quizid,
    answer_data: answerdata,
    start_date: date,
    start_time: time,
    extra_time: extraTimeUsed,
  };

  console.log(extraTimeUsed);
  console.log(data);

  const nans = qdetail?.data?.questions_count - answerdata?.length;

  useEffect(() => {
    setCreateSummary({
      exam_name: qdetail?.data?.name,
      no_of_questions: qdetail?.data?.questions_count,
      answered_questions: answerdata?.length,
      not_answered_question:
        qdetail?.data?.questions_count - answerdata?.length,
      not_visited: qdetail?.data?.questions_count - (offset + 1),
    });
  }, [answerdata]);
  console.log(qdetail?.data?.questions_count - answerdata?.length);
  const nextQuestionandSubmit = async () => {
    setOffset(offset + 1);
    await setAnswers((prev) => ({
      ...prev,
      [qquestions?.question]: options,
    }));
  };

  console.log(createsummary, "Summary");
  console.log(answers);
  const submitQuizQuestions = async () => {
    try {
      setLoading(true);
      const res = await QuizQuestionsSubmit(data);
      if (res?.status === false) {
        await Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: "error",
        });
        setLoading(false);
      } else {
        await Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: "success",
        });
        setLoading(false);
        setQuizSummary(res?.data);
        setSummaryOpen(true);
        navigateTo(`/exam-result/${res?.data?.result_id}`);
      }
      console.log(res);
    } catch (error) {
      await Swal.fire({
        title: "Something Went Wrong",
        timer: 2000,
        icon: "error",
      });
      setLoading(false);
    }
  };

  console.log(quizSummary);
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-CA");
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setDate(formattedDate);
    setTime(formattedTime);
  }, []);
  const dates = qdetail?.data?.updated_at;
  const updtDate = new Date(dates);
  const formatted = updtDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  useEffect(() => {
    if (extraTimeUp) {
      submitQuizQuestions();
    }
  }, [extraTimeUp]);

  useEffect(() => {
    getQuizDetails();
  }, []);
  useEffect(() => {
    getQuizQuestions();
  }, [offset]);

  useEffect(() => {
    if (!qquestions || !timerRef.current || hasInitialTimerScroll.current)
      return;

    const timer = window.setTimeout(() => {
      const timer = timerRef.current;
      if (!timer) return;
      hasInitialTimerScroll.current = true;
      const top = timer.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - 16), behavior: "auto" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [qquestions]);

  return (
    <>
      {loading ? <Loader /> : null}
      {summaryopen ? (
        <QuizSummary
          setStartit={setStartit}
          setSummaryOpen={setSummaryOpen}
          quizsummary={createsummary}
        />
      ) : null}
      <PageWrapper head={"Exam"}>
        {falsedata ? (
          <div className="quizes-false">
            <h3>{falsedata}</h3>{" "}
          </div>
        ) : (
          <div className="quizes">
            <div className="head-of-quiz">
              <div className="content">
                <div className="q-name">
                  <img src={ico} alt="" />
                  <h2>{qdetail?.data?.name}</h2>
                </div>
                <div className="enroll-updt">
                  <p>3778.9k+ Students Enrolled</p>
                  <p>Last Updated on {formatted}</p>
                </div>
              </div>
              <img src={qimg} alt="" />
            </div>
            <div className="quiz-box">
              <div className="quiz-box-wrapper">
                <div className="sec1">
                  <p>{qdetail?.data?.name}</p>
                  <div className="time" ref={timerRef}>
                    {qdetail && !timeup && (
                      <CountDown
                        total_time={qdetail?.data?.total_time}
                        extra_time={qdetail?.data?.exter_time}
                        startit={startit}
                        setStartit={setStartit}
                        summaryopen={summaryopen}
                        setSummaryOpen={setSummaryOpen}
                        setExtraTimeUsed={setExtraTimeUsed}
                        onComplete={() => {
                          setTimeUp(true);
                          submitQuizQuestions(); // only gets called once after main+extra
                        }}
                      />
                    )}
                  </div>

                  <div>
                    {/* <button
                      disabled={timeup ? true : false}
                      onClick={submitQuizQuestions}
                    >
                      Submit Quiz
                    </button> */}
                  </div>
                </div>
                {qquestions ? (
                  <div className="quiz-questions">
                    <p>
                      Question {offset + 1} of{" "}
                      {qdetail?.data?.no_of_questions}{" "}
                    </p>
                    <div className="q-sec">
                      <p className="question">
                        {offset + 1}. {qquestions?.question}{" "}
                      </p>
                      {qquestions?.question_image_path ||
                      qquestions?.question_image_path?.length === 0 ? (
                        <div className="img">
                          <img src={qquestions?.question_image_path} alt="" />
                        </div>
                      ) : null}
                    </div>

                    <div className="options">
                      {["A", "B", "C", "D"].map((opt, index) => {
                        const optionText =
                          qquestions[`option_${opt.toLowerCase()}`];
                        const optionImage =
                          qquestions[`option_${opt.toLowerCase()}_image_path`];
                        const isSelected = answers[qquestions?.id] === opt;

                        return (
                          <div
                            key={opt}
                            className={isSelected ? "option-select" : "option"}
                            onClick={() => onOptionClick(opt)}
                          >
                            <span>{index + 1}</span>

                            {/* Show image if available */}
                            {optionImage && (
                              <div className="img">
                                <img src={optionImage} alt={`Option ${opt}`} />
                              </div>
                            )}

                            {/* Show text only if it's not null */}
                            {optionText ? (
                              <div className="opt-q">{optionText}</div>
                            ) : (
                              <div className="opt-q" style={{ opacity: 0.5 }}>
                                (Image Only)
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pagination">
                      <button
                        disabled={offset === 0 ? true : false}
                        className="prev"
                        onClick={() => setOffset(offset - 1)}
                      >
                        Previous
                      </button>
                      <button
                        disabled={
                          offset === qdetail?.data?.no_of_questions - 1
                            ? true
                            : false
                        }
                        className="next"
                        onClick={nextQuestionandSubmit}
                      >
                        Next
                      </button>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "end",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <button
                        disabled={timeup ? true : false}
                        onClick={submitQuizQuestions}
                        style={{
                          width: 120,
                          outline: "none",
                          border: "none",
                          padding: "12px 0px",
                          background: "#53c46b",
                          color: "#fff",
                          borderRadius: "5px",
                        }}
                      >
                        Submit Quiz
                      </button>
                      {!timeup ? (
                        <p
                          onClick={() => window.location.reload()}
                          style={{
                            fontSize: 12,
                            color: "red",
                            cursor: "pointer",
                          }}
                        >
                          {" "}
                          Apply Again ??
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <h2 style={{ padding: "40px 0px", textAlign: "center" }}>
                    Questions Will Be Updated soon
                  </h2>
                )}
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
};

export default Quizes;
