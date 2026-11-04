import React, { useRef, useState } from "react";
import "./styles.scss";
import PageWrapper from "../../../common/pagewrapper/PageWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import shape from "../../../assets/shape1.png";
import shape2 from "../../../assets/shape2.png";
import {
  emailOtpVerifyStudent,
  emailOtpVerifyTeacher,
  resendOtpStudent,
  resendOtpTeacher,
} from "../../../api/auth";
import Swal from "sweetalert2";
import { ThreeCircles } from "react-loader-spinner";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigateTo = useNavigate();
  const otpRefs = useRef([]);

  const handleOtpInput = (e, index) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, "").slice(0, otp.length);

    if (!digits && rawValue) return;

    const updatedOtp = [...otp];

    if (digits.length > 1) {
      digits.split("").forEach((digit, offset) => {
        if (index + offset < updatedOtp.length) {
          updatedOtp[index + offset] = digit;
        }
      });

      setOtp(updatedOtp);
      setError("");

      const lastFilledIndex = Math.min(index + digits.length, otp.length) - 1;
      otpRefs.current[lastFilledIndex]?.focus();
      return;
    }

    updatedOtp[index] = digits;
    setOtp(updatedOtp);
    setError("");

    if (digits && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const { email } = useParams();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type");

  const data = {
    email,
    otp: otp.join(""),
  };

  const onOtpCheck = async () => {
    if (otp.includes("")) {
      setError("Please enter all 5 digits of the OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;

      if (type === "STUDENT") {
        res = await emailOtpVerifyStudent(data);
      } else if (type === "TEACHER") {
        res = await emailOtpVerifyTeacher(data);
      } else {
        return;
      }

      if (res.status === false) {
        await Swal.fire({
          title: res.message,
          icon: "error",
          timer: 1500,
        });
      } else {
        await Swal.fire({
          title: res.message,
          icon: "success",
          timer: 1500,
        });
        navigateTo("/sign-in");
      }
    } catch (error) {
      // The verification request failed.
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      let res;

      if (type === "STUDENT") {
        res = await resendOtpStudent({ email });
      } else if (type === "TEACHER") {
        res = await resendOtpTeacher({ email });
      } else {
        return;
      }

      await Swal.fire({
        title: res.message,
        timer: 1800,
        icon: res.status === false ? "error" : "success",
      });
    } catch (error) {
      // The resend request failed.
    }
  };

  return (
    <PageWrapper head={"OTP"}>
      <div className="otp-page">
        <div className="otp-container">
          <h2>OTP Verification</h2>
          <p>Enter OTP Code Sent To {email}</p>

          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={i === 0 ? otp.length : 1}
                className="otp-box"
                value={digit}
                onChange={(e) => handleOtpInput(e, i)}
              />
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}

          <p className="resend-text">
            Didn’t Receive OTP Code?{" "}
            <span onClick={resendCode} className="resend-link">
              Resend Code
            </span>
          </p>

          {loading ? (
            <button className="verify-btn" disabled>
              <ThreeCircles
                visible={true}
                height="30"
                width="30"
                color="#fff"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </button>
          ) : (
            <button onClick={onOtpCheck} className="verify-btn">
              Verify &amp; Proceed
            </button>
          )}

          <img src={shape} alt="" className="shapes" />
          <img src={shape2} alt="" className="shapes2" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Otp;
