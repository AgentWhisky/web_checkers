// Cookie Settings
const cookieDays = 100;

// Function to set a given cookieName with a given value
function setCookie(cookieName, cookieValue) {
    const date = new Date();
    date.setTime(date.getTime() + (cookieDays*24*60*60*1000));
    let expires = "expires=" + date.toUTCString();

    document.cookie = cookieName + "=" + cookieValue + ";" + expires;
    console.log(`cookie:${date}`)
}

// Function to read a given cookieName
function getCookie(cookieName) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}