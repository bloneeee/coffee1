const jsonMoscowObj = localStorage.getItem("jsonMoscowObj");
if(!jsonMoscowObj) localStorage.setItem("jsonMoscowObj",JSON.stringify({}));

// start menu arr

const menuArr = [
    {id: 1, img: "./assets/img/menu1.jpg", name: "Cafe Latte", price: 5000, type: "coffee"},
    {id: 2, img: "./assets/img/menu2.jpg", name: "Ice Coffe", price: 3000, type: "coffee"},
    {id: 3, img: "./assets/img/menu3.jpg", name: "Mocha", price: 4600, type: "coffee"},
    {id: 4, img: "./assets/img/menu4.jpg", name: "Espresso", price: 3800, type: "coffee"},
    {id: 5, img: "./assets/img/menu5.jpg", name: "Americano", price: 4200, type: "coffee"},
    {id: 6, img: "./assets/img/menu6.jpg", name: "Boule", price: 2700, type: "bread"},
    {id: 7, img: "./assets/img/menu7.jpg", name: "Baguette", price: 1800, type: "bread"},
    {id: 8, img: "./assets/img/menu8.jpg", name: "Challah", price: 3500, type: "bread"},
];

// end menu arr

// start month arr

const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// end month arr

// start gallery arr

const galleryArr = [
    {src: "./assets/img/gallery1.jpg", type: "customer"},
    {src: "./assets/img/gallery2.jpg", type: "customer"},
    {src: "./assets/img/gallery3.jpg", type: "customer"},
    {src: "./assets/img/gallery4.jpg", type: "customer"},
    {src: "./assets/img/gallery5.jpg", type: "coffee"},
    {src: "./assets/img/gallery6.jpg", type: "coffee"},
    {src: "./assets/img/gallery7.jpg", type: "coffee"},
    {src: "./assets/img/gallery8.jpg", type: "coffee"},
    {src: "./assets/img/gallery9.jpg", type: "bread"},
    {src: "./assets/img/gallery10.jpg", type: "bread"},
    {src: "./assets/img/gallery11.jpg", type: "bread"},
    {src: "./assets/img/gallery12.jpg", type: "bread"}
];

// end gallery arr

// start oc timetable arr

const ocTimetableArr = [
    {day: "Monday", octime: "8:00 ~ 16:00"},
    {day: "Tuesday", octime: "8:00 ~ 16:00"},
    {day: "Wednesday", octime: "8:00 ~ 16:00"},
    {day: "Thursday", octime: "8:00 ~ 16:00"},
    {day: "Friday", octime: "8:00 ~ 16:00"},
    {day: "Saturday", octime: "9:00 ~ 15:00"},
    {day: "Sunday", octime: "Closed"}
];

// end oc timetable arr

// start get menu obj from localStorage

function toGetLocalVal(key){
    const getJSONMoscowObj = localStorage.getItem("jsonMoscowObj");
    const jsMoscowObj = JSON.parse(getJSONMoscowObj);
    return jsMoscowObj[key];
}

// end get menu obj from localStorage

// start add menu obj to localStorage

function toAddLocalVal(key,value){
    const getJSONMoscowObj = localStorage.getItem("jsonMoscowObj");
    const jsMoscowObj = JSON.parse(getJSONMoscowObj);

    jsMoscowObj[key] = value;

    let jsonMoscowObj = JSON.stringify(jsMoscowObj);
    localStorage.setItem("jsonMoscowObj", jsonMoscowObj);
}

// start add menu obj to localStorage

// start class toggle

const classToggle = (activeTags, arr) => {
    [...activeTags].forEach(value => {
        if(value) value.classList.remove("clicked-active");
    });
    
    arr.forEach(value => {
        if(value) value.classList.add("clicked-active");
    });
};

// end class toggle

// start navbar 

const navbarTag = document.querySelector("nav"),
    navbarToggler = document.querySelector("nav .navbar-toggler"),
    navbarCollapse = document.querySelector("nav .navbar-collapse"),
    navATags = document.querySelectorAll("nav .navbar-collapse a");

if(navbarTag){
    navbarToggler.addEventListener("click", () => {
        navbarToggler.classList.toggle("clicked1");
        navbarToggler.classList.toggle("clicked2");
        navbarCollapse.classList.toggle("collapse");
    });

    navATags.forEach(value => {
        if(value.classList.contains("dropdown-toggle")) return;
        value.addEventListener("click", () => classToggle(navATags, [value]));
    });
}

// end navbar

// Start Idx For Carousel 

const toChCarIdx = (idx, dir, length) => {
    if(dir === 1){
        idx++;
        if(idx >= length - 1) dir = -1;
    }else if(dir === -1){
        idx--;
        if(idx <= 0) dir = 1;
    }

    if(idx >= length) idx = length - 2; 
    if(idx <= -1) idx = 1;

    return {carIdx: idx, carDir: dir};
}

// End Idx For Carousel

// start setInterval

const toRunRide = (mainTag, idx, dir, length, fun) => {
    // console.log(idx, dir, length, fun, mainTag);

    const {carIdx, carDir} = toChCarIdx(idx, dir, length);

    mainTag.setAttribute("data-idx", carIdx);
    mainTag.setAttribute("data-ride-direction", carDir);

    fun(carIdx, mainTag);
};

// end setInterval

// start clearInterval

const toStopRide = (mainTag, fun, result, dur) => {
    mainTag.addEventListener('mouseenter', () => {
        // console.log(fun, result);
        // console.log('moveenter', dur);
        clearInterval(result);
    });
    
    mainTag.addEventListener('mouseleave', () => {
        // console.log(fun, result);
        // console.log('moveleave', dur);
        clearInterval(result);
        result = setInterval(fun, dur);
    });

    mainTag.addEventListener('touchstart', () => {
        // console.log(fun,result);
        // console.log('touchstart', dur);
        clearInterval(result);
    });

    mainTag.addEventListener('touchend', () => {
        // console.log(fun, result);
        // console.log('touchend', dur);
        clearInterval(result);
        result = setInterval(fun, dur);
    });
};

// end clearInterval

// start carousel

const carousels = Array.from(document.getElementsByClassName("carousel"));

let getCarID,
    getCarDataIdx, getCarDataLoop, getCarDataRide, getCarDataRideDur, getCarDataRideDir,
    carToggles, 
    carMove, carItems, 
    carIndicators, carLis, 
    carPrev, carNext, 
    carLength,
    getCarDataPos;

function toGetCarouselTags(carousel){ 
    getCarID = carousel.getAttribute("id");

    getCarDataIdx = Number(carousel.getAttribute("data-idx"));
    getCarDataLoop = +carousel.getAttribute("data-loop");
    getCarDataRide = +carousel.getAttribute("data-ride");
    getCarDataRideDur = +carousel.getAttribute("data-ride-duration");
    getCarDataRideDir = +carousel.getAttribute("data-ride-direction");

    carToggles = [...document.getElementsByClassName(getCarID + "-toggle")];

    carMove = document.getElementById(getCarID + "-move");
    carItems =  [...carMove.getElementsByClassName("carousel-item")];

    carIndicators = document.getElementById(getCarID + "-indicators");
    carLis = [...carIndicators.getElementsByClassName("carousel-toggle-tag")];

    carPrev = document.getElementById(getCarID + "-control-prev");
    carNext = document.getElementById(getCarID + "-control-next");

    carLength = carLis.length;
    getCarDataPos = carMove.getAttribute("data-position");
};

carousels.forEach(carousel => {
    toGetCarouselTags(carousel);
    
    // start to defined prev & next & indicators & items
    if(carPrev){
        carPrev.addEventListener("click", () => {
            toMoveCarousel("prev", carousel);
        });
    };

    if(carNext){
        carNext.addEventListener("click", () => { 
            toMoveCarousel("next", carousel);
        });    
    };

    carLis.forEach((value, index) => {
        value.addEventListener("click", () => {
            toMoveCarousel(index, carousel);
        });
    });

    if(getCarDataPos === "top" || getCarDataPos === "bottom" || getCarDataPos === "left" || getCarDataPos === "right"){
        carItems.forEach((value, index) => {
            let distance;

            if(getCarDataPos === "top" || getCarDataPos === "bottom") distance = value.getBoundingClientRect().height;
            if(getCarDataPos === "left" || getCarDataPos === "right") distance = value.getBoundingClientRect().width;
            
            value.style.setProperty(getCarDataPos, (distance * index) + "px");
            value.setAttribute("data-distance", distance * index);
        });
    }
    // end to defined prev & next & indicators & items

    toMoveCarousel(getCarDataIdx, carousel);

    // start to invoke ride
    let result;
    const resultFun = () => {
        toGetCarouselTags(carousel);
        toRunRide(carousel, getCarDataIdx, getCarDataRideDir, carLength, toMoveCarousel);
    };

    if(getCarDataRide === 1) {
        result = setInterval(resultFun, getCarDataRideDur);
        toStopRide(carousel, resultFun, result, getCarDataRideDur);
    }
    // end to invoke ride
});

function toMoveCarousel(btnSign, carousel){
    toGetCarouselTags(carousel);

    // start to fix idx
    if(btnSign === "next"){
        getCarDataIdx++;
    }else if(btnSign === "prev"){
        getCarDataIdx--;
    }else if(btnSign > -1){
        getCarDataIdx = btnSign
    }
    // end to fix idx

    // start to fix prev & next
    if(getCarDataLoop === 1){
        if(getCarDataIdx >= carLength){
            getCarDataIdx = 0;
        }else if(getCarDataIdx <= -1){
            getCarDataIdx = carLength - 1;
        }   
    }else{
        if(getCarDataIdx >= carLength - 1){
            carNext.style.setProperty("visibility", "hidden");
            carPrev.style.setProperty("visibility", "visible");
        }else if(getCarDataIdx <= 0){
            carNext.style.setProperty("visibility", "visible");
            carPrev.style.setProperty("visibility", "hidden");
        }else{
            carNext.style.setProperty("visibility", "visible");
            carPrev.style.setProperty("visibility", "visible");
        }
    }

    // end to fix prev & next

    // start to move carousel-move
    if(getCarDataPos === "top" || getCarDataPos === "bottom" || getCarDataPos === "left" || getCarDataPos === "right"){
        let distance = carItems[getCarDataIdx].getAttribute("data-distance");

        if(getCarDataPos === "top"){
            carMove.style.transform = `translateY(-${distance}px)`;
        }else if(getCarDataPos === "bottom"){
            carMove.style.transform = `translateY(${distance}px)`;
        }else if(getCarDataPos === "left"){
            carMove.style.transform = `translateX(-${distance}px)`;
        }else if(getCarDataPos === "right"){
            carMove.style.transform = `translateX(${distance}px)`;
        }
    }
    // end to move carousel-move

    // start to move indicate-equip
    if(getCarID === "home-carousel" || getCarID === "feedback-carousel"){
        const carIndicateEquip = carIndicators.querySelector(".indicate-equip");
        const centerVal = (carLis[getCarDataIdx].offsetWidth - carIndicateEquip.offsetWidth) / 2;
        carIndicateEquip.style.left = `${carLis[getCarDataIdx].offsetLeft + centerVal}px`;
    }
    // end to move indicate-equip
   
    // start to invoke classToggle
    let removeArr = [], addArr = [];
    carToggles.forEach(value => {
        removeArr.push(value.querySelector(".carousel-toggle-tag.clicked-active"));
        addArr.push(value.getElementsByClassName("carousel-toggle-tag")[getCarDataIdx]);
    });
    classToggle(removeArr, addArr);
    // end to invoke classToggle

    carousel.setAttribute("data-idx", getCarDataIdx);
};

// end carousel

// start dropdown

const dropdownToggles = [...document.querySelectorAll(".dropdown-toggle")];

dropdownToggles.forEach(value => {
    value.addEventListener("click", (e) => {
        e.preventDefault();
        value.classList.toggle("clicked-active-dropdown");
    });
});

// end dropdown

// start badge

const badgeBtn = document.querySelectorAll(".badge-btn");

function toAddBadgeNum(){
    let x = 0;
    while(x < badgeBtn.length){
        const badge = badgeBtn[x].querySelector(".badge");

        const dataBadge = badgeBtn[x].getAttribute("data-badge")
        const jsObj = toGetLocalVal(dataBadge);

        if(!jsObj){
            badge.innerText = "";
            return;
        }

        if(Object.keys(jsObj).length > 0){
            badge.innerText = Object.keys(jsObj).length;
        }else{
            badge.innerText = ""; 
        }

        x++;
    };
};

toAddBadgeNum();

const badgeCardSections = document.querySelectorAll(".badge-card-section");

badgeCardSections.forEach(value => {
    value.addEventListener("click", (e) => {
        if(e.target === value) value.style.display = "none";
    });

    value.querySelector(".cancel-btn").addEventListener("click", () => value.style.display = "none");
});

// end badge

// start form control

const formFloatingControls = Array.from(document.querySelectorAll(".form-floating .form-control"));

formFloatingControls.forEach(value => {
    value.addEventListener("focusin", ()=>{
        const formFloating = value.parentElement;

        const formLabel = formFloating.querySelector(".form-label");

        if(formLabel.childElementCount === 1){
            const formLabelTextArr = Array.from(formLabel.innerText);
            formLabel.innerHTML = "";
            
            formLabelTextArr.forEach(value =>  formLabel.innerHTML += `<span>${value}</span>`);
        }
           
        const spanTags = [...formLabel.children];
        spanTags.forEach((value,index) => value.style.transitionDelay = (0.05 * index) + "s");

        setTimeout(() => formFloating.classList.add("focused"), 1);
    });

    value.addEventListener("focusout", ()=>{
        if(value.value.length > 0) return;

        const formFloating = value.parentElement;

        const spanTags = [...formFloating.querySelectorAll(".form-label span")];
        let finalTranDelay = +spanTags[spanTags.length - 1].style.transitionDelay.replace("s","")
        
        spanTags.forEach(value => {
            value.style.transitionDelay = finalTranDelay + "s";
            finalTranDelay -= 0.05;
        });
        
        formFloating.classList.remove("focused");
    });
});

// end form control

// start toast alert

function toMakeToastAlert(txt){
    const toastAlertCon = document.querySelector(".toast-alert-con");
    if(toastAlertCon){
        toastAlertCon.style.display = "block";
        toastAlertCon.addEventListener("click",(e)=>{
            if(e.target === toastAlertCon) toCancelToastAlertCon(toastAlert,toastAlertH,toastAlertCon);
        });

        const toastAlert = toastAlertCon.querySelector(".toast-alert");
        const toastAlertH = -toastAlert.offsetHeight;
        
        toMakeToastAlertAni(toastAlert,0,toastAlertH,0);
        setTimeout(()=> toMakeToastAlertAni(toastAlert,2,0,0.15), 150);

        const toastAlertCancelBtn = toastAlert.querySelector(".cancel-btn");
        toastAlertCancelBtn.addEventListener("click", () => {
            toCancelToastAlertCon(toastAlert,toastAlertH,toastAlertCon);
        });

        toastAlertCon.querySelector(".text").innerText = txt;
    };
    
};

function toMakeToastAlertAni(tag,topval,tranyval,trans){
    tag.style.setProperty("top", topval + "%");
    tag.style.setProperty("transform", `translateY(${tranyval}px)`);
    tag.style.setProperty("transition", `all ${trans}s ease-out`);
}

function toCancelToastAlertCon(tag,height,con){
    toMakeToastAlertAni(tag,0,height,0.15);
    setTimeout(()=> con.style.display = "none", 150);
}

// end toast alert

// start left side bar

const leftSideBarSection = document.querySelector("#left-side-bar-section"),
    leftSideBarBtn = document.querySelector("#left-side-bar-section .left-side-bar-btn");

if(leftSideBarBtn){
    leftSideBarBtn.addEventListener("click", () => leftSideBarSection.classList.toggle("to-right"));
}

// end left side bar

// start quality control

let qcInVal;
function toChangeNormalQC(e, sign, input){
    const qcTag = document.getElementById(input);
    
    if(qcTag){
        let qcVal = Number(qcTag.value);
        if(sign === "plus"){
            qcVal++;
        }else if(sign === "minus"){
            if(qcVal > 1) qcVal--;
        }else if(sign === "in"){
            qcInVal = qcVal;
        }else if(sign === "out"){
            if(qcVal < 1) qcVal = qcInVal;
        }

        qcTag.value = qcVal;
        return qcVal
    }
}

// end quality control

// start del tag 

function delTagFun(event){
    if(event.target.classList.contains("del-tag")){
        event.target.remove();
    } 
}

// end del tag

// start copyright year

const copyrightYear = document.querySelector(".cr-year");
if(copyrightYear) copyrightYear.innerText = new Date().getUTCFullYear();

// end copyright Year