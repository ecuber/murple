function onSignIn(googleUser) {
    /**
     * First, we need to intiialize the GoogleAuth object from the Google Sign-In JS Library,
     * as well as load the gapi.client object.
     */
    const GoogleAuth = gapi.auth2.getAuthInstance();

    const response = googleUser.getAuthResponse();
    /**
     * id_token is a JWT (JSON web token). It contains the user's identification and other important
     * data needed for authorization. It arrives in this response encrypted, and we send it off to
     * the web server where it is decrypted, verified, and used.
    */
    const id_token = response.id_token;
    let access_token;

    /**
     * The following array represents the Google oauth2 scopes Murple requests access to.
     */
    const scopes = [
        "userinfo.profile",
        "userinfo.email",
        "classroom.courses.readonly",
        "classroom.coursework.me.readonly",
        "classroom.announcements.readonly"].map(scope => `https://www.googleapis.com/auth/${scope}`);
    const test_scopes = ["email", "profile", "https://www.googleapis.com/auth/classroom.courses.readonly", "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid", "https://www.googleapis.com/auth/classroom.announcements.readonly"];
    
    /**
     * Authorized is a boolean that will inform the srerver whether or not the application was 
     * authorized to access all of the scopes it requires. In the event that the user denies scope
     * access or some other error occurs, the server should take action accordingly
     * (redirect to error page, cancel user registration, etc.)
     */
    let authorized = false;

    /**
     * The following block checks whether the user has previously authorized Murple to access the 
     * required scopes. If they haven't, it will prompt them to authorize the app to access them.
     */
    if (!googleUser.hasGrantedScopes(test_scopes.join(" "))) {
        googleUser.grant({scope: scopes.join(" ")})
            .then(
                (success) => {
                    access_token = success.wc.access_token;
                },
                (fail) => {
                    authorized = false;
                }); 
    }

    authorized = googleUser.hasGrantedScopes(test_scopes.join(" ")); // Checks again after attempting to authorize

    // At this point, assuming authorized == true, the app is completely authorized to make an API request.


    /**
     * Using the gapi.client object, I can easily make a web request from Google Classroom API.
     */
    if (authorized) {
        gapi.client.classroom.courses.list({
            "courseStates": [
                "ACTIVE"
            ]
        })
        /**
         * Once the classroom server responds, I can post the data to the Murple web server where it is validated
         * and processed.
         */
            .then(res => {
                console.log("woo!");
                postData("http://localhost:3000/login", {
                    id_token: id_token,
                    authorized: authorized,
                    courses: res.result.courses
                }).then(obj => {
                    // console.log("response", obj);
                    renderHome(obj);
                });
            },
            function(err) { console.error("Execute error", err); });
    } else {
        console.error("Error: Murple is not authorized.");
    }
}

/**
 * Creates POST request to specified server via fetch. 
 * 
 * @param {String} url - URL where POST request will be made.
 * @param {Object} data - JSON object representing the data to be sent to the server.
 */
async function postData(url = "", data={}) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // application/x-www-form-urlencoded
        body: JSON.stringify(data)
    });
    return response.json();
}

/**
 * Initializes Google API Client object.
 */
async function init() {
    return gapi.client.load("https://classroom.googleapis.com/$discovery/rest?version=v1")
        .then(
            () => {
                // console.log("GAPI client loaded for API!");
                renderButton();
            },
            err => console.error("Error loading GAPI client for API", err));
}

/**
 * Runs on error
 */
function onFailure() {
    let error = document.createElement("p").innerHTML = "Failed to log in.";
    document.body.insertBefore(error, document.getElementById("welcome"));
    console.log("Failed to log in.");
}

/**
 * Signs user out and ends session.
 */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        // console.log("User signed out.");
        document.getElementById("login").style.display = "block";
        document.getElementById("signout").style.display = "none";
        location.reload();

    });
}