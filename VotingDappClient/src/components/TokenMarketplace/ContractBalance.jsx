import {ethers}  from "ethers";

import { useEffect,useState } from "react";
// import { useWeb3Context } from "../../context/useWeb3Context";
import {toast} from "react-hot-toast"
const ContractBalance = ({contractInstance}) => {
    
    
    const [contractTokenBalance,setContractTokenBalance]=useState("0")
    useEffect(()=>{
        const fetchContractTokenBalance = async()=>{
        try{
            const tokenBalanceWei = await contractInstance.balancesOf();
            console.log(tokenBalanceWei)
            const tokenBalanceEth = ethers.formatEther(tokenBalanceWei)
            setContractTokenBalance(tokenBalanceEth)
        }catch(error){
            toast.error("Error: Getting Token Balance")
            console.error(error)
          }
        } 
        contractInstance && fetchContractTokenBalance()
    },[contractInstance])
    return (<>Contract Tokens Balance: {contractTokenBalance}</>);
}
 
export default ContractBalance;