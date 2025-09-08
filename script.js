// Typing effect for hero section
const typedText = "A Web Developer | Programmer | Tech Enthusiast";
let index = 0;
function type() {
  if(index < typedText.length){
    document.getElementById("typed").innerHTML += typedText.charAt(index);
    index++;
    setTimeout(type, 100);
  }
}
if(document.getElementById("typed")) window.onload = type;

// Dark mode toggle
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("darkmode", document.body.classList.contains("dark"));
}
if(localStorage.getItem("darkmode") === "true"){
  document.body.classList.add("dark");
}