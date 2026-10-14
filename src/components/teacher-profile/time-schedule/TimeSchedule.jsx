import React, { useEffect, useState } from 'react';
import './styles.scss';
import {
  createSchedule,
  getTeacherScheduleList,
  getTeacherSubjectList,
  TeacherScheduleDelete,
} from '../../../api/teachers';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Loader from '../../../common/loader/Loader';

const TimeSchedule = () => {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const [slots, setSlots] = useState([]);
  const [subjects, setSubjects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allschedule, setAllSchedule] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [offset, setOfset] = useState(true);
  const [editableSchedule, setEditableSchedule] = useState(null);

  const [formData, setFormData] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { from_time: '', to_time: '', subject_id: '' };
      return acc;
    }, {}),
  );

  console.group(formData);

  //   console.log(slots);
  const timeSchedules = async () => {
    try {
      const res = await getTeacherScheduleList();
      console.log(res.data);
      setAllSchedule(res.data);
      setEditableSchedule(res?.data);
    } catch (error) {}
  };
  const subjectLists = async () => {
    try {
      const res = await getTeacherSubjectList();
      console.log(res?.data);
      setSubjects(res?.data);
    } catch (error) {}
  };

  console.log(editableSchedule);
  const handleTimeChange = (id, key, value) => {
    setEditableSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const handleSubjectChange = (id, value) => {
    setEditableSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, subject_id: value } : item,
      ),
    );
  };

  const handleChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };
  console.log(allschedule);
  const addSlot = async (day) => {
    const { from_time, to_time, subject_id } = formData[day];

    const formatTime = (time) => (time.length === 5 ? `${time}:00` : time);
    const timeToMinutes = (t) => {
      const [h, m, s] = t.split(':').map(Number);
      return h * 60 + m + (s ? s / 60 : 0);
    };

    if (!from_time || !to_time || !subject_id) {
      toast.error('Please fill all fields for ' + day);
      return;
    }

    const formattedFrom = formatTime(from_time);
    const formattedTo = formatTime(to_time);

    const fromMinutes = timeToMinutes(formattedFrom);
    const toMinutes = timeToMinutes(formattedTo);

    if (fromMinutes >= toMinutes) {
      toast.error('Start time must be before end time');
      return;
    }

    // 🔴 Check conflict with existing schedules
    const isConflict = allschedule?.some((slot) => {
      if (slot.day !== day) return false;

      const slotFrom = timeToMinutes(slot.from_time);
      const slotTo = timeToMinutes(slot.to_time);

      return (
        (fromMinutes >= slotFrom && fromMinutes < slotTo) ||
        (toMinutes > slotFrom && toMinutes <= slotTo) ||
        (fromMinutes <= slotFrom && toMinutes >= slotTo)
      );
    });

    if (isConflict) {
      toast.error(`Time slot overlaps on ${day}`);
      return;
    }

    const payload = [
      {
        id: '',
        day,
        from_time: formattedFrom,
        to_time: formattedTo,
        subject_id,
      },
    ];

    try {
      setLoading(true);
      const res = await createSchedule(payload);

      if (res?.status === false) {
        Swal.fire({
          title: res.message,
          icon: 'error',
          timer: 2000,
        });
      } else {
        toast.success('Schedule added successfully');
        timeSchedules(); // refresh list

        // clear inputs
        setFormData((prev) => ({
          ...prev,
          [day]: { from_time: '', to_time: '', subject_id: '' },
        }));
      }
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    console.log('Slots to save:', slots);
    const res = await createSchedule(slots);
    if (res?.status === false) {
      Swal.fire({
        title: res?.message,
        timer: 2000,
        icon: 'error',
      });
      setLoading(false);
    } else {
      Swal.fire({
        title: res?.message,
        timer: 2000,
        icon: 'success',
      });
      timeSchedules();
      setLoading(false);
    }
  };
  const updateTeacherSchedule = async (item) => {
    try {
      setLoading(true);
      const payload = [
        {
          id: item.id,
          day: item.day,
          subject_id: item.subject_id,
          from_time: item.from_time,
          to_time: item.to_time,
        },
      ];

      const res = await createSchedule(payload);
      if (res?.status === false) {
        Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: 'error',
        });
        setLoading(false);
      } else {
        Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: 'success',
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteTeacherSchedule = async (id) => {
    setLoading(true);
    try {
      const res = await TeacherScheduleDelete(id);
      if (res?.status === false) {
        setLoading(false);
        Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: 'error',
        });
        console.log(id);
      } else {
        setLoading(false);
        await Swal.fire({
          title: res?.message,
          timer: 2000,
          icon: 'success',
        });
        setDeleted(!deleted);
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Something Went Wrong',
        timer: 2000,
        icon: 'error',
      });
    }
  };
  useEffect(() => {
    timeSchedules();
  }, [deleted]);
  useEffect(() => {
    subjectLists();
  }, []);

  const dayOrder = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const sortedSchedules = [...(editableSchedule || [])].sort((a, b) => {
    // sort by day first
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }

    // then sort by from_time
    return a.from_time.localeCompare(b.from_time);
  });

  return (
    <>
      {loading ? <Loader /> : null}

      <div className="container-wrapper">
        <div className="session-time-container">
          <h2>Create your Available Session Time</h2>
          {daysOfWeek.map((day) => (
            <div key={day} className="day-row">
              <input type="text" value={day} readOnly />
              <div className="timers">
                <label>Form</label>
                <input
                  type="time"
                  value={formData[day].from_time}
                  onChange={(e) =>
                    handleChange(day, 'from_time', e.target.value)
                  }
                />
              </div>
              <div className="timers">
                <label>To</label>
                <input
                  type="time"
                  value={formData[day].to_time}
                  onChange={(e) => handleChange(day, 'to_time', e.target.value)}
                />
              </div>
              <div className="last-inp">
                <select
                  value={formData[day].subject_id}
                  onChange={(e) =>
                    handleChange(day, 'subject_id', e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {subjects?.map((s) => (
                    <option value={s?.id}>{s?.name}</option>
                  ))}
                </select>

                <button className="add-btn" onClick={() => addSlot(day)}>
                  +
                </button>
              </div>
            </div>
          ))}
          {/* <button className="save-btn" onClick={handleSave}>
            Save
          </button> */}
        </div>
        <div className="your-schedules">
          <h2>Your Schedules</h2>
          {sortedSchedules?.length === 0 ? (
            <p>Sorry No schedules are created</p>
          ) : (
            sortedSchedules?.map((all) => (
              <div key={all.id} className="day-row">
                <input type="text" value={all?.day} readOnly />

                <div className="timers">
                  <label>From</label>
                  <input
                    type="time"
                    value={all.from_time}
                    onChange={(e) =>
                      handleTimeChange(all.id, 'from_time', e.target.value)
                    }
                  />
                </div>

                <div className="timers">
                  <label>To</label>
                  <input
                    type="time"
                    value={all.to_time}
                    onChange={(e) =>
                      handleTimeChange(all.id, 'to_time', e.target.value)
                    }
                  />
                </div>

                <div className="last-inp">
                  <select
                    value={all.subject_id}
                    onChange={(e) =>
                      handleSubjectChange(all.id, e.target.value)
                    }
                  >
                    {subjects?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="add-btn"
                    onClick={() => updateTeacherSchedule(all)} // sends updated row
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="add-btn del"
                    onClick={() => deleteTeacherSchedule(all?.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="paginations"></div>
        </div>
      </div>
    </>
  );
};

export default TimeSchedule;
