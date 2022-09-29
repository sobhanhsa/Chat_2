const chatform = document.getElementById('chat-form')
const chatmessages = document.querySelector('.chat-messages')
const roomname = document.getElementById('room-name')
const userslist = document.getElementById('users')
const socket = io()
const initialusername = localStorage.getItem("recordeduser")
const username = initialusername.split(" ")[0]
const { room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
socket.on('chatmessage', (finalmsg) => {
    outputMessage(finalmsg)
})
socket.on('roomusers', (irusers)=> {
    console.log(irusers)
    outputRoom(irusers[0].room)
    outputUsers(irusers)
})
socket.emit('verifyuser', initialusername, room)
socket.on('verifymessage', (message) => {
    //when user is not logged in
    if (message === undefined) {
        console.log("please login")
    }
    //when user with that username didnt find
    if (message === null) {
        console.log("please login again")
    }
    //when pass isnt for that user
    if (message === false) {
        console.log("please login again; (likely pass of this acc was changed)")
    }
})
chatform.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const inputtext = e.target.elements.msg.value

    socket.emit('chatmessage', { name : username, msg: inputtext})
    //clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
})
//output present roomname & usernames engine
//room output 
function outputRoom(room) {
    roomname.innerText = room
}
//userslists output
function outputUsers(users) {
    userslist.innerHTML =  `
        ${users.map(user => `<li>${user.name}</li>`).join('')}
    `
}
//output message engine
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.name} <span>11:30</span></p>
            <p class="text">
            ${message.msg}
            </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}