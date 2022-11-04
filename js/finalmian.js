// for loading

window.onload = setInterval(loadingFun,1000);

function loadingFun(){
    const htmlTag = document.querySelector("html");

    if(window.navigator.onLine){
        htmlTag.classList.remove("loading");
    }else{
        // htmlTag.classList.add("loading");
    }
}

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

    // for scroll for reveal
    const revelTags = document.getElementsByClassName("reveal-tag")
    for(let i = 0; i < revelTags.length; i++){
        const revelTagTop = revelTags[i].getBoundingClientRect().top;
        const revelTagH = revelTags[i].getBoundingClientRect().height;

        const windowH = window.innerHeight;
        const revealPoint = 80; // 150

        if(revelTags[i].id === "aboutus-section" || revelTags[i].id === "gallery-section"){
            const revealDelayTags = [...revelTags[i].getElementsByClassName("reveal-delay")];
            revealDelayTags.forEach((value,index) => {
                value.style.setProperty("transition-delay", 0.25 * index + "s");
            });
        }
        
        if(revelTagTop < (-revelTagH / 1.2)){
            revelTags[i].classList.remove("scrolled-active");
        }else if(revelTagTop < (windowH - revealPoint)){
            revelTags[i].classList.add("scrolled-active");
        }else{
            revelTags[i].classList.remove("scrolled-active");
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
                rgba(25,25,25,0.5) ${currentPercent}%
            )`;
        projectProgress.querySelector(".text").innerText = currentPercent + "%";
    };
};

projectProgressFun()