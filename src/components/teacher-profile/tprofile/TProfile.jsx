import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import { IoChevronDownOutline } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import {
  fetchCityList,
  fetchcourselist,
  fetchStateList,
  fetchSubjectList,
} from '../../../api/cms';
import { getStudentProfile, updateStudentProfile } from '../../../api/student';
import { MdModeEdit } from 'react-icons/md';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import {
  getTeacherProfile,
  updateTeachersProfile,
} from '../../../api/teachers';

const TProfile = () => {
  const [opendrp, setOpenDrp] = useState(false);
  const [openstatedrp, setOpenStateDrp] = useState(false);
  const [course, setCourse] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseSelect, setCourseSelect] = useState([]);
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [state_id, setState_id] = useState('');
  const [city_id, setCity_id] = useState('');
  const [cityname, setCityName] = useState('');
  const [statename, setStateName] = useState('');
  const [category_id, setCategory_id] = useState([]);
  const [image, setImage] = useState(null);
  const [pimage, setPImage] = useState(null);
  const [cimage, setcImage] = useState(null);
  const [pcimage, setpcImage] = useState(null);
  const [opencitydrp, setOpenCityDrp] = useState(false);
  const [age, setAge] = useState('');
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current.click(); // triggers hidden input
  };

  const handleFileChange = (e) => {
    setPImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleEditClick2 = () => {
    fileInputRef2.current.click(); // triggers hidden input
  };

  const handleFileChange2 = (e) => {
    setpcImage(URL.createObjectURL(e.target.files[0]));
    setcImage(e.target.files[0]);
    if (e.target.files[0]) {
      setcImage(e.target.files[0]);
    }
  };

  const teacherProfile = async () => {
    try {
      const res = await getTeacherProfile();
      console.log(res);
      setProfile(res?.data);
    } catch (error) {}
  };
  const courseslist = async () => {
    try {
      const res = await fetchSubjectList();
      console.log(res);
      setCourse(res);
    } catch (error) {}
  };
  console.log(course);
  const stateslist = async () => {
    try {
      const res = await fetchStateList();
      console.log(res);
      setState(res);
    } catch (error) {}
  };
  const citylist = async () => {
    try {
      const res = await fetchCityList(state_id);
      console.log(res);
      setCity(res);
    } catch (error) {}
  };

  useEffect(() => {
    setCategory_id(profile?.category_id);
    setAddress(profile?.address);
    setEducation(profile?.education);
    setState_id(profile?.state_id);
    setCity_id(profile?.city_id);
    setPhone(profile?.phone);
    setStateName(profile?.state?.name);
    setCityName(profile?.city?.name);
    setCourseSelect(profile?.subjects);
    setCategory_id(profile?.subjects?.map((e) => e.id));
    setAge(profile?.age);
    setPImage(profile?.image_path);
    setpcImage(profile?.certificate_path);
  }, [profile]);

  const courseClick = async (e) => {
    try {
      setCategory_id((prev) => {
        if (!prev.includes(e?.id)) {
          return [...prev, e?.id];
        }
        return prev;
      });
      setCourseSelect((prev) => {
        const exists = prev?.some((item) => item.id === e.id);
        if (!exists) {
          return [
            ...prev,
            {
              name: e?.name,
              id: e?.id,
            },
          ];
        }
        return prev;
      });
      setOpenDrp(false);
    } catch (error) {}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await updateTeachersProfile(
        address,
        education,
        age,
        state_id,
        city_id,
        category_id,
        image,
        cimage,
      );
      if (res?.status === false) {
        setLoading(false);
        Swal.fire({
          title: res?.message,
          icon: 'error',
          timer: 2000,
        });
      } else {
        setLoading(false);
        Swal.fire({
          title: res?.message,
          icon: 'success',
          timer: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.fire('Something Went Wrong');
    }
  };
  console.log(category_id);
  useEffect(() => {
    courseslist();
  }, []);
  useEffect(() => {
    stateslist();
    // citylist()
  }, []);
  useEffect(() => {
    citylist();
  }, [state_id]);
  useEffect(() => {
    teacherProfile();
  }, []);
  return (
    <div className="my-profile">
      <h2>Update Profile</h2>
      <div className="img">
        <img src={pimage} alt="" />
        <div className="edt">
          <MdModeEdit className="edit" onClick={() => handleEditClick()} />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <form className="form-full" onSubmit={handleSubmit}>
        <div className="form">
          <div className="input-div">
            <label>
              Name <span>*</span>
            </label>
            <input type="text" placeholder="Enter Name" value={profile?.name} />

            <label>
              Email <span>*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={profile?.email}
            />

            <label>Address</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="drop">
              <label>Subject Preferences</label>
              <input
                type="text"
                placeholder="Subject Preferences"
                style={{ cursor: 'pointer' }}
                readOnly
                onClick={() => setOpenDrp(!opendrp)}
              />
              <IoChevronDownOutline
                className="ico"
                onClick={() => setOpenDrp(!opendrp)}
              />
              {opendrp ? (
                <div className="drop-down">
                  {course?.map((c) => (
                    <p key={c?.id} onClick={() => courseClick(c)}>
                      {c?.name}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <div class="input-certify">
              <label for="certificate-upload">Upload Certificate</label>
              <div class="file-upload">
                <label className="upload-btn">
                  Upload File
                  <input
                    type="file"
                    id="certificate-upload"
                    ref={fileInputRef2}
                    onChange={handleFileChange2}
                  />
                </label>
                <input
                  type="text"
                  className="file-name"
                  placeholder="No file chosen"
                  readonly
                />
              </div>
            </div>
          </div>
          <div className="input-div2">
            <label>Qualification</label>
            <input
              type="text"
              placeholder="Education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
            <label>
              Phone <span>*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>Age</label>
            <input
              type="text"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className="drop">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter City"
                value={cityname}
                style={{ cursor: 'pointer' }}
                readOnly
                onClick={() => setOpenCityDrp(!opencitydrp)}
              />
              <IoChevronDownOutline
                className="ico"
                onClick={() => setOpenCityDrp(!opencitydrp)}
              />
              {opencitydrp ? (
                <div className="drop-down">
                  {city?.map((c) => (
                    <p
                      onClick={() => {
                        setCity_id(c?.id);
                        setCityName(c?.name);
                        setOpenCityDrp(false);
                      }}
                    >
                      {c?.name}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="drop">
              <label>State</label>
              <input type="text" placeholder="State" value={statename} />
              <IoChevronDownOutline
                className="ico"
                onClick={() => setOpenStateDrp(!openstatedrp)}
              />
              {openstatedrp ? (
                <div className="drop-down">
                  {state?.map((s) => (
                    <p
                      onClick={() => {
                        setState_id(c?.id);
                        setStateName(c?.name);
                        setOpenStateDrp(false);
                      }}
                    >
                      {s.name}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {pcimage ? (
          <img
            style={{
              margin: '18px 0px',
              height: 100,
              width: 190,
              objectFit: 'cover',
            }}
            src={pcimage}
            alt=""
          />
        ) : null}
        <div className="course-tags">
          {courseSelect?.map((course) => (
            <p>
              {course?.name}{' '}
              <RxCross1
                onClick={() => {
                  const catselect = courseSelect?.filter(
                    (c) => c?.id !== course?.id,
                  );
                  const catid = category_id?.filter((c) => c !== course?.id);
                  setCategory_id(catid);
                  setCourseSelect(catselect);
                }}
                className="cut"
              />
            </p>
          ))}
        </div>

        <button className="updt-btn">
          {loading ? 'Updaing Please Wait' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default TProfile;
