// Import the functions from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged,         
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration (substitua pelos seus dados)

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYDkbaLCBddsVwdKhgSyR0DtY-i4wSw8k",
  authDomain: "auth-advocaciaaws.firebaseapp.com",
  projectId: "auth-advocaciaaws",
  storageBucket: "auth-advocaciaaws.firebasestorage.app",
  messagingSenderId: "1027780834429",
  appId: "1:1027780834429:web:071483b0af40c6e95cad14",
  measurementId: "G-L8YXS362WQ",
};
console.log(firebaseConfig);

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Inicia a autenticação
const auth = getAuth(app);

// LOGICA PARA AUTENTICAR

const TIME_LIMIT = 30 * 60 * 1000; // 30 minutos em milissegundos
const BLOCK_TIME = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

// Função para atualizar o timer (contador de tempo)
function updateTimer(remaining) {
  // Calcula os minutos restantes a partir do tempo total restante
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  // Calcula os segundos restantes a partir do tempo total restante
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  // Atualiza o conteúdo do elemento HTML com o ID 'time-remaining' para mostrar o tempo restante
  document.getElementById(
    "time-remaining"
  ).textContent = `${minutes}m ${seconds}s`;
}

// Função para verificar se o usuário está logado e controlar o tempo de sessão

function checkSessionTime() {
  // Recupera o tempo de login armazenado no localStorage
  const loginTime = localStorage.getItem("loginTime");
  // Recupera a data de login armazenada no localStorage (pode ser usada para controle adicional)
  const loginDate = localStorage.getItem("loginDate");

  // Verifica se há informações de tempo de login e data de login
  if (loginTime && loginDate) {
    // Obtém o horário atual em milissegundos
    const currentTime = Date.now();
    // Calcula o tempo decorrido desde o login
    const elapsed = currentTime - loginTime;

    // Se o tempo decorrido ultrapassar o limite de tempo (definido como TIME_LIMIT)
    if (elapsed >= TIME_LIMIT) {
      // Alerta o usuário de que o tempo de uso expirou e ele será desconectado
      alert("Seu tempo de uso expirou. Você será desconectado.");

      // Realiza o logout do usuário usando a função signOut
      signOut(auth).then(() => {
        // Mostra o formulário de autenticação novamente
        document.getElementById("auth-container").style.display = "block";
        // Esconde a mensagem de sucesso de login
        document.getElementById("success-message").style.display = "none";
        // Remove as informações de tempo de login do localStorage
        localStorage.removeItem("loginTime");
        localStorage.removeItem("loginDate");
        // Define um flag no localStorage para bloquear novos acessos por tempo limite
        localStorage.setItem("accessBlocked", true);
      });
    } else {
      // Se o tempo não expirou, calcula o tempo restante
      const remaining = TIME_LIMIT - elapsed;
      // Atualiza o timer na interface chamando a função updateTimer
      updateTimer(remaining);
    }
  }
}

// Função de login quando o botão 'login-btn' é clicado
document.getElementById("login-btn").addEventListener("click", () => {
  // Obtém o email e a senha inseridos pelo usuário nos campos de login
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Verifica se o acesso do usuário está bloqueado (baseado em sessão anterior)
  if (localStorage.getItem("accessBlocked")) {
    // Se estiver bloqueado, alerta o usuário que já utilizou o tempo diário
    alert("Você já utilizou seus 30 minutos hoje. Tente novamente amanhã.");
    return; // Sai da função, impedindo o login
  }

  // Realiza o login com o Firebase Authentication usando o email e a senha fornecidos
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Ao logar com sucesso, obtém o tempo atual
      const currentTime = Date.now();
      // Armazena o horário de login no localStorage
      localStorage.setItem("loginTime", currentTime);
      // Armazena a data de login (pode ser útil para controle diário)
      localStorage.setItem("loginDate", currentTime);
      // Esconde o formulário de autenticação
      document.getElementById("auth-container").style.display = "none";
      // Mostra a mensagem de sucesso de login
      document.getElementById("success-message").style.display = "block";

      // Inicia um temporizador para verificar o tempo de sessão a cada segundo
      setInterval(checkSessionTime, 1000);
    })
    .catch((error) => {
      // Em caso de erro no login, exibe uma mensagem de alerta com o erro
      alert("Erro no login: " + error.message);
    });
});

// Função de cadastro quando o botão 'signup-btn' é clicado
document.getElementById("signup-btn").addEventListener("click", () => {
  // Obtém o email e a senha inseridos pelo usuário nos campos de cadastro
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // Realiza o cadastro com o Firebase Authentication usando o email e a senha fornecidos
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Ao cadastrar com sucesso, alerta o usuário
      alert("Cadastro realizado com sucesso!");
    })
    .catch((error) => {
      // Em caso de erro no cadastro, exibe uma mensagem de alerta com o erro
      alert("Erro no cadastro: " + error.message);
    });
});

// Função de logout quando o botão 'logout-btn' é clicado
document.getElementById("logout-btn").addEventListener("click", () => {
  // Realiza o logout do usuário usando a função signOut
  signOut(auth)
    .then(() => {
      // Alerta o usuário sobre o logout bem-sucedido
      alert("Logout realizado com sucesso!");
      // Mostra o formulário de autenticação novamente
      document.getElementById("auth-container").style.display = "block";
      // Esconde a mensagem de sucesso de login
      document.getElementById("success-message").style.display = "none";
      // Remove as informações de login do localStorage
      localStorage.removeItem("loginTime");
      localStorage.removeItem("loginDate");
    })
    .catch((error) => {
      // Em caso de erro no logout, exibe uma mensagem de alerta com o erro
      alert("Erro ao realizar logout: " + error.message);
    });
});

// Função de logout na página de sucesso (semelhante à anterior, porém para outro botão)
document.getElementById("logout-success-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logout realizado com sucesso!");
      document.getElementById("auth-container").style.display = "block";
      document.getElementById("success-message").style.display = "none";
      localStorage.removeItem("loginTime");
      localStorage.removeItem("loginDate");
    })
    .catch((error) => {
      alert("Erro ao realizar logout: " + error.message);
    });
});

// Função para monitorar o estado de autenticação do Firebase
onAuthStateChanged(auth, (user) => {
  // Se o usuário estiver logado
  if (user) {
    // Esconde o formulário de autenticação
    document.getElementById("auth-container").style.display = "none";
    // Mostra a mensagem de sucesso de login
    document.getElementById("success-message").style.display = "block";
    // Armazena o tempo de login atual no localStorage
    const currentTime = Date.now();
    localStorage.setItem("loginTime", currentTime);
    localStorage.setItem("loginDate", currentTime);
    // Inicia um intervalo para verificar o tempo de sessão a cada segundo
    setInterval(checkSessionTime, 1000);
  } else {
    // Se o usuário não estiver logado, mostra o formulário de autenticação
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("success-message").style.display = "none";
    // Limpa o tempo de login do localStorage
    localStorage.removeItem("loginTime");
    localStorage.removeItem("loginDate");
  }
});
