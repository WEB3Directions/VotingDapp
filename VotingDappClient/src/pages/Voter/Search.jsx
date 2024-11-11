import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import "./Search.css";
import { useWeb3Context } from "../../context/useWeb3Context";

export default function Search() {
   const { web3State } = useWeb3Context();
   const { contractInstance } = web3State;
   const [voterList, setVoterList] = useState([]);

   const cnicRef = useRef(null); 

   const fetchVoterList = async (event) => {
      // Prevent the default form submission behavior
      event.preventDefault(); 

      const cnic = cnicRef.current.value; // Get CNIC as a string and trim whitespace

      

      try {
         // Fetch the voter data from the contract
         const voterList = await contractInstance.searchAuthorizedVoterbyCnic(cnic);
      
            setVoterList(voterList); // Wrap the voter data in an array
         
      } catch (error) {
         toast.error("Error fetching voter details");
         console.error("Error details:", error);
         // Display detailed error message if available
         if (error.message) {
            toast.error(`Detailed error: ${error.message}`);
         }
      }
   };

   return (
      <> 
         <div>
            <form onSubmit={fetchVoterList}>
               <br/>
               <label>Enter CNIC to Search Authorized Voter Detail:</label>
               <input type="text" ref={cnicRef} required />
               <button type="submit">Search Voter Details</button>
            </form>
         </div>

         <div className="candidate-list-table-container">
            {voterList.length !== 0 ? (
               <table className="candidate-list-table">
                  <thead>
                     <tr>
                        <th className="candidate-list-table-header">Name</th>
                        <th className="candidate-list-table-header">Address</th>
                        <th className="candidate-list-table-header">CNIC</th>
                     </tr>
                  </thead>
                  <tbody>
                     {voterList.map((voter, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                           <td className="candidate-list-table-data">{voter.name}</td>
                           <td className="candidate-list-table-data">{voter.voterAddress}</td>
                           <td className="candidate-list-table-data">{String(voter.cnic)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <p>No Authorized voter Found!</p>
            )}
         </div>
      </>
   );
}
