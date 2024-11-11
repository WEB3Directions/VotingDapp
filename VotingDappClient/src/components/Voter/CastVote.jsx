import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
import "./castVote.css"
const CastVote = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  const voterIdRef = useRef(null);
  const candidateIdRef = useRef(null);

  const voteCandidate=async(e)=>{
      try{
        e.preventDefault();
        const voterId = voterIdRef.current.value;
        const candidateId = candidateIdRef.current.value;
        await contractInstance.castVote(voterId,candidateId)
      }catch(error){
        toast.error("Error: Casting Vote")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={voteCandidate}>
        <label>Voter Id:
            <input type="text" ref={voterIdRef}></input>
        </label>
        <br/>
        <label>Candidate ID:
            <input type="text" ref={candidateIdRef}></input>
        </label>
        
        <button type="submit">Cast Vote </button>
    </form>
  </>)
}
export default CastVote;