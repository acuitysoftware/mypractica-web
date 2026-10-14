import React, { useEffect, useRef, useState } from 'react';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { FiPauseCircle } from 'react-icons/fi';

const CountDown = ({
  total_time,
  extra_time = 0,
  onComplete,
  setSummaryOpen,
  summaryopen,
  startit,
  setStartit,
  setExtraTimeUsed,
}) => {
  const [timeLeft, setTimeLeft] = useState(total_time * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [inExtraTime, setInExtraTime] = useState(false);
  const extraTimeStartRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);

            if (!inExtraTime && extra_time > 0) {
              setInExtraTime(true);
              extraTimeStartRef.current = Date.now();
              return extra_time * 60;
            } else {
              setExtraTimeUsed?.(getExtraTimeUsed());
              onComplete();
              return 0;
            }
          }

          // ⏱️ Update elapsed extra time continuously
          if (inExtraTime && extraTimeStartRef.current && setExtraTimeUsed) {
            setExtraTimeUsed(getExtraTimeUsed());
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, inExtraTime]);

  const getExtraTimeUsed = () => {
    return extraTimeStartRef.current
      ? Math.floor((Date.now() - extraTimeStartRef.current) / 1000)
      : 0;
  };

  useEffect(() => {
    if (startit) {
      setIsPaused(false);
      setStartit(false);
    }
  }, [startit]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    setSummaryOpen(true);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
        2,
        '0',
      )}:${String(secs).padStart(2, '0')}`;
    } else {
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(
        2,
        '0',
      )}`;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={togglePause}
      >
        {isPaused ? (
          <FaRegCirclePlay style={{ cursor: 'pointer', fontSize: 46 }} />
        ) : (
          <FiPauseCircle style={{ cursor: 'pointer', fontSize: 46 }} />
        )}
      </div>
      <h2 style={{ fontSize: 15 }}>{formatTime(timeLeft)}</h2>
      {inExtraTime && (
        <p style={{ fontSize: 14, color: 'orange' }}>Extra Time Started</p>
      )}
    </div>
  );
};

export default CountDown;
