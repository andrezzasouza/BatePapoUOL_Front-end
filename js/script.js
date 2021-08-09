/* LINKS DO SERVIDOR */

const POST_USER_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const POST_STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

/* VARIÁVEIS GLOBAIS */

let yourName;
let username = {};

/* VERIFICA DISPONIBILIDADE DO NOME DE USUÁRIO */

checkUsername("Qual é seu lindo nome?");

function checkUsername (pergunta) {
    do {
        yourName = prompt(pergunta);
    } while(yourName === "" || yourName === null);
    console.log("Got username")
    username = {
        name: `${yourName}`
    }
    console.log("username", username)
    console.log("Created username object")
    const sendContent = axios.post(POST_USER_URL, username);
    console.log("Sent user post")
    // console.log(sendContent.then());
    // console.log(sendContent.catch());

    // Erro tá em uma dessas promises, quando passa por elas pela segunda vez, mas por quê?
    sendContent.then(ifSuccessful);
    console.log("Got user successful answer")
    sendContent.catch(ifError); 
    console.log("Got user error answer")

    // console.log("PA");
    // console.log(ifError);
}

/* VERIFICA SE USUÁRIO ESTÁ NO CHAT */

function userIsHere() {
    console.log("send user stat")
    sendContent = axios.post(POST_STATUS_URL, username);
    console.log("User is here, bitches!");
}

/* TRATA SUCESSO DO LOGIN */

function ifSuccessful() {
    console.log("if Suc")
    const checkMessages = document.querySelector("main .message");
    if (checkMessages === null) {
        setInterval(userIsHere, 5000);
        setInterval(ifSuccessful, 3000);
    }
    const getContent = axios.get(MESSAGES_URL);
    console.log("load msgs")
    getContent.then(loadMessages);
}

/* TRATA ERRO DO LOGIN */

function ifError(postResponse) {
    console.log("no erro")
    if (postResponse.response.status === 400) {
        console.log("no erro 400")
        checkUsername("O nome escolhido já está em uso. Escolha outro nome, por favor.");
        console.log("depois do erro 400")
        // return checkUsername;
    } else {
        alert("Algo deu errado. Tente novamente.");
    }

    // if (postResponse.status === 200) {
    //     ifSuccessful(postResponse);
    // } else {
    //     do {
    //         if (postResponse.response.status === 400) {
    //             checkUsername("O nome escolhido já está em uso. Escolha outro nome, por favor.");
    //             return checkUsername;
    //         } else {
    //             alert("Algo deu errado. Tente novamente.");
    //         }
    //     } while (postResponse.status !== 200);
    // }
    // console.log("Chegou até aqui");
    // console.log(postResponse);
}

/* ATUALIZA MENSAGENS */

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
    const textMessage = document.querySelector(".insert-text input").value;
    let sending;

    if (textMessage !== "") {
        const messageData = {
            from: yourName,
            to: "Todos",
            text: textMessage,
            type: "message"
        }
    
        sending = axios.post(MESSAGES_URL, messageData);
        document.querySelector(".insert-text input").value = "";
    
        sending.then(ifSuccessful);
        sending.catch(sendError);
    }
}

/* TRATA ERRO DE ENVIO */

function sendError() {
    return window.location.reload();
}

/* PERMITE ENVIO DE MENSAGENS COM A TECLA ENTER */

const input = document.querySelector(".insert-text input");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector(".insert-text button").click();
    }
});