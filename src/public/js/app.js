const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form")

room.hidden = true;

let roomName = "";

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM: ${roomName}`;

    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");

    msgForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = room.querySelector("#msg input");
        const value = input.value;
        socket.emit("new_message", value, roomName, ()=> {
            addMessage(`You: ${value}`);
        });
        input.value = ""
    })
    nameForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = room.querySelector("#name input");
        const value = input.value;
        const h5 = room.querySelector("h5");
        h5.innerText = `Nickname: ${value}`;
        socket.emit("nickname", value, ()=> {
            addMessage(`Your Nickname Changed: ${value}`);
        });
        input.value = ""
    })
}

function handleRoomSubmit(evevt) {
    evevt.preventDefault();
    const input = form.querySelector("input");
    roomName = input.value;
    socket.emit("enter_room", input.value, showRoom);
    input.value = ""
}

socket.on("welcome", (nickname, count) => {
    addMessage(`${nickname} enterd`);
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM: ${roomName} (${count})`;
});

socket.on("bye", (nickname, count) => {
    addMessage(`${nickname} left`);
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM: ${roomName} (${count})`;
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    })
});

form.addEventListener("submit", handleRoomSubmit)