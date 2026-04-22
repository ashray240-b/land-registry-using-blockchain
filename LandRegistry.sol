// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    struct Land {
        uint256 landId;
        string ownerName;
        string location;
        uint256 price;
        address owner;
        bool exists;
    }

    mapping(uint256 => Land) private lands;
    uint256[] private landIds;

    // Register new land
    function registerLand(
        uint256 _landId,
        string memory _ownerName,
        string memory _location,
        uint256 _price
    ) public {

        require(!lands[_landId].exists, "Land already exists");

        lands[_landId] = Land(
            _landId,
            _ownerName,
            _location,
            _price,
            msg.sender,
            true
        );

        landIds.push(_landId);
    }

    // Check if land exists
    function isLandRegistered(uint256 _landId)
        public
        view
        returns (bool)
    {
        return lands[_landId].exists;
    }

    // Get land details
    function getLand(uint256 _landId)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            address
        )
    {
        require(lands[_landId].exists, "Land does not exist");

        Land memory land = lands[_landId];

        return (
            land.landId,
            land.ownerName,
            land.location,
            land.price,
            land.owner
        );
    }

    // Transfer ownership
    function transferLand(
        uint256 _landId,
        address _newOwner,
        string memory _newOwnerName
    ) public {

        require(lands[_landId].exists, "Land does not exist");
        require(msg.sender == lands[_landId].owner, "Not land owner");

        lands[_landId].owner = _newOwner;
        lands[_landId].ownerName = _newOwnerName;
    }

    // Get all land IDs
    function getAllLandIds()
        public
        view
        returns (uint256[] memory)
    {
        return landIds;
    }
}