import React, { useState } from "react";
import "./styles.scss";
import { DeleteAccountCMS } from "../../api/auth";
import Swal from "sweetalert2";

const DeleteAccount = () => {
  const [userType, setUserType] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        email,
        password,
        user_type: userType,
      };
      const res = await DeleteAccountCMS(data);
      if (res?.status == false) {
        setLoading(false);
        await Swal.fire({
          title: response.message,
          icon: "error",
          timer: "1500",
        });
      } else {
        setLoading(false);
        await Swal.fire({
          title: " Deleted Successfully" || response.message,
          icon: "success",
          timer: "1500",
        });
      }
    } catch (error) {
      setLoading(false);
      await Swal.fire({
        title: "Something Went Wrong",
        icon: "error",
        timer: "1500",
      });
    }
  };
  return (
    <div className="delete-account-page">
      <div className="delete-account-card">
        <h1>Delete Account</h1>

        <div className="user-type">
          <label>
            <input
              type="radio"
              value="student"
              checked={userType === "STUDENT"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Student
          </label>

          <label>
            <input
              type="radio"
              value="teacher"
              checked={userType === "TEACHER"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Teacher
          </label>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="delete-btn" onClick={handleSubmit}>
          Delete This Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
