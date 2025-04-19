const btnEnviarChat = document.getElementById("btn-enviar-chat");
const chatInput = document.getElementById("chat");
const chatBox = document.querySelector(".chatbot ul.chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const btnCerrarChat = document.querySelector(".chatbot .btn-cerrar");

let strMensaje = '';
const inputInitHeight = chatInput.scrollHeight;

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
        await fetch("https://api.allorigins.win/get?url=https://api.adviceslip.com/advice")
        .then(res => res.json())
        .then(data => {

            const jsonData = JSON.parse(data.contents);

            setTimeout(() => {
                objMensaje.innerHTML = `${jsonData.slip.advice}`;

                chatBox.scrollTo(0, chatBox.scrollHeight);
            }, 800);
        })
        .catch(err => {
            throw new Error(err);
        })
        .finally(()=>{
            chatBox.scrollTo(0, chatBox.scrollHeight);
        });
    } catch (error) {
        objMensaje.innerHTML = `Error al obtener la respuesta del bot`;
        objMensaje.classList.add("error");
        console.error("Error al obtener la respuesta del bot:", error);
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }
}

const enviarChat = () => {
    strMensaje = chatInput.value.trim();

    if(!strMensaje) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatBox.appendChild(crearChat(strMensaje, "outgoing", false));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const escribiendoMensaje = crearChat("Escribiendo", "incoming", true);
        chatBox.appendChild(escribiendoMensaje);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generarRespuesta(escribiendoMensaje);
    }, 400)
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        enviarChat();
    }
});

btnEnviarChat.addEventListener("click", enviarChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("mostrar-chatbot"));
btnCerrarChat.addEventListener("click", () => document.body.classList.remove("mostrar-chatbot"));