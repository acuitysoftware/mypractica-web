import axios from "axios";
import { BASE_URL } from "../utils/base";
import Cookies from "js-cookie";


export const getSubcriptionfromid = async (id, tid) => {
    const token = Cookies.get("auth_token")
    let _data = await axios.post(
        `${BASE_URL}/students/subscription-purchase`,
        {
            subscription_id: id,
            transaction_id: tid
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
