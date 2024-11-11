import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { toast } from "react-hot-toast";

const VotingTimePeriod = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const startRef = useRef(null);
  const endRef = useRef(null);

 

  const handleVotingTime = async (e) => {
    try {
      e.preventDefault();
      const startTime = new Date(startRef.current.value).getTime() / 1000; // Convert to Unix timestamp (seconds)
      const endTime = new Date(endRef.current.value).getTime() / 1000; // Convert to Unix timestamp (seconds)

      console.log(startTime, endTime);
      await contractInstance.setVotingPeriod(startTime, endTime);
      console.log("Voting Time is set successfully");
    } catch (error) {
      toast.error("Error: Voting Time Period");
      console.error(error);
    }
  };

  
  return (
    <>
      <form onSubmit={handleVotingTime}>
        <label>
          Start Time:
          <input type="datetime-local" ref={startRef} />
        </label>
        <label>
          End Time:
          <input type="datetime-local" ref={endRef} />
        </label>
        <button type="submit">Register</button>
      </form>

      
    </>
  );
};

export default VotingTimePeriod;
