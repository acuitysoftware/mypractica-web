import React, { useState } from "react";
import "./styles.scss";
import { RxCross1 } from "react-icons/rx";
import { visitorformdata } from "../../api/cms";
import Loader from "../../common/loader/Loader";
import Swal from "sweetalert2";

const VisitorForm = ({ handleClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitVisitor = async () => {
    const data = {
      name: name,
      email: email,
      phone: phone,
    };
    try {
      setLoading(true);
      if (!phone || !email || !name) {
        setLoading(false);
        setError("Please fill al the fields");
      } else {
        const res = await visitorformdata(data);
        if (res?.status === false) {
          setLoading(false);
          await Swal.fire({
            title: res?.message,
            icon: "error",
            timer: 1500,
          });
        } else {
          setLoading(false);
          await Swal.fire({
            title: res?.message,
            icon: "success",
            timer: 1500,
          });
          handleClose(false);
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong",
        icon: "error",
        timer: 1500,
      });
    }
  };
  return (
    <>
      {loading ? <Loader /> : null}
      <div className="visitor-form">
        <div className="v-form-box">
          <div className="cross-sec">
            <p>Please Enter Details Or Login </p>
            <RxCross1 className="cross" onClick={() => handleClose(false)} />
          </div>
          <label>
            Name <span>*</span>
          </label>
          <input type="text" onChange={(e) => setName(e.target.value)} />
          <label>
            Phone No. <span>*</span>
          </label>
          <input type="number" onChange={(e) => setPhone(e.target.value)} />
          <label>
            Email <span>*</span>
          </label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
          <button onClick={submitVisitor}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default VisitorForm;
