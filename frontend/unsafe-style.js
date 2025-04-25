// UNSAFE SCRIPT – nur zu Demo-Zwecken
const hackedBanner = document.createElement("div");
hackedBanner.innerText = "💀 HACKED 💀";
hackedBanner.style.position = "fixed";
hackedBanner.style.top = "40%";
hackedBanner.style.left = "50%";
hackedBanner.style.transform = "translate(-50%, -50%)";
hackedBanner.style.fontSize = "5rem";
hackedBanner.style.fontWeight = "bold";
hackedBanner.style.color = "red";
hackedBanner.style.zIndex = "9999";
hackedBanner.style.backgroundColor = "black";
hackedBanner.style.padding = "2rem";
hackedBanner.style.border = "5px solid red";
hackedBanner.style.borderRadius = "20px";
hackedBanner.style.boxShadow = "0 0 20px red";

document.body.appendChild(hackedBanner);