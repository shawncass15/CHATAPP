document.addEventListener("DOMContentLoaded", function () {
  let usersList = document.querySelector("#users ul");
  let messagesList = document.querySelector("#messages ul");
  let entry = document.querySelector("#entry");

  let socket = io();
  let username = prompt("What's your username?");
  socket.emit("join", username);

  socket.on("users", (msg) => {
    usersList.innerHTML = "";
    msg.forEach((value) => {
      usersList.innerHTML += `
      <li>
        <img src="https://randomuser.me/api/portraits/med/men/${value.id}.jpg" alt="avatar" />
        <div class="name">
            <p>${value.username}</p>
            <p>online</p>
        </div>
      </li>
      `;
    });
  });

  socket.on("event", (msg) => {
    messagesList.innerHTML += `
    <li class="message-user">
      <p class="message-text">${msg}</p>
    </li>
    `;
  });

  socket.on("message", (msg) => {
    messagesList.innerHTML += `
    <li class="message-received">
      <p class="message-data">
        ${msg.username} <span>Today</span>
      </p>
      <p class="message-text">${msg.entry}</p>
    </li>
    `;
    scrollDown();
  });

  document.querySelector("#chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("message", { username, entry: entry.value });
    messagesList.innerHTML += `
    <li class="message-sent">
      <p class="message-data">
        ${username} <span>Today</span>
      </p>
      <p class="message-text">${entry.value}</p>
    </li>
    `;
    entry.value = "";
    scrollDown();
  });

  document.querySelector("#leave").addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("part", username);
  });

  function scrollDown() {
    let messages = document.querySelector(".messages-body");
    messages.scrollTop = messages.scrollHeight;
  }
});
