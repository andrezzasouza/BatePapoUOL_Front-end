const POST_USER_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const GET_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"

let yourName;
let sendContent;
let messageStatus;

checkUsername("Qual é seu lindo nome?");

function checkUsername (pergunta) {

    do {
        yourName = prompt(pergunta);
    } while(yourName === "");
    

    let username = {
        name: `${yourName}`
    }

    sendContent = axios.post(POST_USER_URL, username);

    console.log(sendContent.then());
    console.log(sendContent.catch());

    sendContent.then(postAnswer);
    sendContent.catch(postAnswer);

    console.log("PA")
    console.log(postAnswer);
}

function postAnswer(postResponse) {

    messageStatus = postResponse;
    console.log("msg", messageStatus)

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
        } while (postResponse.status !== 200)
    }
    
    console.log("Chegou até aqui");
    console.log(postResponse);
}


function ifSuccessful (respose) {
    const getContent = axios.get(GET_MESSAGES_URL);

    getContent.then(loadMessages);
    getContent.catch(console.log("Deu ruim"));

}

function loadMessages(messageResult) {
    const messages = messageResult.data;
    console.log(messages);

    const messageContainer = document.querySelector("main");
    let innerContainer = "";
}

