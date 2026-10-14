import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./screens/home/Home";
import Authentication from "./screens/auth/Authentication/Authentication";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Otp from "./screens/auth/otp/Otp";
import { Toaster } from "react-hot-toast";
import Exam from "./screens/exam/Exam";
import Profile from "./screens/profile/Profile";
import Contact from "./screens/contact/Contact";
import ExamDetails from "./screens/examdetails/ExamDetails";
import ForgetPassword from "./screens/auth/forget-password/ForgetPassword";
import ForgetPassOtp from "./screens/auth/forget-password-otp/ForgetPassOtp";
import ResetPassword from "./screens/auth/reset-password/ResetPassword";
import Quizes from "./screens/quiz/Quizes";
import Series from "./screens/series/Series";
import AvailableTeacher from "./screens/available-teachers/AvailableTeacher";
import TeacherSchedule from "./screens/teacher-schedule/TeacherSchedule";
import Results from "./screens/results/Results";
import { useAuth } from "./context/authContext";
import AboutUs from "./screens/aboutus/AboutUs";
import Terms from "./screens/terms/Terms";
import Privacy from "./screens/privacy/Privacy";
import DeleteAccount from "./screens/delete-account/DeleteAccount";

const App = () => {
  const { user } = useAuth();
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Authentication />} />
        <Route path="/otp/:email" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forgot-password-otp/:email" element={<ForgetPassOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp/:email" element={<Otp />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/examdetails/:id" element={<ExamDetails />} />
        <Route path="/quizes/:id" element={<Quizes />} />
        <Route path="/series/:id" element={<Series />} />
        {user ? <Route path="/profile" element={<Profile />} /> : null}
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/exam-result/:id" element={<Results />} />
        <Route path="/available-teachers" element={<AvailableTeacher />} />
        <Route path="/teacher-schedule/:id" element={<TeacherSchedule />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
