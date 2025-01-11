function logOut(){
   let logstatus = sessionStorage.getItem('isLoggedIn');
   logstatus = false;
   sessionStorage.setItem('isLoggedIn', logstatus);
   checkGuestLogOut()
};

function checkGuestLogOut(){
    let status = localStorage.getItem('logInStatus');
    if(status){
        localStorage.removeItem('logInStatus')
    };
};
////// displaynone adden