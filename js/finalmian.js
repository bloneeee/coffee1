// for scroll
window.onscroll = () => {
    // for navbar
    const navbarTag = document.querySelector("nav");
    if(navbarTag){
        if(window.scrollY > 50){
            navbarTag.classList.add("sticky-top");
        }else{
            navbarTag.classList.remove("sticky-top");
        };
    };

    // for project progress
    projectProgressFun();

    // for top btn
    const topBtn = document.querySelector(".top-btn");
    if(topBtn){
        if(window.scrollY > 500){
            topBtn.style.display = "flex";
        }else{
            topBtn.style.display = "none";
        };
    };

    // for scroll ani
    const revealCons = document.getElementsByClassName("reveal-con")
    for(let i = 0; i < revealCons.length; i++){
        const revealConTop = revealCons[i].getBoundingClientRect().top;
        const revealConH = revealCons[i].getBoundingClientRect().height;

        const windowH = window.innerHeight;
        const revealPoint = 80; // 150

        if(revealCons[i].id === "aboutus-section" || revealCons[i].id === "gallery-section"){
            const revealDelayTags = [...revealCons[i].getElementsByClassName("reveal-delay")];
            revealDelayTags.forEach((value,index) => {
                value.style.setProperty("transition-delay", 0.25 * index + "s");
            });
        }
        
        if(revealConTop < (windowH - revealPoint)){
            revealCons[i].classList.add("scrolled-active");
        }
    };
};

// for project progress
function projectProgressFun(){
    const projectProgress = document.getElementById("project-progress");
    if(projectProgress){
        const projectH = document.documentElement.scrollHeight;
        const currentH = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const currentPercent = Math.floor((scrollTop * 100) / (projectH - currentH));
        
        projectProgress.style.backgroundImage = `
            conic-gradient(
                var(--c-g) ${currentPercent}%,
                rgba(25, 25, 25, 0.5) ${currentPercent}%
            )`;
        projectProgress.querySelector(".text").innerText = currentPercent + "%";
    };
};
projectProgressFun();

// for loading
window.onload = loadingFun;
function loadingFun(){
    const htmlTag = document.querySelector("html");
    const homeCar = document.querySelector("#home-carousel");

    if(window.navigator.onLine){
        // console.log("online");
        htmlTag.classList.remove("loading");
        homeCar.classList.add("intro-ani");
    }else{
        // console.log("offline");
        htmlTag.classList.add("loading");
        homeCar.classList.remove("intro-ani");
    }
}