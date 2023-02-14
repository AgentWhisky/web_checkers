
const {generateNum} = require("./server_utils");

const ONLINE = 'online';
const OFFLINE = 'offline';

/**
 * Class to store player data
 */
class Player {
    username; // Current Username
    lastSocketID;
    status;

    constructor(socketID) {
        this.username = 'player' + generateNum();
        this.lastSocketID = socketID;
        this.status = ONLINE;
    }

    /**
     * Function to update socketID
     * @param socketID
     */
    updateSocketID(socketID) {
        this.lastSocketID = socketID;
    }

    /**
     * Function to set user status as online
     */
    setOnline() {
        this.status = ONLINE;
    }

    /**
     * Function to set user status as offline
     */
    setOffline() {
        this.status = OFFLINE
    }

    /**
     * Function to check if user status is online
     * @returns {boolean}
     */
    isOnline() {
        return this.status === ONLINE;
    }

    getUsername() {
        return this.username;
    }

    /**
     * Function to update the username
     * @param username is the new username
     */
    updateUsername(username) {
        this.username = username;
    }


}

// *** Export Functions ***
module.exports = {Player};