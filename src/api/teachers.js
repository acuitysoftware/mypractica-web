import axios from "axios";
import { BASE_URL } from "../utils/base";
import Cookies from "js-cookie";



export const availableTeachersList = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/available-teachers-list`,
        {
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
export const availableTeachersDetail = async (tid, date) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/available-teachers-details`,
        {
            teacher_id: tid,
            date: date
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



export const schedulePurchase = async (data) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/session-purchased`,

        data
        ,
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



export const getTeacherProfile = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/get-profile`,
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

export const getTeacherDashboard = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/dashboard`,
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


export const updateTeachersProfile = async (address, education, age, state_id, city_id, category_id, image, cimage) => {
    const token = Cookies.get("auth_token")
    const formData = new FormData();

    formData.append('address', address);
    formData.append('education', education);
    formData.append('age', age);
    formData.append('state_id', state_id);
    formData.append('city_id', city_id);
    category_id.forEach(id => {
        formData.append('subject_id[]', id);
    });
    if (image) {
        formData.append('image', image);
    }
    if (cimage) {
        formData.append('certificate', cimage);
    }
    let _data = await axios.post(
        `${BASE_URL}/teachers/update-profile`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    return _data?.data;
};


export const getTeacherScheduleList = async (offset) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/time-schedules-list`,
        {
            limit: 5,
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


export const getTeacherSubjectList = async () => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/subject-list`,
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

export const createSchedule = async (slots) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/time-schedules/create`,
        {
            slots: slots
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


export const TeacherBookedSchedule = async (fromdate, todate, statusid, offset) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/my-booked-schedules`,
        {
            from_date: fromdate,
            to_date: todate,
            status: statusid,
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




export const TeacherScheduleAccept = async (id, pname, plink) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/schedules-accept`,
        {
            booking_id: id,
            platform_name: pname,
            link: plink
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
export const TeacherScheduleReject = async (id) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/schedules-reject`,
        {
            booking_id: id,

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
export const TeacherScheduleDelete = async (id) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/teachers/time-schedules/delete`,
        {
            slot_id: id,

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


