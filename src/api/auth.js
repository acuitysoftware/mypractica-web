import axios from 'axios';
import { BASE_URL } from '../utils/base';
import Cookies from 'js-cookie';



// Function to get the list of exams
export const loginUser = async (form) => {

    try {
        const response = await axios.post(`${BASE_URL}/login`, form, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        const { token, ...data } = response.data;

        // Save token to cookie
        if (response.data.status === false) {
            null
        } else {
            Cookies.set('auth_token', token, { expires: 7 }); // expires in 7 days
            Cookies.set('auth_user', JSON.stringify(data), { expires: 7 }); // expires in 7 days
        }


        return response.data;
    } catch (error) {
        console.error('Error Loggin In:', error);
        throw error;
    }
};

export const DeleteAccountCMS = async (data) => {

    let res_data = await axios.post(
        `${BASE_URL}/delete-account`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return res_data?.data;
};
export const StudentRegister = async (data) => {

    let res_data = await axios.post(
        `${BASE_URL}/students/register`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return res_data?.data;
};
export const TeacherRegister = async (data) => {

    let res_data = await axios.post(
        `${BASE_URL}/teachers/register`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return res_data?.data;
};

export const emailOtpVerifyStudent = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/students/email-otp-verify`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};

export const emailOtpVerifyTeacher = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/teachers/email-otp-verify`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};


export const resendOtpTeacher = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/teachers/resend-otp`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};
export const resendOtpStudent = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/students/resend-otp`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};


export const forgetPassword = async (email) => {
    let res_data = await axios.post(
        `${BASE_URL}/forgot-password`,
        { email: email },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};
export const forgetPasswordOtp = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/forgot-password-check-otp`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};

export const resetPassword = async (data) => {
    let res_data = await axios.post(
        `${BASE_URL}/reset-password`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res_data?.data;
};



export const changePasswordAuth = async (data) => {
    const token = Cookies.get("auth_token")
    let res_data = await axios.post(
        `${BASE_URL}/change-password`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    return res_data?.data;
};

