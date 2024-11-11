import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const DeleteCadidate = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  const candidateIdRef = useRef(null);
  

  const deletedCandidate=async(e)=>{
      try{
        e.preventDefault();
        const candidateId = candidateIdRef.current.value;
        await contractInstance.deleteCandidate(candidateId)
      }catch(error){
        toast.error("Error: Request Sending for Delete")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={deletedCandidate}>
        <label>Delete Candidate (ID):
            <input type="text" ref={candidateIdRef}></input>
        </label>
        <br/> 
        <button type="submit">Delete Candidate </button>
    </form>
  </>)
}
export default DeleteCadidate;