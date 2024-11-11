import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const DeleteAuthorizedVoter = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  const voterCnicRef = useRef(null);
  

  const deleteAuthorizedVoter=async(e)=>{
      try{
        e.preventDefault();
        const voterCnic = voterCnicRef.current.value;
        await contractInstance.deleteVoterRegistration(voterCnic)
      }catch(error){
        toast.error("Error: Request Sending for Delete")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={deleteAuthorizedVoter}>
        <label>Delete Authorized Voter (CNIC):
            <input type="text" ref={voterCnicRef}></input>
        </label>
        <br/>
     
        <button type="submit">Delete Authorized Voter </button>
    </form>
  </>)
}
export default DeleteAuthorizedVoter;