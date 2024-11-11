import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
export default function RestartContract() {
   const {web3State} = useWeb3Context()
   const {contractInstance} = web3State;

   const restartContract = async () => {
      try{
         await contractInstance.resetVoting()
      }catch(error){
         toast.error("Error: Emergency Stop")
         console.error(error)
      }
      
   }

   return <button onClick={restartContract}>Restart voting</button>
}