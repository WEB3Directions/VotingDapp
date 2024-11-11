import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { toast } from "react-hot-toast";

const RegisterAuthorizedVoter = () => {
    const { web3State } = useWeb3Context();
    const { contractInstance } = web3State;
    console.log(contractInstance);
    
    const nameRef = useRef(null);
    const cnicRef = useRef(null);
    const addressRef = useRef(null);

    const handleVoterAuthorization = async (e) => {
        e.preventDefault();
        try {
            const name = nameRef.current.value;
            const cnic = cnicRef.current.value;
            const address = addressRef.current.value;

            if (!contractInstance) {
                throw new Error("Contract instance not found!");
            }

            await contractInstance.addAuthorizedVoter(name, address, cnic);

            // Clear the form after successful registration
            nameRef.current.value = "";
            addressRef.current.value = "";
            cnicRef.current.value = "";

            toast.success("Registration Successful");
        } catch (error) {
            toast.error("Error registering Voter: " + error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <br />
            <form onSubmit={handleVoterAuthorization}>

            <label>Add Authorized Voter Name:</label>
                <input type="text" ref={nameRef} required />

                <label>Add Authorized Voter CNIC :</label>
                <input type="text" ref={cnicRef} required />

                <label>Add Authorized Voter Address:</label>
                <input type="text" ref={addressRef} required />

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterAuthorizedVoter;
