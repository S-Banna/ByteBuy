const themeLink = document.getElementById("theme");

function toggleTheme(){

if(themeLink.href.includes("css/light.css")) themeLink.href = "css/dark.css";
else themeLink.href = "css/light.css";

}