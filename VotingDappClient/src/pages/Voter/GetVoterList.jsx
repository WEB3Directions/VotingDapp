import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./GetVoterList.css";

const GetVoterList = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance, selectedAccount } = web3State;
  const [voterList, setVoterList] = useState([]);
  const [isCommissioner, setIsCommissioner] = useState(false);
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  useEffect(() => {
    const checkCommissioner = async () => {
      const electionCommissionAddress = "0x9F9DA9e155078BFD61Db67fD77EB61fA2f1ab79a".toLowerCase();
      setIsCommissioner(selectedAccount.toLowerCase() === electionCommissionAddress);
    };
    checkCommissioner();
  }, [selectedAccount]);

  useEffect(() => {
    const fetchVoterList = async () => {
      try {
        const allVoters = await contractInstance.getVoterList();
        setVoterList(allVoters);
      } catch (error) {
        toast.error("Error: Getting Voter List");
        console.error(error);
      }
    };

    if (contractInstance) {
      fetchVoterList();
    }
  }, [contractInstance]);

  const myVoterDetails = isCommissioner
    ? voterList
    : voterList.filter(voter => voter.voterAddress.toLowerCase() === selectedAccount.toLowerCase());

  return (
    <div className="voter-list-table-container">
      <table className="voter-list-table">
        <thead>
          <tr>
           <th className="voter-list-table-header">Name</th>
                <th className="voter-list-table-header">Address</th>
                <th className="voter-list-table-header">CNIC</th>
                <th className="voter-list-table-header">Age</th>
                <th className="voter-list-table-header">Voter ID</th>
                <th className="voter-list-table-header">Voted To</th>
                <th className="voter-list-table-header">Photo</th> 
          </tr>
        </thead>
        <tbody>
          {myVoterDetails.map((voter, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td className="voter-list-table-data">{voter.name}</td>
              <td className="voter-list-table-data">{voter.voterAddress}</td>
              <td className="voter-list-table-data">{String(voter.cnic)}</td>
              <td className="voter-list-table-data">{String(voter.age)}</td>
              <td className="voter-list-table-data">{String(voter.voterId)}</td>
              <td className="voter-list-table-data">{String(voter.voteCandidateId)}</td>

<td className="voter-list-table-data"><img width={"70px"} height={"70px"} src={`http://localhost:3000/images/VoterImages/${voter.voterAddress}.jpg`}></img></td>
</tr> 
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetVoterList;








