const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const socket = io();

if($('#login_qwerty')){
    var username = document.querySelector('#input1');
    var password = document.querySelector('#input2');
    document.querySelector("#form").addEventListener("submit",async function Handle(e){
        e.preventDefault();
        await fetch("./login/v1",{
            method:"POST",
            redirect:"follow",
            body: JSON.stringify({
                username:username.value,
                password:password.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res=>{
            return res.json();
        })
        .then((data)=>{
            var token_user = data.token;
            if(!token_user){
                alert("Wrong username or password!");
                window.location.href = data.url;
            }
            else {
                var localData = JSON.stringify({
                    token:token_user,
                    date:new Date()
                });
                window.localStorage.setItem("Token",localData)
                window.location.href = data.url;
            }
        })
        .catch(err=>{throw err;})
    }) 
}

if($('#home_qwerty')){
    var Token = window.localStorage.getItem("Token");
    if(!Token){
        alert("Please login")
        window.location.href="/login";
    }
    else {
        Token = JSON.parse(Token);
        var currentDate = new Date();
        var loginDate = new Date(Token.date);

        var diffTime = currentDate - loginDate;
        diffTime /= 1000; // millisecond to second
        diffTime /= 60;   // second to minute
        diffTime /= 60;   // minute to hour
        
        if(diffTime >= 1) {/// expired
            window.localStorage.removeItem("Token");
            window.location.href = "/login";
        }
    }
    $('#boxx').addEventListener('keydown',(e)=>{
        if(e.key == "Enter") {
            var message = $('#boxx').value;
            $('#boxx').value = "";
            socket.emit("sendMessage",{content:message});
        }
    })
    socket.on("recieveMessage",(data)=>{
        var listItem = document.createElement('li');
        listItem.textContent = data.content;
        $('#message ul').append(listItem);
    })
}