function renderHome(res) {
    document.getElementById("login").style.display = "none";
    document.getElementById("signout").style.display = "block";
    document.getElementById("welcome").innerHTML = `Welcome, ${res.nickname ? res.nickname : res.name.split(" ")[0]}!`;
    // document.getElementById("icon").src = res.icon;
    let courses = ["<thead><tr><th>Class Title</th><th>Class Code</th></tr></thead><tbody>"];
    res.courses.forEach(course => {
        courses.push(`<tr><td>${course.name}</td><td>${course.enrollmentCode}</td>`);
    });
    courses.push("</tbody>");
    document.getElementById("classhead").innerHTML = "You are enrolled in the following classes:";
    document.getElementById("list").innerHTML = courses.join("");

}

function renderButton() {
    gapi.signin2.render("login", {
        "scope": "profile email",
        "width": 240,
        "height": 50,
        "longtitle": true,
        "theme": "dark",
        "onsuccess": onSignIn,
        "onfailure": onFailure
    });
}
