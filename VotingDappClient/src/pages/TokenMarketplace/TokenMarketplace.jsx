import { useWeb3Context } from "../../context/useWeb3Context";
import { useEffect,useState } from "react";
import { ethers } from "ethers";

import BuyToken from "../../components/TokenMarketplace/BuyToken";
import SellToken from "../../components/TokenMarketplace/SellToken";
import TokenBalance from "../../components/TokenMarketplace/TokenBalance";
import TokenPrice from "../../components/TokenMarketplace/TokenPrice";



import tokenMarketplaceAbi from "../../constant/tokenMarketplaceAbi.json"
import erc20abi from "../../constant/erc20Abi.json"

import {toast} from "react-hot-toast"
import CalculateToken from "../../components/TokenMarketplace/CalculateToken";
import PriceToPay from "../../components/TokenMarketplace/PriceToPay";
import ContractBalance from "../../components/TokenMarketplace/ContractBalance";


//founder - 0x4653CeA34af4B3cF4B27C912A5BBEE015b9E7Fb0
const TokenMarketplace = () => {
    const [tokenMarketplaceInstance,setTokenMarketplaceInstance]=useState(null)
    const [erc20ContractInstance,setErc20ContractInstance]=useState(null)
    const {web3State}=useWeb3Context()
    const {signer,provider}=web3State;
    
    useEffect(()=>{
        const erc20TokenInit = ()=>{
            try{
                const contractAddress = "0xf260eF4656362DD84eCc5462E370B5C57e52dd71"
                const erc20ContractInstance = new ethers.Contract(contractAddress,erc20abi,provider)
                setErc20ContractInstance(erc20ContractInstance)
            }catch(error){
                toast.error("Error start the vote")
            }
        }
        provider && erc20TokenInit()
    },[provider])
    
    useEffect(()=>{
        const tokenMarketplaceInit= ()=>{
            try{
                const tokenMarketplaceContractAddress = "0xEc5b5ca37d7cFb90657a1E57355907f07E71e504";
                const tokenMarketplaceInstance = new ethers.Contract(tokenMarketplaceContractAddress,tokenMarketplaceAbi,signer)
                setTokenMarketplaceInstance(tokenMarketplaceInstance)
            }catch(error){
                toast.error("Error: Token Marketplace")
                console.error(error)
            }
        }
        signer && tokenMarketplaceInit()
    },[signer])

    return (
    <>
     <ContractBalance contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <TokenBalance erc20ContractInstance={erc20ContractInstance}/>
     <br/>
     <TokenPrice contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <br/>
     <BuyToken contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <SellToken erc20ContractInstance={erc20ContractInstance} contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <CalculateToken contractInstance ={tokenMarketplaceInstance}/>
     <PriceToPay contractInstance ={tokenMarketplaceInstance}/>
     
    </>);
}
 
export default TokenMarketplace;