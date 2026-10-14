import axios from "axios";
import { BASE_URL } from "../utils/base";
import Cookies from 'js-cookie';

export const getStudentDashboard = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/dashboard`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};



export const getStudentSubs = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/my-subscriptions`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};



export const getStudentProfile = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/get-profile`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};



export const updateStudentProfile = async (address, education, state_id, city_id, category_id, image) => {
    const token = Cookies.get("auth_token")
    const formData = new FormData();

    formData.append('address', address);
    formData.append('education', education);
    formData.append('state_id', state_id);
    formData.append('city_id', city_id);
    category_id.forEach(id => {
        formData.append('category_id[]', id);
    });
    if (image) {
        formData.append('image', image);
    }
    let _data = await axios.post(
        `${BASE_URL}/students/update-profile`,
        formData,
        {
            headers: {
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    return _data?.data;
};



export const getStudentSchedule = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/my-schedules`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};



export const getStudentResult = async (result) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/my-results-details`,
        {
            result_id: result
        },

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};


export const getStudentAllResult = async (searchName, from_date, to_date, limit, offset) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/my-results`,
        {
            searchName: searchName,
            from_date: from_date,
            to_date: to_date,
            limit: limit,
            offset: offset
        },

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("course list", _data?.data?.course);

    return _data?.data;
};
