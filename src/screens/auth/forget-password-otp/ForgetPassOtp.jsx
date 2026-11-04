import React, { useRef, useState } from "react";
import "./styles.scss";
import { ThreeCircles } from "react-loader-spinner";
import PageWrapper from "../../../common/pagewrapper/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import shape from "../../../assets/shape1.png";
import shape2 from "../../../assets/shape2.png";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { forgetPasswordOtp } from "../../../api/auth";

const ForgetPassOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const otpRefs = useRef([]);

  const { email } = useParams();

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

      const lastFilledIndex = Math.min(index + digits.length, otp.length) - 1;
      otpRefs.current[lastFilledIndex]?.focus();
      return;
    }

    updatedOtp[index] = digits;
    setOtp(updatedOtp);

    if (digits && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const getForgotPasswordOtp = async () => {
    if (otp.includes("")) {
      toast.error("Please enter all 5 digits of the OTP.");
      return;
    }

    const data = {
      email,
      otp: otp.join(""),
    };

    setLoading(true);

    try {
      const res = await forgetPasswordOtp(data);

      if (res.status === false) {
        await Swal.fire({
          title: res?.message,
          icon: "error",
          timer: 2000,
        });
      } else {
        await Swal.fire({
          title: res?.message,
          icon: "success",
          timer: 2000,
        });
        navigateTo("/reset-password");
      }
    } catch (error) {
      await Swal.fire({
        title: "Something Went Wrong",
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
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
            <button onClick={getForgotPasswordOtp} className="verify-btn">
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

export default ForgetPassOtp;
