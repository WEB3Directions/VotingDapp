import React from 'react'
import { useEffect,useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";



const DisplayTiming = () => {

    const { web3State } = useWeb3Context();
    const { contractInstance } = web3State;

    const [displayStartTime, setDisplayStartTime] = useState("Time not Displayed");
    const [displayEndTime, setDisplayEndTime] = useState("Time not Displayed");
  

    useEffect(() => {
        const fetchStartTime = async () => {
          try {
            const startTimeInSeconds = await contractInstance.startTime(); // Assume this returns a BigInt
            const startTimeInMs = startTimeInSeconds * 1000n; // Convert seconds to milliseconds in BigInt
            const formattedTime = new Date(Number(startTimeInMs)).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true // Enable 12-hour format with AM/PM
            });
            setDisplayStartTime(formattedTime);
          } catch (error) {
            console.error("Error fetching start time:", error);
          }
        };
      
        if (contractInstance) {
          fetchStartTime();
        }
      }, [contractInstance]);
      
      useEffect(() => {
        const fetchEndTime = async () => {
          try {
            const endTimeInSeconds = await contractInstance.endTime();
            const endTimeInMs = endTimeInSeconds * 1000n; // Convert from seconds to milliseconds
            const formattedTime = new Date(Number(endTimeInMs)).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true // Enable 12-hour format with AM/PM
            });
            setDisplayEndTime(formattedTime);
          } catch (error) {
            console.error("Error fetching End time:", error);
          }
        };
      
        if (contractInstance) {
          fetchEndTime();
        }
      }, [contractInstance]);
      
    

  return (
    <div>

<label>Started Time:  {displayStartTime}</label>
      <br/> 
      <label>End Time: {displayEndTime}</label>
      <br/>
     
    </div>
  )
}

export default DisplayTiming