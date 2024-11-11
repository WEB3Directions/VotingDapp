import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const DeleteAuthorizedCandidate = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  const regIdRef = useRef(null);
  

  const deleteAuthorizedCandidate=async(e)=>{
      try{
        e.preventDefault();
        const regId = regIdRef.current.value;
        await contractInstance.deleteAuthorizedCandidateRegistration(regId)
      }catch(error){
        toast.error("Error: Request Sending for Delete")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={deleteAuthorizedCandidate}>
        <label>Delete Authorized Candidate (REG ID):
            <input type="text" ref={regIdRef}></input>
        </label>
        <br/>
     
        <button type="submit">Delete Authorized Candidate </button>
    </form>
  </>)
}
export default DeleteAuthorizedCandidate;