import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const DeleteAll = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  
  

  const deleteAllVoters=async(e)=>{
      try{
        e.preventDefault();
        await contractInstance.deleteAllVoter()
      }catch(error){
        toast.error("Error: Request Sending for Delete")
        console.error(error)
      }
  }

  const deleteAllCandidates=async(e)=>{
    try{
      e.preventDefault();
      await contractInstance.deleteAllCandidate()
    }catch(error){
      toast.error("Error: Request Sending for Delete")
      console.error(error)
    }
}
  return(<>
    <form onSubmit={deleteAllVoters}>
       
        <button type="submit">Delete All Voters </button>
    </form>
     <br/>

    <form onSubmit={deleteAllCandidates}>
       
    <button type="submit">Delete All Candidates </button>
</form>
</>)
}
export default DeleteAll;