const btnEnviarChat = document.getElementById("btn-enviar-chat");
const chatInput = document.getElementById("chat");
const chatBox = document.querySelector(".chatbot ul.chatbox");

let strMensaje = '';

const crearChat = (mensaje, className, pensando = false) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    if(pensando === true){
        mensaje += `<span class="dots"><span>.</span><span>.</span><span>.</span></span>`;
    }

    let chatContenido = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">robot</span><p>${mensaje}</p>`;
    chatLi.innerHTML = chatContenido;

    if(className === "outgoing"){
        chatLi.querySelector("p").textContent = mensaje;
    }

    return chatLi;
}

const generarRespuesta = async (escribiendoMensaje) => {
    let objMensaje = escribiendoMensaje.querySelector("p");

    try {
        const response = await fetch("https://api.allorigins.win/get?url=https://api.adviceslip.com/advice")
        .then(res => res.json())
        .then(data => {

            const jsonData = JSON.parse(data.contents);

            setTimeout(() => {
                objMensaje.innerHTML = `${jsonData.slip.advice}`;
            }, 800);
        })
        .catch(err => {
            throw new Error(err);
        })
        .finally(()=>{
            chatBox.scrollTo(0, chatBox.scrollHeight);
        });
    } catch (error) {
        setTimeout(() => {
            objMensaje.innerHTML = `Error al obtener la respuesta del bot`;
        }, 800);
        console.error("Error al obtener la respuesta del bot:", error);
    }
}

const enviarChat = () => {
    strMensaje = chatInput.value.trim();

    if(!strMensaje) return;

    chatBox.appendChild(crearChat(strMensaje, "outgoing", false));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const escribiendoMensaje = crearChat("Escribiendo", "incoming", true);
        chatBox.appendChild(escribiendoMensaje);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generarRespuesta(escribiendoMensaje);
    }, 400)
}

btnEnviarChat.addEventListener("click", enviarChat);