const themeLink = document.getElementById("theme");

function toggleTheme(){

if(themeLink.href.includes("light.css")) themeLink.href = "dark.css";
else themeLink.href = "light.css";

}