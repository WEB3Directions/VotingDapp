import { useEffect} from "react";

import { useNavigate } from "react-router-dom";

import CastVote from "../../components/Voter/CastVote";



const CastVotings = ()=>{

  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  return(<div>
    <br/>
     
    <CastVote/>
   
  </div>)
}
export default CastVotings;