import { login, redirectIfLoggedIn } from "./auth.js";

redirectIfLoggedIn("dashboard.html");


// import { login } from "./auth.js";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

// Show/Hide Password
togglePassword.addEventListener("click", () => {

    if(password.type==="password"){

        password.type="text";
        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }else{

        password.type="password";
        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

});

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    try{

        await login(
            email.value.trim(),
            password.value
        );

        message.style.color="#00d26a";
        message.textContent="Login Successful";

        setTimeout(()=>{
            window.location.href="dashboard.html";
        },1000);

    }catch(error){

        message.style.color="red";

        message.textContent="Invalid email or password.";

    }

});