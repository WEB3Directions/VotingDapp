// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Account 1   0x9F9DA9e155078BFD61Db67fD77EB61fA2f1ab79a
//Account 2   0xf70eaBA8763943875BcA9f761A2927e89E59e338
//Account 3   0xC93CB56f9dc120feDF17dc93b6C8b3F1d83200b7
//Account 4   0x5044BF18eC0E53921B4f658597771b217F69825c
//Account 5   0xd5aa173674eE863bBb714c27B0B1E677A41027c5
//Account 6   0xC2A614AF2d4497b9149AfeC63d79577348c55F55
//Account 7   0x32a83E7a6F973DaaCC2B9D13E45008F450E9eE4b
//Account 8   0xBbCCD46a114181a49ef420763AF56d6117Ad480D
//Account 9   0xe44468F495C1f1d51eeEafF87220280Cee4c3c70
//Account 10  0xf85c56Ea7b584a2E428CD017541b1F914db84BF7

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vote {

//Candidates Authorized to Register  
  struct AuthorizedCandidate {
    address candidateAddress;
    string  name;
    uint   regId;
  }

//Voters Authorized to Register 
  struct AuthorizedVoters {
   string name;
   address voterAddress;
   uint cnic;
  }

//first entity
  struct Voter {
    string name;
    uint age;
    uint voterId;
    Gender gender;
    uint voteCandidateId; //candidate id to whom the voter has voted
    address voterAddress; //EOA of the voter
    uint cnic;
  }

//second entity
  struct Candidate {
    string name;
    string party;
    uint age;
    Gender gender;
    uint candidateId;
    address candidateAddress;//candidate EOA
    uint votes; //number of votes
  }

//third entity
  address public electionCommission;
  address public winner;
  uint nextVoterId = 1;
  uint nextCandidateId = 1;
  uint nextCnic;

//voting period
  uint public  startTime;
  uint public  endTime;

  mapping(uint=>bool) mathcedIds;
  mapping(uint => Voter) voterDetails;
  mapping(uint=>bool) public isCandidateExist;
  mapping(uint => Candidate) candidateDetails;
  mapping(uint=>address) public  searchVoterAddress; 
  mapping(address => mapping(uint=>bool)) public IsCnicValid;

  uint[] private availableVoterIds;
  uint[] private availableCandidateIds;
  uint[] private availableVoterRegistrationCnic;

// IERC20 public gldToken;

  enum VotingStatus {NotStarted, InProgress, Ended}
  enum Gender {NotSpecified, Male, Female, Other}

  VotingStatus public votingStatus;


  constructor() {
    // gldToken = IERC20(_gldToken);
    electionCommission=msg.sender;//msg.sender is a global variable
  }

  modifier isVotingOver() {
    require(block.timestamp<=endTime);
    _;
  }

  modifier onlyCommissioner() {
    require(msg.sender==electionCommission,"Not authuorized");
    _;
  }

  modifier isValidAge(uint _age){
    require(_age>=18 && _age<=100,"not eligible for voting");  
    _;
  }

  function registerCandidate(
    string calldata _name,
    string calldata _party,
    uint _age,
    Gender _gender
  ) external isValidAge(_age) {
    require(votingStatus != VotingStatus.Ended, "Sorry Voting Ended");
    require(votingStatus != VotingStatus.InProgress, "Registration time out");
    require(isCandidateNotRegistered(msg.sender), "You are already registered");
    require(isVoterNotRegistered(msg.sender), "You are already registered as a Voter");
    require(nextCandidateId < 10, "Candidate Registration Full");
    require(isCandidateAuthorized(msg.sender), "You are not Authorized to Register as a Candidate");   
    require(msg.sender != electionCommission, "Election Commissioner not allowed to register as a Candidate");
    uint candidateId;
      if (availableCandidateIds.length > 0) {
        // Reuse the last available ID
        candidateId = availableCandidateIds[availableCandidateIds.length - 1];
        availableCandidateIds.pop(); // Remove it from available IDs
      } else {
        candidateId = nextCandidateId; // Use the next available ID
        nextCandidateId++;
      }

    candidateDetails[candidateId] = Candidate({
        name: _name,
        party: _party,
        gender: _gender,
        age: _age,
        candidateId: candidateId,
        candidateAddress: msg.sender,
        votes: 0
    }); 

    isCandidateExist[candidateId] = true; 

   
  }

  
  AuthorizedCandidate[] public  authorizedCandidates;

  function addAuthorizedCandidate(address _address, string memory _name, uint _regId) public onlyCommissioner {
    require(mathcedIds[_regId] == false, "Registration Id should not be same");
    require(isAuthorizedCandidateRegistered(_address), "This candidate is already Authorized");
    authorizedCandidates.push(AuthorizedCandidate({
      candidateAddress: _address,
            name: _name,
            regId: _regId
    }));
    mathcedIds[_regId] = true;
  }
  
  
   AuthorizedVoters[] public authorizedVoters;

  function addAuthorizedVoter(string memory _name, address _address, uint _cnic) public onlyCommissioner {
  require(isVoterAuthorizedCnic(_cnic), "CNIC already registered");
  require(IsCnicValid[_address] [_cnic] == false, "The CNIC pertains to another voter");
  require(isAuthorizedVoterRegistered(_address), "This voter is already Authorized");
  require(_cnic >= 1000000000000 && _cnic <= 9999999999999, "CNIC must be 13 digits long");
  authorizedVoters.push(AuthorizedVoters({ name: _name, voterAddress: _address, cnic: _cnic}));
  searchVoterAddress[_cnic] = _address;
  IsCnicValid[_address] [_cnic] = true;
  }


  function searchAuthorizedVoterbyCnic(uint _cnic) public view onlyCommissioner returns (AuthorizedVoters[] memory) {
    // First, count how many authorized voters have the specified CNIC
    uint count = 0;
    for (uint i = 0; i < authorizedVoters.length; i++) {
        if (authorizedVoters[i].cnic == _cnic) {
            count++;
        }
    }

    // Create an array to hold the authorized voters that match the CNIC
    AuthorizedVoters[] memory matchedVoters = new AuthorizedVoters[](count);
    uint index = 0;

    // Populate the matchedVoters array
    for (uint i = 0; i < authorizedVoters.length; i++) {
        if (authorizedVoters[i].cnic == _cnic) {
            matchedVoters[index] = authorizedVoters[i];
            index++;
        }
    }

    return matchedVoters;
  }

  function isVoterAuthorized(address _voterAddress) private view returns (bool) {
    for (uint i = 0; i < authorizedVoters.length; i++) {
      if (authorizedVoters[i].voterAddress == _voterAddress) {
                return true;
      }
    }
        return false;
  }

  function isAuthorizedVoterRegistered(address _voterAddress) private view returns (bool) {
    for (uint i = 0; i < authorizedVoters.length; i++) {
      if (authorizedVoters[i].voterAddress == _voterAddress) {
                return false;
      }
    }
        return true;
  }
  

function isAuthorizedCandidateRegistered(address _voterAddress) private view returns (bool) {
    for (uint i = 0; i < authorizedCandidates.length; i++) {
      if (authorizedCandidates[i].candidateAddress == _voterAddress) {
                return false;
      }
    }
        return true;
  }

  //To Authorized voter Registration
   function isVoterAuthorizedCnic(uint _cnic) private view returns (bool) {
   for (uint i = 0; i < authorizedVoters.length; i++) {
      if (authorizedVoters[i].cnic == _cnic) {
                return false;
      }
    }
        return true;
  }


  function isCandidateAuthorized(address _candidateAddress) private view returns (bool) {
    for (uint i = 0; i < authorizedCandidates.length; i++) {
      if (authorizedCandidates[i].candidateAddress == _candidateAddress) {
                return true;
      }
    }
        return false;
  }

  function isCandidateNotRegistered(address _person) private view returns (bool) {
    for(uint i=1;i<nextCandidateId;i++){
       if(candidateDetails[i].candidateAddress==_person){
          return false;
       }
    }
    return true;
  }

  function getCandidateList() public view returns (Candidate[] memory) {
   Candidate[] memory candidateList = new Candidate[](nextCandidateId - 1); //initialize an empty array of length = `nextCandidateId - 1`
    for(uint i = 0; i < candidateList.length; i++){
        candidateList[i] = candidateDetails[i + 1];
    }
    return candidateList;
  }

  function isVoterNotRegistered(address _person) private view returns (bool) {
    for(uint i=1;i<nextVoterId;i++){
        if(voterDetails[i].voterAddress==_person){
            return false; 
        }
    }

    return true;
  }

  function registerVoter(
    string calldata _name,
    uint _age,
    Gender _gender,
    uint _cnic
  ) external isValidAge(_age) {
    require(votingStatus != VotingStatus.Ended, "Sorry Voting Ended");
    require(isVoterNotRegistered(msg.sender), "You are already registered");
    require(isCandidateNotRegistered(msg.sender), "You are already registered as a Candidate");
    require(isVoterAuthorized(msg.sender), "You are not Authorized to register as a Voter");
    require(IsCnicValid[msg.sender] [_cnic] == true, "CNIC number not matched");

    uint voterId;
    if (availableVoterIds.length > 0) {
        // Reuse the last available ID
        voterId = availableVoterIds[availableVoterIds.length - 1];
        availableVoterIds.pop(); // Remove it from available IDs
    } else {
        voterId = nextVoterId; // Use the next available ID
        nextVoterId++;
    }
    voterDetails[voterId] = Voter({
        name: _name,
        age: _age,
        voterId: voterId,
        gender: _gender,
        voteCandidateId: 0,
        voterAddress: msg.sender,
        cnic: _cnic
    });
  }

  function getVoterList() public view returns (Voter[] memory) {
    uint lengthArr=nextVoterId-1;
    Voter[] memory voterList = new Voter[](lengthArr);
    for(uint i=0;i<voterList.length;i++){
     voterList[i]=voterDetails[i+1];
    }
   return voterList;
  }

  function castVote(uint _voterId, uint _candidateId) external isVotingOver(){
 // require (gldToken.balanceOf(msg.sender)>0, "not allowed");
    require(block.timestamp >= startTime, "Voting has not started yet");
    require(votingStatus == VotingStatus.InProgress, "Voting has not Started");
    require(voterDetails[_voterId].voteCandidateId==0,"You have already voted");  
    require(voterDetails[_voterId].voterAddress==msg.sender,"You are not authourized");
    require(_candidateId>=1 && _candidateId <10,"Candidate Id is not correct");
    require(isCandidateExist[_candidateId] == true, "Candidate does not Exists");
    voterDetails[_voterId].voteCandidateId = _candidateId; //voting to _candidateId
    candidateDetails[_candidateId].votes++; //increment _candidateId votes
  }

  function setVotingPeriod(uint _startTime, uint _endTime) external onlyCommissioner() {
    require(_startTime >= block.timestamp - 180, "Past Date not Accepted");
    uint adjustedStartTime = _startTime + 3600; // Adjust start time
    require(_endTime > adjustedStartTime && _endTime < (adjustedStartTime + 82800), "Invalid Voting Period");  
    startTime = _startTime; // Update startTime
    endTime = _endTime; // Set endTime
    require(votingStatus == VotingStatus.NotStarted);
    votingStatus = VotingStatus.InProgress;
  }

  function announceVotingResult() public onlyCommissioner{
    require(votingStatus == VotingStatus.InProgress);
   uint max=0;
   for(uint i=1;i<nextCandidateId;i++){
    if(candidateDetails[i].votes>max){
        max=candidateDetails[i].votes;
        winner=candidateDetails[i].candidateAddress;
      }

      startTime = 0;
      endTime = 0;
      votingStatus = VotingStatus.Ended;    
    }
  }

  // function emergencyStopVoting() public onlyCommissioner() {
  //   require(votingStatus == VotingStatus.InProgress);
  //   startTime = 0;
  //   endTime = 0;
  //   votingStatus = VotingStatus.Ended;
  // }

  function timesNow() public view returns(uint) {
    return block.timestamp;
  }

  function resetVoting() public onlyCommissioner(){
    require(votingStatus == VotingStatus.InProgress || votingStatus == VotingStatus.Ended);

    for(uint i=1;i<nextCandidateId;i++){
      if(candidateDetails[i].votes>0){
        candidateDetails[i].votes=0;      
      }    
    }
    
    for(uint i=1;i<nextVoterId;i++){
      if(voterDetails[i].voteCandidateId>0){
        voterDetails[i].voteCandidateId=0;      
      }    
    }

    winner = address(0);
    startTime = 0;
    endTime = 0;
    votingStatus = VotingStatus.NotStarted;
  }

  function deleteVoter(uint _voterId) public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");
    require(_voterId < nextVoterId, "Voter ID does not exist");
    delete voterDetails[_voterId];
    availableVoterIds.push(_voterId); // Add to available IDs
  }

  function deleteCandidate(uint _candidateId) public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while Voting in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");
    require(_candidateId < nextCandidateId, "Candidate ID does not exist");
    delete candidateDetails[_candidateId];
    availableCandidateIds.push(_candidateId); // Add to available IDs
  }

 function deleteVoterRegistration(uint _cnic) public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");

    // Find the index of the voter with the given CNIC
    for (uint i = 0; i < authorizedVoters.length; i++) {
        if (authorizedVoters[i].cnic == _cnic) {
            // Reset the CNIC validity in IsCnicValid mapping
            address voterAddress = authorizedVoters[i].voterAddress;
            IsCnicValid[voterAddress][_cnic] = false; // Mark CNIC as no longer valid

            // Delete the voter
            delete authorizedVoters[i];
            
            // Move the last element into the place of the deleted element to avoid gaps
            if (i < authorizedVoters.length - 1) {
                authorizedVoters[i] = authorizedVoters[authorizedVoters.length - 1];
            }
            authorizedVoters.pop(); // Remove the last element
            return;
        }
    }

    revert("Voter with given CNIC not found");
}

function deleteAuthorizedCandidateRegistration(uint _regId) public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");

    // Find the index of the candidate with the given registration ID
    for (uint i = 0; i < authorizedCandidates.length; i++) {
        if (authorizedCandidates[i].regId == _regId) {
            // Delete the candidate
            delete authorizedCandidates[i];
            
            // Move the last element into the place of the deleted element to avoid gaps
            if (i < authorizedCandidates.length - 1) {
                authorizedCandidates[i] = authorizedCandidates[authorizedCandidates.length - 1];
            }
            authorizedCandidates.pop(); // Remove the last element
            return;
        }
        authorizedCandidates[i].regId = 0;
    }

    revert("Candidate with given Registration ID not found");
}


  function deleteAllVoter() public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");
      for (uint i = 1; i < nextVoterId; i++) {
        delete voterDetails[i];   
        nextVoterId = 1;   
      }
  }
  
  function deleteAllCandidate() public onlyCommissioner {
    require(votingStatus != VotingStatus.InProgress, "Cannot delete while Voting in progress");
    require(votingStatus != VotingStatus.Ended, "Voting Ended");
      for (uint i = 1; i < nextCandidateId; i++) {
        delete candidateDetails[i];  
        nextCandidateId = 1;    
      }
  }
  
  function masterResetContract() public onlyCommissioner {
    require(votingStatus == VotingStatus.InProgress || votingStatus == VotingStatus.Ended);

    // Delete all candidates
    for (uint i = 1; i < nextCandidateId; i++) {
        delete candidateDetails[i];      
    }
    
    // Reset candidate ID counter
    nextCandidateId = 1;

    // Delete all voters
    for (uint i = 1; i < nextVoterId; i++) {
        delete voterDetails[i];      
    }
    
    // Reset voter ID counter
    nextVoterId = 1;


    // Reset winner and status
    winner = address(0);
    startTime = 0;
    endTime = 0;
    votingStatus = VotingStatus.NotStarted;
  }
  

}

