import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"

const DeleteVoter = ()=>{
  const {web3State} = useWeb3Context()
  const {contractInstance} = web3State;
  const voterIdRef = useRef(null);
  

  const deleteVoter=async(e)=>{
      try{
        e.preventDefault();
        const voterId = voterIdRef.current.value;
        await contractInstance.deleteVoter(voterId)
      }catch(error){
        toast.error("Error: Request Sending for Delete")
        console.error(error)
      }
  }
  return(<>
    <form onSubmit={deleteVoter}>
        <label>Delete Voter (ID):
            <input type="text" ref={voterIdRef}></input>
        </label>
        <br/>
     
        <button type="submit">Delete Voter </button>
    </form>
  </>)
}
export default DeleteVoter;