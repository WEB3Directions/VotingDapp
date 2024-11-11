import React, { useEffect, useState } from 'react';

const CurrentUnixTimestamp = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [readableTime, setReadableTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      setTimestamp(currentTimestamp);

      // Convert Unix timestamp to readable 12-hour format with AM/PM
      const date = new Date(currentTimestamp * 1000); // Convert seconds to milliseconds
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };
      setReadableTime(date.toLocaleString('en-US', options)); // Format with 12-hour time and AM/PM
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h3>Current Unix Timestamp</h3>
      <p>{timestamp}</p>
      <h2>Time</h2>
      <p>{readableTime}</p>
    </div>
  );
};

export default CurrentUnixTimestamp;
