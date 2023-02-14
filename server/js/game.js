GAME_STATUSES = {
    waitingToStart: 'Waiting to Start',
    inProgress: 'Game in Progress',
    gameOver: 'Game Over'
}


class Game {
    player1;
    player2;

    board;
    startTime;
    status;

    constructor(userID) {
        this.player1 = userID;
        this.player2 = null;

        this.board = null // Need to set up board

        this.startTime = new Date().getTime();
        this.status = GAME_STATUSES.waitingToStart;
    }

    isFull() {
        return (this.player1 !== null) && (this.player2 !== null);
    }
    getStatus() {
        return this.status;
    }

    getGameTime() {
        let curTime = new Date().getTime();

        return (curTime - this.startTime) * 1000 * 60;
    }

    hasPlayer(userID) {
        return (this.player1 === userID) || (this.player2 === userID);
    }

    joinGame(userID) {

    }

    leaveGame(userID) {

    }

    getData() {
        return({

        });
    }


}