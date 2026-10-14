import React, { useEffect, useState } from 'react';
import PageWrapper from '../../common/pagewrapper/PageWrapper';
import './styles.scss';
import { contactformdata, fetchBanners } from '../../api/cms';
import Swal from 'sweetalert2';
import Loader from '../../common/loader/Loader';

const Contact = () => {
  const [contact_form, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bannerimg, setBannerImg] = useState(null);
  const [bannertext, setBannnerText] = useState(null);
  const getBanners = async () => {
    try {
      const res = await fetchBanners('contact-us');
      console.log(res);
      setBannerImg(res?.data?.image_path);
      setBannnerText(res?.data?.banner_text);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);
  const handlechange = (e) => {
    const { name, value, type } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        !contact_form.name ||
        !contact_form.email ||
        !contact_form.phone ||
        !contact_form.message
      ) {
        setLoading(false);
        setError('PLease fill all the fields before submit');
      } else {
        const res = await contactformdata(contact_form);
        console.log(res);
        if (res?.status === false) {
          setLoading(false);
          await Swal.fire({
            title: res.message,
            icon: 'error',
            timer: 3000,
          });
        } else {
          setLoading(false);
          await Swal.fire({
            title: 'Email Has Been Sent Successfully',
            icon: 'success',
            timer: 3000,
          });
          setContactForm({
            name: '',
            email: '',
            phone: '',
            message: '',
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      await Swal.fire({
        title: 'Something Went Wrong',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <>
      {loading ? <Loader /> : null}
      <PageWrapper head={bannertext} Img={bannerimg}>
        <div className="contact-form">
          <div className="contact-box">
            <div className="heads">
              <h1>Get In Touch</h1>
              <p>
                Fill out this form for booking a consultant advising session.
              </p>
            </div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handlechange}
              value={contact_form.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              onChange={handlechange}
              value={contact_form.email}
            />
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              onChange={handlechange}
              value={contact_form.phone}
            />
            <textarea
              name="message"
              id=""
              cols="30"
              rows="10"
              placeholder="Your Message"
              onChange={handlechange}
              value={contact_form.message}
            ></textarea>
            <button onClick={handleSubmit}>Submit Message</button>
            {error ? (
              <p style={{ fontSize: 12, color: 'red' }}>***{error}***</p>
            ) : null}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Contact;
