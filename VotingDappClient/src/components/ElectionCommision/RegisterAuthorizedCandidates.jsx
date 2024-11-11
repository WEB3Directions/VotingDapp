import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { toast } from "react-hot-toast";

const RegisterAuthorizedCandidates = () => {
    const { web3State } = useWeb3Context();
    const { contractInstance } = web3State;
    console.log(contractInstance);

    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const  regIdRef = useRef(null);

    const handleCandidateAuthorization = async (e) => {
        e.preventDefault();
        try {
            const name = nameRef.current.value;
            const address = addressRef.current.value;
            const regId  = regIdRef.current.value;

            if (!contractInstance) {
                throw new Error("Contract instance not found!");
            }

            await contractInstance.addAuthorizedCandidate(address, name, regId);

            // Clear the form after successful registration
            nameRef.current.value = "";
            addressRef.current.value = "";

            toast.success("Registration Successful");
        } catch (error) {
            toast.error("Error registering candidate: " + error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <br />
            <form onSubmit={handleCandidateAuthorization}>
                <label>Add Authorized Candidate Name:</label>
                <input type="text" ref={nameRef} required />

                <label>Add Authorized Candidate Address:</label>
                <input type="text" ref={addressRef} required />
                
                <label>Add Authorized Candidate RegId:</label>
                <input type="text" ref={regIdRef} required />
                
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterAuthorizedCandidates;
