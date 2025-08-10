(function () {
    const params = new URLSearchParams(location.search);
    const embed = params.get('embed') === '1';
    const hideToggle = params.get('hideToggle') === '1';
    const startOpen = params.get('start') === 'open';
    const closable = params.get('closable') !== '0';
    const email = params.get('nombre');
    const nombre = decodeURIComponent(params.get('nombre')  || 'Jos%C3%A9%20Alejandro');

    const btnEnviarChat = document.getElementById("btn-enviar-chat");
    const chatInput = document.getElementById("chat");
    const chatBox = document.querySelector(".chatbot ul.chatbox");
    const chatToggler = document.querySelector(".chatbot-toggler");
    const btnCerrarChat = document.querySelector(".chatbot .btn-cerrar");
    const btnIniciarChat = document.getElementById("btn-iniciar-chat");
    const chatNuevo = document.getElementById("chatNuevo");
    const chatTexto = document.getElementById("chatTexto");

    let strMensaje = '';
    const inputInitHeight = chatInput.scrollHeight == 0 ? '55' : chatInput.scrollHeight;

    if (embed) {
        if (hideToggle && chatToggler) document.body.classList.toggle("mostrar-chatbot");
        if (!closable && btnCerrarChat) btnCerrarChat.style.display = 'none';
    }

    const crearChat = (mensaje, className, pensando = false) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);

        if(pensando === true){
            mensaje += `<span class="dots"><span>.</span><span>.</span><span>.</span></span>`;
        }

        let chatContenido = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${mensaje}</p>`;
        chatLi.innerHTML = chatContenido;

        if(className === "outgoing"){
            chatLi.querySelector("p").textContent = mensaje;
        }

        return chatLi;
    }

    const iniciarConversacion = async (usuarioPS) => {
        setTimeout(async () => {
            const escribiendoMensaje = crearChat("Escribiendo", "incoming", true);
            chatBox.appendChild(escribiendoMensaje);
            chatBox.scrollTo(0, chatBox.scrollHeight);
            
            let objMensaje = escribiendoMensaje.querySelector("p");

            try {
                await fetch(`https://api.allorigins.win/get?url=https://api.adviceslip.com/advice`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    //body: JSON.stringify({ usuarioPS })
                })
                .then(res => res.json())
                .then(data => {
                    const jsonData = JSON.parse(data.contents);

                    const secretKey = 'mi_clave_secreta_123';
                    const encryptedToken = encriptar('mi_token_inicio', secretKey);
                
                    sessionStorage.setItem('chatbotSessionToken', encryptedToken);
                
                    setTimeout(() => {
                        chatNuevo.classList.add("d-none");
                        chatTexto.classList.remove("d-none");

                        objMensaje.innerHTML = `Hola <b>${nombre}</b> 😎 ¿En que puedo ayudarte?`;

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
                objMensaje.innerHTML = `Error iniciando conversación`;
                objMensaje.classList.add("error");
                console.error("Error al obtener la respuesta del bot:", error);
                chatBox.scrollTo(0, chatBox.scrollHeight);
            }
        }, 400)
    }

    const generarRespuesta = async (escribiendoMensaje) => {
        let objMensaje = escribiendoMensaje.querySelector("p");

        try {
            await fetch(`https://api.allorigins.win/get?url=https://api.adviceslip.com/advice`)
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

    const encriptar = (val, sk) => {
        return CryptoJS.AES.encrypt(val, sk).toString();
    }

    const desencriptar = (val, sk) => {
        const bytes = CryptoJS.AES.decrypt(val, sk);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    const guardarSession = () => {
        sessionStorage.setItem("", "");

    }

    const validarSession = () => {

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

    btnIniciarChat.addEventListener("click", () => iniciarConversacion("48833857"));
    btnEnviarChat.addEventListener("click", enviarChat);
    chatToggler.addEventListener("click", () => document.body.classList.toggle("mostrar-chatbot"));
    btnCerrarChat.addEventListener("click", () => document.body.classList.remove("mostrar-chatbot"));
})();