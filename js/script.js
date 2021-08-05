// Usar funções para verificar o nome ou autenticar entrada?

// Pegar nome de usuário com querySelector + value se for num input ou de outra forma de for do prompt

const yourName = prompt("Qual é seu lindo nome?");

let username = {
    name: `${yourName}`
}

const sendContent = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", username);


sendContent.then(ifSuccessful); // Preencher com a função
sendContent.catch(ifError); // Preencher com a função