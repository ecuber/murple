function renderHome(res) {
    document.getElementById("login").style.display = "none";
    document.getElementById("signout").style.display = "block";
    document.getElementById("welcome").innerHTML = `Welcome, ${res.nickname ? res.nickname : res.name.split(" ")[0]}!`;
    // document.getElementById("icon").src = res.icon;
    document.getElementById("classhead").innerHTML = "Your classes";
    loadCourses(res, "list");
    loadCourses(res, "archive", true);

}

function loadCourses(res, table_id, archived = false) {
    let courses = ["<thead><tr><th>Class Title</th><th>Class Code</th><th>Actions</th></tr></thead><tbody>"];
    let buttons = [];

    res.courses.forEach(course => {
        if (course.archived == archived) {
            let button = document.createElement("button");
            button.innerHTML = archived ? "Restore Class": "Archive Class";
            button.onclick = () => archive(res.uuid, course.id);
            buttons.push({id: `${archived ? "arch" : "live"}${buttons.length}`, element: button });
            courses.push(`<tr><td>${course.name}</td><td>${course.enrollmentCode}</td><td><button id=${archived ? "arch" : "live"}${buttons.length - 1}></td></tr>`);
        }
    });
    courses.push("</tbody>");
    document.getElementById(table_id).innerHTML = courses.join("");

    buttons.forEach(button => {
        console.log(button);
        let element = document.getElementById(button.id);
        element.innerHTML = button.element.innerHTML;
        element.onclick = button.element.onclick;

    });

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
