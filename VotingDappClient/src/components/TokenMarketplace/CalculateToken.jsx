import { ethers } from "ethers";
import { useRef } from "react";
// import {toast} from "react-hot-toast"
const CalculateToken = ({contractInstance}) => {
    const calculateTokenAmountRef = useRef()
    const calculateToken = async(e)=>{
    //   try{
        e.preventDefault()
        const tokenValueEth = calculateTokenAmountRef.current.value;
        const tokenValueWei = ethers.parseEther(tokenValueEth,14);
        const tx = await contractInstance.calculateTokenPrice(tokenValueWei,{ gasLimit: 300000 })
        const reciept = tx.wait()
        console.log("Calculated Successful")
    //   }catch(error){
    //     toast.error("Error: Buy Token")
    //     console.error(error)
    //   }
    }
    return ( <>
    <form onSubmit={calculateToken}>
      <label>Calculate Token price (In Eth): </label>
      <input type="text" ref={calculateTokenAmountRef}></input>
      <button type="submit">Calculate</button>
    </form>
    </>);
}
 
export default CalculateToken;