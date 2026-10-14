import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import PageWrapper from "../../common/pagewrapper/PageWrapper";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  fetchQuizDetails,
  fetchQuizQuestions,
  fetchSeriesDetails,
  fetchSeriesQuestions,
  QuizQuestionsSubmit,
  SeriesQuestionsSubmit,
} from "../../api/exams";
import { useAuth } from "../../context/authContext";
import qimg from "../../assets/quizimg.png";
import ico from "../../assets/ico-practica.png";
import CountDown from "../../components/countdown/CountDown";
import Loader from "../../common/loader/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SeriesSummary from "./SeriesSummary";

const Series = () => {
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
  const [extraTimeUsed, setExtraTimeUsed] = useState(0);
  const answerDataRef = useRef([]);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const setid = searchParams.get("seriesid");
  console.log(qdetail);
  console.log(setid, "setid");
  const [createsummary, setCreateSummary] = useState({
    exam_name: "",
    no_of_questions: "",
    answered_questions: "",
    not_answered_question: "",
    not_visited: "",
  });
  const getSeriesDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchSeriesDetails(quizid, setid);
      if (res?.status === false) {
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

  const onOptionClick = (optKey, ans) => {
    setAnswers((prev) => ({
      ...prev,
      [qquestions.id]: optKey, // store "A", "B", etc.
    }));

    setAnswerData((prev) => {
      let found = false;
      const updated = prev.map((item) => {
        if (item.question_id === qquestions.id) {
          found = true;
          return { ...item, answered: ans };
        }
        return item;
      });
      const finalData = found
        ? updated
        : [...updated, { question_id: qquestions.id, answered: ans }];
      answerDataRef.current = finalData;
      return finalData;
    });
  };

  const getSeriesQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetchSeriesQuestions(
        quizid,
        setid ? setid : null,
        offset,
      );
      setQuestions(res?.data);
      console.log(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(answerdata);

  const nextQuestionandSubmit = async () => {
    setOffset(offset + 1);
    setAnswers((prev) => ({
      ...prev,
      [qquestions?.question]: options,
    }));
  };

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

  const submitQuizQuestions = async () => {
    try {
      setLoading(true);
      const data = {
        exam_id: qdetail?.data?.exam_id,
        exam_series_id: quizid,
        series_set_id: setid,
        answer_data: answerDataRef.current,
        start_date: date,
        start_time: time,
        extra_time: extraTimeUsed,
      };
      console.log(data);
      const res = await SeriesQuestionsSubmit(data);
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
      console.log(error);
    }
  };

  useEffect(() => {
    setCreateSummary({
      exam_name: qdetail?.data?.chapter_name,
      no_of_questions: qdetail?.data?.questions_count,
      answered_questions: answerdata?.length,
      not_answered_question:
        qdetail?.data?.questions_count - answerdata?.length,
      not_visited: qdetail?.data?.questions_count - (offset + 1),
    });
  }, [answerdata]);
  useEffect(() => {
    answerDataRef.current = answerdata;
  }, [answerdata]);

  useEffect(() => {
    getSeriesDetails();
  }, []);
  useEffect(() => {
    getSeriesQuestions();
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
        <SeriesSummary
          startit={startit}
          setStartit={setStartit}
          setSummaryOpen={setSummaryOpen}
          quizsummary={createsummary}
        />
      ) : null}
      <PageWrapper head={"Exam"}>
        {falsedata ? (
          <div className="quizes-false">
            <h3>{falsedata}</h3>
          </div>
        ) : (
          <div className="quizes">
            <div className="head-of-quiz">
              <div className="content">
                <div className="q-name">
                  <img src={ico} alt="" />
                  <h2>{qdetail?.data?.chapter_name}</h2>
                </div>
                <div className="enroll-updt">
                  <p>3778.9k+ Students Enrolled</p>
                  <p>{new Date(qdetail?.data?.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <img src={qimg} alt="" />
            </div>
            <div className="quiz-box">
              {qquestions ? (
                <div className="quiz-box-wrapper">
                  <div className="sec1">
                    <p>{qdetail?.data?.set_name}</p>
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
                      <button
                        disabled={timeup ? true : false}
                        onClick={submitQuizQuestions}
                      >
                        Submit Quiz
                      </button>
                      {timeup ? (
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

                  <div className="quiz-questions">
                    <p>
                      Question {offset + 1} of{" "}
                      {qdetail?.data?.questions_count}{" "}
                    </p>
                    <div className="question-sec">
                      <p className="question">{qquestions?.question} </p>
                      {qquestions?.question_image_path ||
                      qquestions?.question_image_path?.length === 0 ? (
                        <div className="img">
                          <img src={qquestions?.question_image_path} alt="" />
                        </div>
                      ) : null}
                    </div>

                    <div className="options">
                      <div
                        className={
                          answers[qquestions?.id] === "A"
                            ? "option-select"
                            : "option"
                        }
                        onClick={() => onOptionClick("A", "A")}
                      >
                        <span>1</span>
                        {qquestions?.option_a_image_path && (
                          <div className="img">
                            <img
                              src={qquestions?.option_a_image_path}
                              alt="Option A"
                            />
                          </div>
                        )}
                        {qquestions?.option_a && (
                          <div className="opt-q">{qquestions?.option_a}</div>
                        )}
                      </div>

                      <div
                        className={
                          answers[qquestions?.id] === "B"
                            ? "option-select"
                            : "option"
                        }
                        onClick={() => onOptionClick("B", "B")}
                      >
                        <span>2</span>
                        {qquestions?.option_b_image_path && (
                          <div className="img">
                            <img
                              src={qquestions?.option_b_image_path}
                              alt="Option B"
                            />
                          </div>
                        )}
                        {qquestions?.option_b && (
                          <div className="opt-q">{qquestions?.option_b}</div>
                        )}
                      </div>

                      <div
                        className={
                          answers[qquestions?.id] === "C"
                            ? "option-select"
                            : "option"
                        }
                        onClick={() => onOptionClick("C", "C")}
                      >
                        <span>3</span>
                        {qquestions?.option_c_image_path && (
                          <div className="img">
                            <img
                              src={qquestions?.option_c_image_path}
                              alt="Option C"
                            />
                          </div>
                        )}
                        {qquestions?.option_c && (
                          <div className="opt-q">{qquestions?.option_c}</div>
                        )}
                      </div>

                      <div
                        className={
                          answers[qquestions?.id] === "D"
                            ? "option-select"
                            : "option"
                        }
                        onClick={() => onOptionClick("D", "D")}
                      >
                        <span>4</span>
                        {qquestions?.option_d_image_path && (
                          <div className="img">
                            <img
                              src={qquestions?.option_d_image_path}
                              alt="Option D"
                            />
                          </div>
                        )}
                        {qquestions?.option_d && (
                          <div className="opt-q">{qquestions?.option_d}</div>
                        )}
                      </div>
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
                          offset === qdetail?.data?.questions_count - 1
                            ? true
                            : false
                        }
                        className="next"
                        onClick={nextQuestionandSubmit}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <h2 style={{ padding: "40px 0px", textAlign: "center" }}>
                  Questions Will Be Updated soon
                </h2>
              )}
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
};

export default Series;
