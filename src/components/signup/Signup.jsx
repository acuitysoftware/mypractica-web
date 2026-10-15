import React, { useEffect, useState } from "react";
import "./styles.scss";
import shape from "../../assets/shape2.png";
import { fetchcourselist } from "../../api/exams";
import { GoChevronDown } from "react-icons/go";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { fetchStateList, fetchSubjectList } from "../../api/cms";
import { RxCross1 } from "react-icons/rx";
import { StudentRegister, TeacherRegister } from "../../api/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";

// Inline styles so the eye toggle works without touching styles.scss
const passwordWrapStyle = { position: "relative", width: "100%" };
const passwordInputStyle = {
  width: "100%",
  paddingRight: 42,
  boxSizing: "border-box",
};
const eyeButtonStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  padding: 0,
  width: "auto",
  height: "auto",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#666",
};

const Signup = ({ logintype, setLoginType }) => {
  const [states, setStates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statedrp, setStateDrp] = useState(false);
  const [state_id, setStateId] = useState("");
  const [state_name, setStateName] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [courses, setCourses] = useState(null);
  const [coursedrp, setCourseDrp] = useState(false);
  const [category_id, setCategoryId] = useState([]);
  const [category_name, setCategoryName] = useState([]);
  const [subject, setSubject] = useState(null);
  const [subjectdrp, setSubjectDrp] = useState(false);
  const [subject_id, setSubjectId] = useState([]);
  const [subject_name, setSubjectName] = useState([]);
  const [error, setError] = useState("");
  const [qfication, setQfication] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigateTo = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const fetchState = async () => {
    try {
      const res = await fetchStateList();
      console.log(res);
      setStates(res);
    } catch (error) {}
  };
  const fetchCategory = async () => {
    try {
      const res = await fetchcourselist();
      console.log(res);
      setCourses(res);
    } catch (error) {}
  };
  const fetchSubject = async () => {
    try {
      const res = await fetchSubjectList();
      console.log(res);
      setSubject(res);
    } catch (error) {}
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const qficationOnChange = (e) => {
    if (logintype === "TEACHER") {
      setQfication(e.target.value);
      setForm((prev) => ({
        ...prev,
        education: e.target.value,
      }));
    }
  };

  const handleUserTypeChange = (e) => {
    const type = e.target.value.toUpperCase();
    setLoginType(type);
    setForm((prev) => ({
      ...prev,
      user_type: type,
    }));
  };

  const submit_form = async () => {
    setLoading(true);
    try {
      if (logintype === "STUDENT") {
        if (
          !form.name ||
          !form.email ||
          !form.password ||
          !form.password_confirmation
        ) {
          setLoading(false);
          setError("Please Fill all the fields before signup");
        } else {
          const res = await StudentRegister(form);
          console.log(res);
          if (res.status === false) {
            setLoading(false);
            await Swal.fire({
              title: res.message,
              timer: 1500,
              icon: "error",
            });
          } else {
            setLoading(false);
            await Swal.fire({
              title: res.message,
              icon: "success",
              timer: 1500,
            });
            navigateTo(`/otp/${form.email}?type=${logintype}`);
          }
        }
      } else if (logintype === "TEACHER") {
        if (
          !form.name ||
          !form.email ||
          !form.password ||
          !form.password_confirmation ||
          qfication.length === 0
        ) {
          setError("Please Fill all the fields before signup");
          setLoading(false);
        } else {
          const res = await TeacherRegister(form);
          console.log(res);
          if (res.status === false) {
            setLoading(false);
            await Swal.fire({
              title: res.message,
              timer: 1500,
              icon: "error",
            });
          } else {
            setLoading(false);
            await Swal.fire({
              title: res.message,
              icon: "success",
              timer: 1500,
            });
            navigateTo(`/otp/${form.email}?type=${logintype}`);
          }
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  console.log(category_id);
  console.log(form);
  useEffect(() => {
    fetchState();
  }, []);
  useEffect(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    fetchSubject();
  }, []);
  return (
    <div className="sign-up">
      <h1>Sign Up </h1>
      <div className="user-type-selector">
        <label>
          <input
            type="radio"
            name="userTypesignup"
            value="student"
            defaultChecked
            onChange={handleUserTypeChange}
          />
          <span>Student</span>
        </label>
        <label>
          <input
            type="radio"
            name="userTypesignup"
            value="teacher"
            onChange={handleUserTypeChange}
          />
          <span>Teacher</span>
        </label>
      </div>
      <div className="input">
        <label>
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />
      </div>
      <div className="input">
        <label>
          Mobile No <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="number"
          placeholder="Mobile No."
          name="phone"
          onChange={handleChange}
        />
      </div>
      <div className="input">
        <label>
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
      </div>

      {/* PASSWORD with show/hide */}
      <div className="input input-pass">
        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>
        <div style={passwordWrapStyle}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            style={passwordInputStyle}
            onChange={handleChange}
          />
          <button
            type="button"
            style={eyeButtonStyle}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD with show/hide */}
      <div className="input input-pass">
        <label>
          Confirm Password <span style={{ color: "red" }}>*</span>
        </label>
        <div style={passwordWrapStyle}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="password_confirmation"
            style={passwordInputStyle}
            onChange={handleChange}
          />
          <button
            type="button"
            style={eyeButtonStyle}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      {/* DROP DOWN */}
      <div className="input drop-input">
        <label>State*</label>
        <input
          type="text"
          placeholder="Select State"
          autoComplete="off"
          value={state_name}
          readOnly
          onClick={() => setStateDrp(!statedrp)}
        />
        <GoChevronDown className="ico" onClick={() => setStateDrp(!statedrp)} />
        {statedrp ? (
          <div className="drop-list">
            <input
              type="search"
              className="state-search"
              placeholder="Search states..."
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              aria-label="Search states"
            />
            {states
              ?.filter((state) =>
                state?.name
                  ?.toLowerCase()
                  .includes(stateSearch.trim().toLowerCase()),
              )
              .map((state) => (
                <p
                  key={state?.id}
                  onClick={() => {
                    setStateDrp(false);
                    setStateSearch("");
                    setStateId(state?.id);
                    setStateName(state?.name);
                    setForm((prev) => ({
                      ...prev,
                      state_id: state?.id,
                    }));
                  }}
                >
                  {state?.name}
                </p>
              ))}
            {states?.length &&
            !states.some((state) =>
              state?.name
                ?.toLowerCase()
                .includes(stateSearch.trim().toLowerCase()),
            ) ? (
              <p className="no-state-results">No states found</p>
            ) : null}
          </div>
        ) : null}
      </div>
      {logintype === "TEACHER" ? (
        <div className="input">
          <label>Education Qualification*</label>
          <input
            type="text"
            placeholder="Education Qualification"
            value={qfication}
            onChange={qficationOnChange}
          />
        </div>
      ) : null}
      {/* DROP DOWN */}
      {logintype === "TEACHER" ? (
        <div className="input drop-input">
          <label>Subject Preference*</label>
          <input
            type="text"
            placeholder="Subject Preference"
            readOnly
            onClick={() => setSubjectDrp(!subjectdrp)}
          />
          <GoChevronDown
            className="ico"
            onClick={() => setSubjectDrp(!subjectdrp)}
          />
          {subjectdrp ? (
            <div className="drop-list">
              {subject?.map((sub) => (
                <p
                  key={sub?.id}
                  onClick={() => {
                    setSubjectDrp(false);
                    const newSubId = sub?.id;
                    setSubjectId((prev) => {
                      if (prev.includes(newSubId)) return [...prev];
                      return [...prev, newSubId];
                    });
                    setSubjectName((prev) => {
                      const exists = prev.find((c) => c.id === sub.id);
                      if (exists) return prev;
                      return [...prev, { name: sub.name, id: sub.id }];
                    });
                    setForm((prev) => ({
                      ...prev,
                      subject_id: [...subject_id, newSubId], // manually append to old subject ids
                    }));
                  }}
                >
                  {sub?.name}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* DROP DOWN */}
      {logintype === "STUDENT" ? (
        <div className="input drop-input">
          <label>Interested Course*</label>
          <input
            type="text"
            placeholder="Interested Course"
            readOnly
            onClick={() => setCourseDrp(!coursedrp)}
          />
          <GoChevronDown
            className="ico"
            onClick={() => setCourseDrp(!coursedrp)}
          />
          {coursedrp ? (
            <div className="drop-list">
              {courses?.map((course) => (
                <p
                  key={course?.id}
                  onClick={() => {
                    setCourseDrp(false);
                    const newCategoryId = course?.id;
                    setCategoryId((prev) => {
                      if (prev.includes(newCategoryId)) return [...prev];
                      return [...prev, newCategoryId];
                    });
                    setCategoryName((prev) => {
                      const exists = prev.find((c) => c.id === course.id);
                      if (exists) return prev;
                      return [...prev, { name: course.name, id: course.id }];
                    });
                    setForm((prev) => ({
                      ...prev,
                      category_id: [...category_id, newCategoryId], // manually append to old categoryId
                    }));
                  }}
                >
                  {course?.name}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* For the courses tag listing */}
      {category_name.length === 0 || !category_name ? null : (
        <div className="category-set">
          {category_name?.map((c, index) => (
            <div key={index} className="cats">
              <span>{c?.name}</span>
              <RxCross1
                className="ico-cross"
                onClick={() => {
                  const cf = category_name?.filter((e) => e !== c);
                  setCategoryName(cf);
                  const catid = category_id?.filter((e) => e !== c?.id);
                  setCategoryId(catid);
                  setForm((prev) => ({
                    ...prev,
                    category_id: catid,
                  }));
                }}
              />
            </div>
          ))}
        </div>
      )}
      {subject_name.length === 0 || !subject_name ? null : (
        <div className="category-set">
          {subject_name?.map((c, index) => (
            <div key={index} className="cats">
              <span>{c?.name}</span>
              <RxCross1
                className="ico-cross"
                onClick={() => {
                  const cf = subject_name?.filter((e) => e !== c);
                  setSubjectName(cf);
                  const subid = subject_id?.filter((e) => e !== c?.id);
                  setSubjectId(subid);
                  setForm((prev) => ({
                    ...prev,
                    subject_id: subid,
                  }));
                }}
              />
            </div>
          ))}
        </div>
      )}
      {error ? (
        <p style={{ fontSize: 12, color: "red", margin: "10px 0px" }}>
          ***{error}***
        </p>
      ) : null}
      {loading ? (
        <button>
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
        <button onClick={submit_form}>Create Account</button>
      )}

      <img className="shape" src={shape} alt="" />
    </div>
  );
};

export default Signup;
