import axios from "axios";
import { BASE_URL } from "../utils/base";

export const fetchcourselist = async () => {
    let _data = await axios.post(
        `${BASE_URL}/courses-list`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    return _data?.data?.data;
}

export const fetchSubjectList = async () => {
    let _data = await axios.post(
        `${BASE_URL}/subjects-list`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("subject list", _data?.data?.data);

    return _data?.data?.data;
};
export const fetchStateList = async () => {
    let _data = await axios.post(
        `${BASE_URL}/states-list`,
        {},

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("state list", _data?.data?.data);

    return _data?.data?.data;
};
export const fetchCityList = async (state_id) => {
    let _data = await axios.post(
        `${BASE_URL}/city-list`,
        { state_id: state_id },

        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("state list", _data?.data?.data);

    return _data?.data?.data;
};
export const contactformdata = async (data) => {
    let _data = await axios.post(
        `${BASE_URL}/contact-form-submit`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("state list", _data?.data?.data);

    return _data?.data;
};
export const visitorformdata = async (data) => {
    let _data = await axios.post(
        `${BASE_URL}/visitor-form-submit`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'Authorization': `Bearer ${token}`,
            },
        }
    );
    //console.log("state list", _data?.data?.data);

    return _data?.data;
};


export const fetchSiteSettings = async () => {
    let response = await axios.post(
        `${BASE_URL}/site-settings`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return response?.data;
};
export const fetchSocialLinks = async () => {
    let response = await axios.post(
        `${BASE_URL}/social-links`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return response?.data;
};
export const fetchhomesecTeachers = async () => {
    let response = await axios.post(
        `${BASE_URL}/get-teachers`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return response?.data;
};



export const fetchCMS = async (slug) => {
    let response = await axios.post(
        `${BASE_URL}/cms`,
        { slug: slug },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return response?.data;
};
export const fetchBanners = async (slug) => {
    let response = await axios.post(
        `${BASE_URL}/banner`,
        { slug: slug },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    return response?.data;
};

