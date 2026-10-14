import axios from 'axios';
import { BASE_URL } from '../utils/base';
import { useAuth } from '../context/authContext';
import Cookies from 'js-cookie';

// Function to get the list of exams
export const getExamList = async (examid) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/exam-list${examid ? `?category_id=${examid}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Include Authorization header if authentication is required
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching exam list:', error);
    throw error;
  }
};

// Function to get the list of popular exams
export const getPopularExamList = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/popular-exam-list`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Include Authorization header if authentication is required
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular exam list:', error);
    throw error;
  }
};

// Function to get details of a specific exam
export const getExamDetails = async (examId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/exam-details`,
      { exam_id: examId },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Include Authorization header if authentication is required
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for exam ID ${examId}:`, error);
    throw error;
  }
};

export const fetchcourselist = async () => {
  let _data = await axios.post(
    `${BASE_URL}/courses-list`,
    {},

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data?.data;
};

export const fetchSubscriptionList = async () => {
  let _data = await axios.post(
    `${BASE_URL}/subscription-list`,
    {},

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const fetchQuizDetails = async (quizid) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/quize-details`,
    {
      exam_quizze_id: quizid,
    },

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const fetchQuizQuestions = async (quizid, offset) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/quize-question`,
    {
      exam_quizze_id: quizid,
      offset: offset,
    },

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const QuizQuestionsSubmit = async (data) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/quize-exam-submit`,
    data,

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const fetchSeriesDetails = async (quizid, setid) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/series-details`,
    {
      exam_series_id: quizid,
      series_set_id: setid,
    },

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const fetchSeriesQuestions = async (quizid, setid, offset) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/series-question`,
    {
      exam_series_id: quizid,
      series_set_id: setid,
      offset: offset,
    },

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};

export const SeriesQuestionsSubmit = async (data) => {
  const token = Cookies.get('auth_token');
  let _data = await axios.post(
    `${BASE_URL}/students/series-exam-submit`,
    data,

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  //console.log("course list", _data?.data?.course);

  return _data?.data;
};
