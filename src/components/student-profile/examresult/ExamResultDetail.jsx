import React, { useEffect, useState } from 'react';
import qimg from '../../../assets/quizimg.png';
import ico from '../../../assets/ico-practica.png';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { getStudentResult } from '../../../api/student';
import { useNavigate } from 'react-router-dom';

const ExamResultDetail = ({ resultId, setOpenResultView }) => {
  const [result, setResult] = useState(null);
  const navigateTo = useNavigate();
  const getResults = async () => {
    try {
      const res = await getStudentResult(resultId);
      setResult(res?.data);
      console.log(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getResults();
  }, []);
  return (
    <div className="result-page">
      <div className="head-of-quiz">
        <div className="content">
          <div className="q-name">
            <img src={ico} alt="" />
            <h2>{result?.name}</h2>
          </div>
          <div className="enroll-updt">
            <p>3778.9k+ Students Enrolled</p>
            <p>
              Last Updated on {new Date(result?.last_update).toLocaleString()}
            </p>
            <p>{result?.set_name}</p>
          </div>
        </div>
        <img src={qimg} alt="" />
      </div>
      <div className="result-box">
        <h2>Result</h2>
        <div className="qdetails">
          <h3>Number of Questions: {result?.no_of_questions}</h3>
          <h3>Questions Attempted: {result?.answered_question}</h3>
          <h3>Correct Answers: {result?.correct_anwsers_count}</h3>
          <h3>Time Taken: {result?.time_taken}</h3>
        </div>
        <div className="q-ans">
          {result?.questions?.map((que, index) => (
            <div className="ques" key={index}>
              {/* Serial Number + Question */}
              <div className="question-block">
                <p className="q">
                  <strong>Q {index + 1}.</strong>{' '}
                  {que?.question ? (
                    que?.question
                  ) : que?.question_image_path ? (
                    <div className="q-img">
                      <img
                        src={que?.question_image_path}
                        alt={`Question ${index + 1}`}
                      />
                    </div>
                  ) : (
                    <span style={{ color: 'gray' }}>Question unavailable</span>
                  )}
                </p>
              </div>

              {/* Wrong Answer Section */}
              {que?.answered === que?.correct_answer ? null : (
                <div className="wrong-ans">
                  <div className="ans-text">
                    {que?.answered ? (
                      <>
                        <span>{que?.answered}</span>

                        {/* show image or text based on answered option */}
                        {(que?.answered === 'A' && que?.option_a_image_path) ||
                        (que?.answered === 'B' && que?.option_b_image_path) ||
                        (que?.answered === 'C' && que?.option_c_image_path) ||
                        (que?.answered === 'D' && que?.option_d_image_path) ? (
                          <div className="img">
                            <img
                              src={
                                (que?.answered === 'A' &&
                                  que?.option_a_image_path) ||
                                (que?.answered === 'B' &&
                                  que?.option_b_image_path) ||
                                (que?.answered === 'C' &&
                                  que?.option_c_image_path) ||
                                (que?.answered === 'D' &&
                                  que?.option_d_image_path)
                              }
                              alt="Selected Option"
                            />
                          </div>
                        ) : (
                          <p>
                            {(que?.answered === 'A' && que?.option_a) ||
                              (que?.answered === 'B' && que?.option_b) ||
                              (que?.answered === 'C' && que?.option_c) ||
                              (que?.answered === 'D' && que?.option_d)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p style={{ color: 'red' }}>Not Answered</p>
                    )}
                  </div>

                  {que?.answered ? (
                    <p className="decision">
                      <RxCross1 /> Wrong Answer
                    </p>
                  ) : null}
                </div>
              )}

              {/* Correct Answer Section */}
              <div className="ans">
                <div className="ans-text">
                  <span>{que?.correct_answer}</span>

                  {/* show correct answer image or text */}
                  {(que?.correct_answer === 'A' && que?.option_a_image_path) ||
                  (que?.correct_answer === 'B' && que?.option_b_image_path) ||
                  (que?.correct_answer === 'C' && que?.option_c_image_path) ||
                  (que?.correct_answer === 'D' && que?.option_d_image_path) ? (
                    <div className="img">
                      <img
                        src={
                          (que?.correct_answer === 'A' &&
                            que?.option_a_image_path) ||
                          (que?.correct_answer === 'B' &&
                            que?.option_b_image_path) ||
                          (que?.correct_answer === 'C' &&
                            que?.option_c_image_path) ||
                          (que?.correct_answer === 'D' &&
                            que?.option_d_image_path)
                        }
                        alt="Correct Option"
                      />
                    </div>
                  ) : (
                    <p>
                      {(que?.correct_answer === 'A' && que?.option_a) ||
                        (que?.correct_answer === 'B' && que?.option_b) ||
                        (que?.correct_answer === 'C' && que?.option_c) ||
                        (que?.correct_answer === 'D' && que?.option_d)}
                    </p>
                  )}
                </div>
                <p className="decision">
                  <IoCheckmarkOutline /> Right Answer
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="butts">
        <button onClick={() => setOpenResultView(false)}>Back</button>
        <button onClick={() => navigateTo('/available-teachers')}>
          Request For Doubt Clearence
        </button>
      </div>
    </div>
  );
};

export default ExamResultDetail;
