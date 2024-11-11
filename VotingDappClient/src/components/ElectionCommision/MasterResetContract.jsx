import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
export default function MaterResetContract() {
   const {web3State} = useWeb3Context()
   const {contractInstance} = web3State;

   const resetContract = async () => {
      try{
         await contractInstance.masterResetContract()
      }catch(error){
         toast.error("Error: Emergency Stop")
         console.error(error)
      }
      
   }

   return <button onClick={resetContract}>Master Reset Voting</button>
}