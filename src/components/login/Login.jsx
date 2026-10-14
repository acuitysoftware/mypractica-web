import React, { useContext, useState } from 'react';
import './styles.scss';
import shape from '../../assets/shape1.png';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Loader from '../../common/loader/Loader';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ logintype, setLoginType }) => {
  const navigateTo = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formlogin, setFormlogin] = useState({
    user_type: logintype,
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    setFormlogin((prev) => ({
      ...prev,
      user_type: logintype,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formlogin.email || !formlogin.password) {
        setError('Please fill all the required form');
        setLoading(false);
      } else if (formlogin.password.length <= 3) {
        setError('Password must be more than 3 characters');
        setLoading(false);
      } else {
        const response = await loginUser(formlogin);
        if (response?.status === false) {
          setLoading(false);
          await Swal.fire({
            title: response.message,
            icon: 'error',
            timer: '1500',
          });
        } else {
          setLoading(false);
          await Swal.fire({
            title: 'Logged in Successfully' || response.message,
            icon: 'success',
            timer: '1500',
          });
          await login(response.token, response);
          if (logintype === 'TEACHER') {
            navigateTo('/profile');
          } else {
            navigateTo('/profile');
          }
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Something Went Wrong',
        icon: 'error',
        timer: '1500',
      });
      setLoading(false);
    }
  };
  console.log(formlogin);
  return (
    <>
      <div className="login">
        <h1>Login</h1>
        <div className="user-type-selector">
          <label>
            <input
              type="radio"
              name="userType"
              value="student"
              defaultChecked
              onChange={(e) => {
                setLoginType(e.target.value.toUpperCase());
                setFormlogin((prev) => ({
                  ...prev,
                  user_type: e.target.value.toUpperCase(),
                }));
              }}
            />
            <span>Student</span>
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="teacher"
              onChange={(e) => {
                setLoginType(e.target.value.toUpperCase());
                setFormlogin((prev) => ({
                  ...prev,
                  user_type: e.target.value.toUpperCase(),
                }));
              }}
            />
            <span>Teacher</span>
          </label>
        </div>
        <div className="input">
          <label>Mobile/Email</label>
          <input
            type="text"
            placeholder="Email/Phone No."
            name="email"
            onChange={onChangeValue}
          />
        </div>
        <div className="input">
          <label>Password*</label>
          <input
            type="password"
            placeholder="Password."
            name="password"
            onChange={onChangeValue}
          />
        </div>
        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>

          <a href="/forgot-password" className="forgot-link">
            Lost Your Password?
          </a>
        </div>
        {error ? (
          <p style={{ fontSize: '13px', color: 'red' }}>***{error}***</p>
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
          <button onClick={handleSubmit}>Sign In</button>
        )}

        <img className="shape" src={shape} alt="" />
      </div>
    </>
  );
};

export default Login;
