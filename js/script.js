/* LINKS DO SERVIDOR */

const POST_USER_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const POST_STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

/* VARIÁVEIS GLOBAIS */

let yourName;
let username = {};
let sendContent;
const messageInput = document.querySelector(".insert-text input");
const loginInput = document.querySelector(".login input");
const loginButton = document.querySelector(".login button");
const errorMessage = document.querySelector(".login .error-msg");
const loading = document.querySelector(".loading");
const entering = document.querySelector(".entering");


/* VERIFICA DISPONIBILIDADE DO NOME DE USUÁRIO */

// checkUsername("Qual é seu lindo nome?");

function logIn() {
    yourName = loginInput.value;
    errorMessage.innerHTML = "";

    loginInput.classList.add("hidden");
    loginButton.classList.add("hidden");
    loading.classList.remove("hidden");
    entering.classList.remove("hidden");

    setTimeout(checkUsername, 3000, yourName);
}

function checkUsername (yourName) {
    if (yourName === "" || yourName === null || yourName === undefined) {
        errorMessage.innerHTML = "Digite um nome de usuário."
    } else {
        username = {
            name: `${yourName}`
        }
    
        sendContent = axios.post(POST_USER_URL, username);
    
        sendContent.then(ifSuccessful);
        sendContent.catch(ifError);
    }
}

/* VERIFICA SE USUÁRIO ESTÁ NO CHAT */

function userIsHere() {
    sendContent = axios.post(POST_STATUS_URL, username);
}

/* TRATA SUCESSO DO LOGIN */

function ifSuccessful() {
    const loginScreen = document.querySelector(".login");
    loginScreen.classList.add("hidden");

    const checkMessages = document.querySelector("main .message");
    if (checkMessages === null) {
        setInterval(userIsHere, 5000);
        setInterval(ifSuccessful, 3000);
    }
    const getContent = axios.get(MESSAGES_URL);
    getContent.then(loadMessages);
}

/* TRATA ERRO DO LOGIN */

function ifError(postResponse) {
    if (postResponse.response.status === 400) {
        loginInput.classList.remove("hidden");
        loginButton.classList.remove("hidden");
        loading.classList.add("hidden");
        entering.classList.add("hidden");

        messageInput.value = "";
        errorMessage.innerHTML = "O nome escolhido já está em uso. Escolha outro nome, por favor.";
        yourName = loginInput.value;
        
    } else {
        loginInput.innerHTML = "Algo deu errado. Recarregue a página.";
    }
}

/* ATUALIZA MENSAGENS */

function loadMessages(messageResult) {
    const messages = messageResult.data;

    const messageContainer = document.querySelector("main");
    let innerContainer = "";

    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            innerContainer += `<div class="message ${messages[i].type}">
                <span class="timestamp">(${messages[i].time})</span>
                <span class="actor">${messages[i].from}</span>
                <span class="sent-message">${messages[i].text}</span>
            </div>`;
        } else if (messages[i].type === "message") {
            innerContainer += `<div class="message">
                <span class="timestamp">(${messages[i].time})</span>
                <span class="actor">${messages[i].from}</span>
                <span class="action">para</span>
                <span class="receiver">${messages[i].to}:</span>
                <span class="sent-message">${messages[i].text}</span>
            </div>`;
        } else if (messages[i].type === "private_message") {
            if (yourName === messages[i].from || yourName === messages[i].to) {
                innerContainer += `<div class="message ${messages[i].type}">
                    <span class="timestamp">(${messages[i].time})</span>
                    <span class="actor">${messages[i].from}</span>
                    <span class="action">reservadamente para</span>
                    <span class="receiver">${messages[i].to}:</span>
                    <span class="sent-message">${messages[i].text}</span>
                </div>`;
            }
        }
    }
    messageContainer.innerHTML = innerContainer;

    const lastMessage = messageContainer.lastElementChild;
    lastMessage.scrollIntoView();
}

/* ENVIA MENSAGENS */

function sendMessage() {
    const textMessage = messageInput.value;
    let sending;

    if (textMessage !== "") {
        const messageData = {
            from: yourName,
            to: "Todos",
            text: textMessage,
            type: "message"
        }
    
        sending = axios.post(MESSAGES_URL, messageData);
        messageInput.value = "";
    
        sending.then(ifSuccessful);
        sending.catch(sendError);
    }
}

/* TRATA ERRO DE ENVIO */

function sendError() {
    return window.location.reload();
}

/* PERMITE ENVIO DE TEXTOS COM A TECLA ENTER */

messageInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector(".insert-text button").click();
    }
});

loginInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector(".login button").click();
    }
});