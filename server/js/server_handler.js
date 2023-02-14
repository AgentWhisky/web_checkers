const Filter = require('bad-words');
const {generateID, isAlphanumeric} = require("./server_utils");
const {Player} = require("./player");

/**
 * Class to handle server data and events
 */
class Server_handler {
    constructor(io) {
        this.io = io; // SocketIO
        this.players = {}; // UserID: Player()
        this.socketMap = {}; // SocketID: UserID

    }

    /**
     * Function to handle all socketio events
     * @param socket
     */
    socketIOEvents(socket) {
        // Handle User Login
        socket.emit('login', (userID) => {
            if(userID === null) {
                userID = generateID('p');
            }
            this.loginUser(userID, socket.id);

            let data = {
                userID: userID,
                browserData: this.getBrowserData(userID)
            }
            socket.emit('loginSuccess', (data));
        });


        // User Disconnection Event
        socket.on('disconnect', () => {
            this.logoutUser(this.socketMap[socket.id]);

            delete this.socketMap[socket.id];
        });

        // Update Username
        socket.on('updateUsername', (data, callback) => {
            let resp = this.updateUsername(data.userID, data.newUsername);
            if(resp != null) {
                // Username Update Failed
                callback(resp);
            }
        });

    }

    /**
     * Function to log in an existing user or create a new one
     * @param userID is the given userID generated previously
     * @param socketID is the current user connection socketID
     */
    loginUser(userID, socketID) {
        let player;
        // Player Exists
        if(userID in this.players) {
            player = this.players[userID];
            player.status = 'online';
            player.updateSocketID(socketID);
            player.setOnline();
        }
        // Create New Player
        else {
            this.players[userID] = new Player(socketID);
        }

        // Update SocketMap
        this.socketMap[socketID] = userID;

        // Send Update Broadcast
        this.sendUpdateBroadcast();
    }

    /**
     * Function to log out a user upon disconnection
     * @param userID is the user's ID
     */
    logoutUser(userID) {
        if(userID in this.players) {
            let player = this.players[userID];

            player.setOffline();
            player.updateSocketID(null);

            // Send Update Broadcast
            this.sendUpdateBroadcast();
        }
    }

    /**
     * Function to update the username of a user or return an error string if failed
     * @param userID is the userID to update
     * @param username is the new username (to be approved)
     * @returns {string|null} null if update succeeded or error if failed
     */
    updateUsername(userID, username) {
        let filter = new Filter();

        // Ignore Same Username
        if(this.players[userID].getUsername() === username) {
            return null;
        }

        // Username Approval Criteria
        if(this.containsUsername(username)) { // Username Exists
            return 'Username already exists';
        }

        if(!isAlphanumeric(username)) { // Is a valid Alphanumeric (Letters and numbers only)
            return 'Username must be only letters and numbers';
        }

        if(username.length > 16) { // Maximum length of 16 characters
            return 'Username must be a maximum of 16 characters';
        }

        if(filter.isProfane(username)) {
            return 'Username contains profane language';
        }

        // Valid Username Update
        this.players[userID].updateUsername(username);
        this.sendUpdateBroadcast();
        return null;

    }

    /**
     * Function to get an object of current server state for sending to client
     * @returns the current server state data
     */
    getBrowserData(userID) {
        // Get User Data
        let curUser = this.players[userID];
        let userData = {
            name: curUser.getUsername()
        }

        // Get Online Player Data
        let onlinePlayers = []
        for(const [playerID, player] of Object.entries(this.players)) {
            if(userID !== playerID && player.isOnline()) {
                onlinePlayers.push(player.getUsername());
            }
        }
        let playerData = {
            players: onlinePlayers
        }

        // Get Game Data



        // Return Data
        return {
            userData: userData,
            playerData: playerData,
            gameData: null
        }

    }


    /**
     * Function to send a broadcast to all connected users with updated server info
     */
    sendUpdateBroadcast() {
        //this.io.emit('updateBroadcast',this.getBrowserData());

        for(const [socketID, userID] of Object.entries(this.socketMap)) {
            this.io.to(socketID).emit('updateBroadcast',this.getBrowserData(userID))
        }
    }

    // Helper Functions

    /**
     * Function to determine if the given username exists
     * @param username is the username
     * @returns {boolean} if the username exists
     */
    containsUsername(username) {
        for(const player of Object.values(this.players)) {
            if(player.getUsername().toLowerCase() === username.toLowerCase()) {
                return true;
            }
        }
        return false;
    }




}

// *** Export Functions ***
module.exports = {Server_handler};