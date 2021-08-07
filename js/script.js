const POST_USER_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const GET_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const POST_STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const POST_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

let yourName;
let sendContent;
let messageStatus;
let username = {};

checkUsername("Qual é seu lindo nome?");


function checkUsername (pergunta) {

    do {
        yourName = prompt(pergunta);
    } while(yourName === "" || yourName === null);

    username = {
        name: `${yourName}`
    }

    sendContent = axios.post(POST_USER_URL, username);

    console.log(sendContent.then());
    console.log(sendContent.catch());

    sendContent.then(ifSuccessful);
    sendContent.catch(postAnswer);

    console.log("PA")
    console.log(postAnswer);
}

function postAnswer(postResponse) {

    if (postResponse.status === 200) {
        ifSuccessful(postResponse);
    } else {
        do {
            if (postResponse.response.status === 400) {
                checkUsername("O nome escolhido já está em uso. Escolha outro nome, por favor.");
                return checkUsername;
            } else {
                alert("Algo deu errado, mas não sei o que. Tente novamente.");
            }
        } while (postResponse.status !== 200);
    }
    console.log("Chegou até aqui");
    console.log(postResponse);
}


function ifSuccessful(response) {
    const getContent = axios.get(GET_MESSAGES_URL);

    getContent.then(loadMessages);
    // getContent.catch(console.log("Deu ruim"));

}

setInterval(ifSuccessful, 3000);

function loadMessages(messageResult) {
    const messages = messageResult.data;
    console.log("data", messages);

    const messageContainer = document.querySelector("main");
    let innerContainer = "";

    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            innerContainer += `<div class="message ${messages[i].type}">
            <span class="timestamp">(${messages[i].time})</span>
            <span class="actor">${messages[i].from}</span>
            <span class="sent-message">${messages[i].text}</span>
         </div>`
        } else if (messages[i].type === "message") {
            innerContainer += `<div class="message">
            <span class="timestamp">(${messages[i].time})</span>
            <span class="actor">${messages[i].from}</span>
            <span class="action">para</span>
            <span class="receiver">${messages[i].to}:</span>
            <span class="sent-message">${messages[i].text}</span>
         </div>`
        } else if (messages[i].type === "private_message") {
            if (username === messages[i].from || username === messages[i].to)
            innerContainer += `<div class="message ${messages[i].type}">
            <span class="timestamp">(${messages[i].time})</span>
            <span class="actor">${messages[i].from}</span>
            <span class="action">reservadamente para</span>
            <span class="receiver">${messages[i].to}:</span>
            <span class="sent-message">${messages[i].text}</span>
         </div>`
        }
    }

    // pode ser uma boa ideia trocar a main por uma ul e as mensagens por lis?

    messageContainer.innerHTML = innerContainer;

    const lastMessage = messageContainer.lastElementChild;
    console.log(lastMessage);
    lastMessage.scrollIntoView();
}

function sendMessage() {
    const textMessage = document.querySelector(".insert-text input").value;

    const messageData = {
        from: username,
        to: "Todos",
        text: textMessage,
        type: "message"
    }

    const sending = axios.post(POST_MESSAGES_URL, messageData);

    sending.then(ifSuccessful);
    sending.catch(sendError);
}

function sendError() {
    return window.location.reload();
}

