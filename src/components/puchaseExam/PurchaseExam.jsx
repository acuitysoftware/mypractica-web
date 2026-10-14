import React, { useEffect, useState } from 'react';
import './styles.scss';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { IoRepeat } from 'react-icons/io5';
import { LuMessageSquareText } from 'react-icons/lu';
import { RxCross1 } from 'react-icons/rx';
import { fetchSiteSettings } from '../../api/cms';
import { getSubcriptionfromid } from '../../api/subscriptions';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/authContext';
import Loader from '../../common/loader/Loader';

const PurchaseExam = ({ setPurchaseModal, exam, exm_select, price, desc }) => {
  const [selectedId, setSelectedId] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  console.log(exam);

  const fetchKeys = async () => {
    const res = await fetchSiteSettings();
    setKey(res?.data);
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error('Failed to load Razorpay SDK.');
      return;
    }
    try {
      const options = {
        key: key?.razor_pay_key,
        amount: selectedPrice * 100,
        currency: 'INR',
        name: 'My Practica',
        description: 'Subscription Purchase',
        handler: async function (response) {
          const { razorpay_payment_id } = response;
          try {
            setLoading(true);
            const res = await getSubcriptionfromid(
              selectedId,
              razorpay_payment_id,
            );
            if (res?.status === false) {
              setLoading(false);
              toast.error(res?.message);
            } else {
              setLoading(false);
              await Swal.fire({
                title: res.message,
                icon: 'success',
                timer: 1500,
              });
              setPurchaseModal(false);
            }
          } catch (error) {
            await Swal.fire({
              title: 'Something Went Wrong',
              icon: 'error',
              timer: 1500,
            });
            console.log(error);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Order creation error', error);
      toast.error('Error while creating Razorpay order.');
    }
  };

  const selectedExam = (e) => {
    setSelectedId(e?.id);
    setSelectedPrice(e?.price);
  };
  useEffect(() => {
    setSelectedId(exm_select);
    setSelectedPrice(price);
  }, []);
  useEffect(() => {
    fetchKeys();
  }, []);
  return (
    <>
      {loading ? <Loader /> : null}
      <div className="purchasebg">
        <div className="purchase-exam">
          <RxCross1 className="cross" onClick={() => setPurchaseModal(false)} />
          <div className="left">
            {/* <h3>Unlock All Benifits with MyPractica</h3> */}
            <div
              className="note1"
              dangerouslySetInnerHTML={{
                __html: desc,
              }}
            >
              {/* <LiaFileInvoiceSolid className="icos" />
              <p>17000+ Prev. Year Paper Tests</p> */}
            </div>
            {/* <div className="note1">
              <IoRepeat className="icos" />
              <p>Access to Practice Pro Questions</p>
            </div>
            <div className="note1">
              <LuMessageSquareText className="icos" />
              <p>Access to Pro Live Tests</p>
            </div> */}
          </div>
          {exam.length !== 0 ? (
            <div className="right">
              <h3>Choose Your Exam</h3>
              <div className="exm-buttons">
                {exam?.map((e) => (
                  <div
                    // onClick={() => selectedExam(e)}
                    key={e.id}
                    className={selectedId === e.id ? 'exm_select' : 'exm'}
                  >
                    <div className="exm-select-textsss">
                      <div className="radio">
                        <input
                          className="custom-radio"
                          type="radio"
                          name="exam"
                          checked={selectedId === e.id ? true : false}
                          onChange={() => selectedExam(e)}
                        />
                      </div>
                      <p>{e?.exam_name}</p>
                    </div>

                    <p className="pprice">₹ {e?.price}</p>
                  </div>
                ))}
              </div>
              <button onClick={handlePayment}>Buy Now</button>
            </div>
          ) : (
            <div className="right">
              <h3>You have purchased all the Exams</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseExam;
