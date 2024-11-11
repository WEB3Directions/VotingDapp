import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {toast} from "react-hot-toast"
const PriceToPay = ({contractInstance}) => {
   const [priceToBePay,setPriceToBePay]=useState(null)
    useEffect(()=>{
     try{
         const priceToPay = async()=>{
            const tokenPriceWei = await contractInstance.calculatedPrice();
            const tokenPriceEth = ethers.formatEther(tokenPriceWei)
            setPriceToBePay(tokenPriceEth)
         }
         contractInstance && priceToPay()
         
        }catch(error){
            toast.error("Error: Fetching Token Price")
            console.error(error)
        }
        
    },[contractInstance])
    return ( <>Calculated Tokens Price: {priceToBePay} eth</> );
}
 
export default PriceToPay;