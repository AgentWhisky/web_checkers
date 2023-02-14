'use strict';

const e = React.createElement;

// Client States
const STATES = {
    login: 0,
    browser: 1,
    game: 2
};

const USERNAME_INPUT = 'uInput';

class Client extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clientState: STATES.login,
            userID: null, // Holds the current userID
            browserData: null // Holds all data for the browser state
        };

        // SocketIO
        this.socket = io();
        this.socketIOEvents();

        // * Bind Events *
        this.onUpdateUsername = this.onUpdateUsername.bind(this);



    }
    // *** SocketIO Events ***
    /**
     * Function to bind client SocketIO Events
     */
    socketIOEvents() {
        // Login Response Event
        this.socket.on('login', (callback) => {
            let id = getCookie('userID');

            callback(id);
        });

        // Login Success Event
        this.socket.on('loginSuccess', (data) => {
            this.setState({
                userID: data.userID,
                clientState: STATES.browser,
                browserData: data.browserData
            });

            setCookie('userID', data.userID);

            console.log(data.userID);
            console.log(data.browserData);
        });

        // Server Update Broadcast
        this.socket.on('updateBroadcast', (browserData) => {
            this.setState({
                browserData: browserData
            });
        });
    }

    // *** React Events ***
    /**
     * Function to handle username update event
     * @param event
     */
    onUpdateUsername(event) {
        event.preventDefault();

        let newUsername =  document.getElementById(USERNAME_INPUT).value

        if(newUsername === "") {
            return;
        }

        let updateData = {
            userID: this.state.userID,
            newUsername: newUsername
        }
        this.socket.emit('updateUsername', updateData, (failReason) =>{
            alert(`Username update failed: ${failReason}`);
        });
    }




    // *** Build Components ***
    /**
     * Function to build User Display Element
     * Includes Display Name and Method to modify username
     * @returns {JSX.Element} the User Display Element
     */
    buildUserDisplay() {
        return (
            <div className='user_info'>
                <h3>{this.state.browserData.userData.name}</h3>
                <div>
                    <input type="text" id={USERNAME_INPUT} placeholder='Change Username'/>
                    <button onClick={this.onUpdateUsername}>Update</button>
                </div>
            </div>
        );
    }

    /**
     * Function to build the Player List Display
     * @returns {JSX.Element} the Player Display Element
     */
    buildPlayersDisplay() {
        let onlinePlayers = [];

        for(const player of this.state.browserData.playerData.players) {
            onlinePlayers.push(<label key={Math. random()}>{player}</label>);
        }

        if(onlinePlayers.length === 0) {
            onlinePlayers = <label>No Players Online</label>
        }

        return (<div className='online_players'>
            <h3>Online Players</h3>
            {onlinePlayers}
        </div>);
    }

    /**
     * Function to build the active games display
     * @returns {JSX.Element} the Active Games Display Element
     */
    buildActiveGamesDisplay() {
        return(<div className='active_games'>
            <h3>In Progress Games</h3>
            <label>No active games</label>
            <button>Create New Game</button>
        </div>);
    }

    /**
     * Function to build the Browser Display
     * @returns {JSX.Element} is the browser display element
     */
    buildBrowserDisplay() {
        return(<div className='browser'>
            {this.buildUserDisplay()}
            {this.buildActiveGamesDisplay()}
            {this.buildPlayersDisplay()}
        </div>);
    }


    // *** Page Render Functions ***
    /**
     * Function to build the client-side webapp
     * @returns {JSX.Element} is the build web-app
     */
    buildApp() {
        let app;
        if(this.state.clientState === STATES.login) {
            app = <h2>Connecting... Please Wait</h2>
        }

        else if(this.state.clientState === STATES.browser) {
            app = <div>
                {this.buildBrowserDisplay()}
            </div>
        }
        else {
            app = <h2>State Error</h2>
        }

        return app;
    }



    // *** Main Render Function ***
    /**
     * Function to render the app
     * @returns {JSX.Element}
     */
    render() {
        return (this.buildApp());
    }
}





// *** Render App ***
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Client));