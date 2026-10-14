import ChangePassword from "./changepassword/ChangePassword";
import Dashboard from "./dashboard/Dashboard";
import ExamResult from "./examresult/ExamResult";
import MyProfile from "./myprofile/MyProfile";
import MySchedule from "./myschedule/MySchedule";
import Subscription from "./subscription/Subscription";

export const studentNavs = [
    {
        name: "Dashboard",
        to: <Dashboard />
    },
    {
        name: "My Profile",
        to: <MyProfile />
    },
    {
        name: "My Schedule",
        to: <MySchedule />
    },
    {
        name: "Exam Result",
        to: <ExamResult />
    },
    {
        name: "Subscription",
        to: <Subscription />
    },
    {
        name: "Change Password",
        to: <ChangePassword />
    }

]