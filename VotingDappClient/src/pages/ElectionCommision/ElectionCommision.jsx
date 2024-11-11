import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VotingStatus from "../../components/ElectionCommision/VotingStatus";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";
import AnnounceWinner from "../../components/ElectionCommision/AnnounceWinner";
import EmergencyDeclare from "../../components/ElectionCommision/EmergencyDeclare";
import VotingTimePeriod from "../../components/ElectionCommision/VotingTimePeriod";
import RestartContract from "../../components/TokenMarketplace/RestartContract";
import DeleteVoter from "../../components/ElectionCommision/DeleteVoter";
import DeleteCadidate from "../../components/ElectionCommision/DeleteCandidate";
import { useWeb3Context } from "../../context/useWeb3Context";
import DisplayTiming from "../../components/ElectionCommision/DisplayTiming";
import RegisterAuthorizedCandidates from "../../components/ElectionCommision/RegisterAuthorizedCandidates";
import RegisterAuthorizedVoter from "../../components/ElectionCommision/RegisterAuthorizedVoter";
import MaterResetContract from "../../components/ElectionCommision/MasterResetContract";
import DeleteAll from "../../components/ElectionCommision/DeleteAll";
import DeleteAuthorizedVoter from "../../components/ElectionCommision/DeleteVoter copy";
import DeleteAuthorizedCandidate from "../../components/ElectionCommision/DeleteAuthorizedCandidate";






const ElectionCommision = () => {
  const [isCommissioner, setIsCommissioner] = useState(false);
  const { web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    } else {
      const electionCommissionAddress = "0x9F9DA9e155078BFD61Db67fD77EB61fA2f1ab79a".toLowerCase(); // Ensure this is in lowercase
      const userAddress = selectedAccount ? selectedAccount.toLowerCase() : null; // Use selectedAccount directly

      if (userAddress) {
        setIsCommissioner(userAddress === electionCommissionAddress);
      } else {
        navigateTo("/"); // Redirect if user address is missing
      }
    }
  }, [navigateTo, token, selectedAccount]); // Add selectedAccount to dependencies

  return (
    <>
      {/* Always visible to everyone */}
      <VotingStatus />
      <DisplayResult />
      <DisplayTiming/>

      {/* Only render the following components if the user is the election commissioner */}
      {isCommissioner && (
        <>
        <hr/>
        <br/> 
        <h3>SET THE PERIOD FOR VOTING</h3>
        <p>Note: Voting period should be greater than 1 hour and less the 24 hours</p>
          <br/> 
          <VotingTimePeriod />
          <br/>
          <hr/>
          <br/>
          <AnnounceWinner />
          <br/>
          <EmergencyDeclare />
          <RestartContract />
          <MaterResetContract/>
          <br/>
          <br/>
          
          <hr/>
          <br/>
          <h3>AUTHORIZATION FOR CANDIDATE REGISTRATIONS</h3>
          <p>Require authorization from Election commission to register as a Candidate</p>
          
          <RegisterAuthorizedCandidates/>
          <br/> <br/> <br/>
          <h3>AUTHORIZATION FOR VOTER REGISTRATIONS</h3>
          <p>Require authorization from Election commission to register as a Voter</p>
          <RegisterAuthorizedVoter/>
          <br/>
          <br/>
          <hr/>
          <br/> <br/>
          <h3>DELETETION OF VOTER AND CANDIDATE REGISTRATIONS</h3>
          <br/>
          <DeleteAuthorizedVoter/>
          <br/>
          <DeleteAuthorizedCandidate/>
          <br/> <br/> <br/>
          <DeleteVoter />
          <br/><br/>
          <DeleteCadidate />
          <br/>
          <DeleteAll/>
          <br/><br/>
          
        </>
      )}
    </>
  );
};

export default ElectionCommision;
