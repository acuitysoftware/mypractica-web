import React from 'react'

const QuizSummary = ({ setSummaryOpen, quizsummary, setStartit }) => {
    return (
        <div className='q-sum-wrapper'>
            <div className="quiz-summary">
                <h2 className="quiz-summary__header">Quiz Summary</h2>
                <p className={quizsummary ? "quiz-summary__success-note" : "quiz-summary__fail-note"}>{quizsummary ? "Your Answer have been saved Successfully." : "No Answer have been given"}</p>

                <table class="quiz-summary__table">
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>No. Of Questions</th>
                            <th>Answered</th>
                            <th>Not Answered</th>
                            <th>Not Visited</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{quizsummary?.exam_name}</td>
                            <td>{quizsummary?.no_of_questions}</td>
                            <td>{quizsummary?.answered_questions}</td>
                            <td>{quizsummary?.not_answered_question}</td>
                            <td>{quizsummary?.not_visited}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="quiz-summary__actions">
                    <button class="quiz-summary__bookmark-btn" onClick={() => {
                        setSummaryOpen(false)
                        setStartit(false)
                    }}>Back To Quizzes</button>
                    <button class="quiz-summary__resume-btn" onClick={() => {
                        setSummaryOpen(false)
                        setStartit(true)
                    }
                    }>Resume Quiz</button>
                </div>
            </div>
        </div>
    )
}

export default QuizSummary
