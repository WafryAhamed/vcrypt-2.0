// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VehicleRegistry {
    struct Vehicle {
        string vin;
        address owner;
        uint256 createdAt;
        bool isActive;
    }

    uint256 private _nextTokenId;

    mapping(uint256 => Vehicle) private _vehicles;
    mapping(string => uint256) private _vinToTokenId;

    event VehicleRegistered(uint256 indexed tokenId, string vin, address owner);
    event VehicleTransferred(uint256 indexed tokenId, address from, address to);

    constructor() {
        _nextTokenId = 1;
    }

    function registerVehicle(string memory vin, string memory /*metadataURI*/) public {
        require(_vinToTokenId[vin] == 0, "Vehicle with this VIN already registered");

        uint256 tokenId = _nextTokenId++;
        
        _vehicles[tokenId] = Vehicle({
            vin: vin,
            owner: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });

        _vinToTokenId[vin] = tokenId;

        // Ignoring metadataURI as requested in the struct mapping, however the function parameter is still requested to remain unchanged. Emitting without metadataURI as requested in event structure.
        emit VehicleRegistered(tokenId, vin, msg.sender);
    }

    function transferVehicle(uint256 tokenId, address to) public {
        require(_vehicles[tokenId].owner == msg.sender, "Not the owner");
        require(to != address(0), "Invalid address");

        address previousOwner = _vehicles[tokenId].owner;
        _vehicles[tokenId].owner = to;

        emit VehicleTransferred(tokenId, previousOwner, to);
    }

    function verifyVehicle(string memory vin) public view returns (bool) {
        uint256 tokenId = _vinToTokenId[vin];
        if (tokenId == 0) {
            return false;
        }
        return _vehicles[tokenId].isActive;
    }

    function getVehicle(uint256 tokenId) public view returns (Vehicle memory) {
        require(_vehicles[tokenId].createdAt != 0, "Vehicle does not exist");
        return _vehicles[tokenId];
    }
}
