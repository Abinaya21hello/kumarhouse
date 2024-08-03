import React, { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft({});
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (Object.keys(timeLeft).length === 0) {
    return <h2>EXPIRED</h2>;
  }

  return (
    <div id="countdown">

      <ul >

        <li>
          <span className="days">{timeLeft.days}</span>days
        </li>
        <li>
          <span className="hours">{timeLeft.hours}</span>Hours
        </li>
        <li>
          <span className="minutes">{timeLeft.minutes}</span>Minutes
        </li>
        <li>
          <span className="seconds">{timeLeft.seconds}</span>Seconds
        </li>
      </ul>
    </div>
  );
};

export default CountdownTimer;
