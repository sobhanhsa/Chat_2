const socket = io()
const userinstorage = localStorage.getItem('recordeduser')
const usernamep = document.getElementById('usernamep')
const { token } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
socket.emit('recievetoken', { token, userinstorage })
socket.on('htmlmessage', (status) => {
    if (status === null) {
        loginRequired()
    } else if (!status) {
        loginAgain()
    } else {
        localStorage.setItem("recordeduser", `${status.name} ${status.pass}`)
        userDisplay(status.name)
    }
})
function loginRequired() {
    console.log("please login")
    usernamep.innerText = "please login"
}
function loginAgain() {
    usernamep.innerText = "please login again"
}
function userDisplay(user) {
    usernamep.innerText = user
    const submitbtn = document.createElement('button')
    submitbtn.type = "submit"
    submitbtn.onclick = "afterclick"
    submitbtn.id = "submitbtn"
    submitbtn.innerHTML = "Join chat"
    submitbtn.className = "btn"
    document.getElementById('enterform').appendChild(submitbtn)
}
