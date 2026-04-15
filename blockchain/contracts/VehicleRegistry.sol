// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VehicleRegistry {
    // tokenId usually represents an expanding ID or mapped hash, we will use an auto-incrementing ID for simplicity
    uint256 private _nextTokenId;

    mapping(uint256 => address) private _owners;
    mapping(string => uint256) private _vinToTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _tokenIdToVin;

    event VehicleRegistered(uint256 indexed tokenId, string vin, address owner, string metadataURI);
    event VehicleTransferred(uint256 indexed tokenId, address from, address to);

    constructor() {
        _nextTokenId = 1;
    }

    function registerVehicle(string memory vin, string memory metadataURI) public {
        require(_vinToTokenId[vin] == 0, "Vehicle with this VIN already registered");

        uint256 tokenId = _nextTokenId++;
        
        _owners[tokenId] = msg.sender;
        _vinToTokenId[vin] = tokenId;
        _tokenIdToVin[tokenId] = vin;
        _tokenURIs[tokenId] = metadataURI;

        emit VehicleRegistered(tokenId, vin, msg.sender, metadataURI);
    }

    function transferVehicle(uint256 tokenId, address to) public {
        require(_owners[tokenId] == msg.sender, "Not the owner");
        require(to != address(0), "Invalid address");

        _owners[tokenId] = to;

        emit VehicleTransferred(tokenId, msg.sender, to);
    }

    function verifyVehicle(string memory vin) public view returns (bool, address, string memory) {
        uint256 tokenId = _vinToTokenId[vin];
        if (tokenId == 0) {
            return (false, address(0), "");
        }
        return (true, _owners[tokenId], _tokenURIs[tokenId]);
    }
}
