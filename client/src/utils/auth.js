function addUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function addToken(token) {
    localStorage.setItem("token", token);
}

function removeUserData() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

function isAuthenticated(){
    let token = localStorage.getItem("token");
    return token!==null;
}

function getUser(){
    let user = localStorage.getItem("user");
    return JSON.parse( user );
}

function getToken(){
    let user = localStorage.getItem("token");
    return user;
}

function isAdmin(){
    let user = localStorage.getItem("user");
    if(isAuthenticated()){
        return user.role === "Admin";
    }
    return false;
}

export { addUser, addToken, removeUserData, isAuthenticated, getToken,  getUser, isAdmin }