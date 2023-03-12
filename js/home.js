// Start Team Section

const teamTouchSliderCon = document.querySelector('#team-section .touch-slider-con'),
    teamTouchSliderInner = document.querySelector("#team-section .touch-slider-inner"),
    teamTouchSliderItems = [...document.querySelectorAll("#team-section .touch-slider-item")],
    teamCarouselCards = document.querySelectorAll('#team-section .card');

let galleryCurrentIndex = 0,
    galleryIsPressed = false,
    galleryStartX = 0,
    galleryCurrentTranslate = 0,
    galleryPreviousTranslate = 0,
    galleryAniID = 0;

teamTouchSliderItems.forEach((value, index)=>{
    value.addEventListener('dragstart', e => e.preventDefault());
    value.addEventListener('contextmenu', e => e.preventDefault());

    value.addEventListener('touchstart', galleryTouchStart(index));
    value.addEventListener('touchend', galleryTouchEnd);
    value.addEventListener('touchmove', galleryTouchMove);

    value.addEventListener('mousedown', galleryTouchStart(index));
    value.addEventListener('mouseup', galleryTouchEnd);
    value.addEventListener('mouseleave', galleryTouchEnd);
    value.addEventListener('mousemove', galleryTouchMove);
});

function teamTouchSliderMain(index){
    galleryCurrentTranslate = galleryCurrentIndex * -teamTouchSliderInner.getBoundingClientRect().width;
    galleryPreviousTranslate = galleryCurrentTranslate;
    gallerySetX();

    const activeTags = document.querySelectorAll('#team-section .touch-slider-con .clicked-active');
    const arr = [
        teamTouchSliderItems[galleryCurrentIndex],
        teamCarouselCards[galleryCurrentIndex]
    ];
    classToggle(activeTags, arr);
};
teamTouchSliderMain();

function galleryTouchStart(index){
    return function(event){
        // console.log(teamDirection);
        galleryIsPressed = true;
        galleryCurrentIndex = index;
        galleryStartX = galleryCountX(event);

        galleryAniID = requestAnimationFrame(galleryAni);
        teamTouchSliderInner.classList.add('grabbing');
    };
};

function galleryTouchEnd(){
    galleryIsPressed = false;

    cancelAnimationFrame(galleryAni);
    teamTouchSliderInner.classList.remove('grabbing');
    
    let difference = galleryCurrentTranslate - galleryPreviousTranslate;
    // console.log(difference);
    if(difference < -100 && galleryCurrentIndex < teamTouchSliderItems.length - 1) galleryCurrentIndex++;
    if(difference > 100 && galleryCurrentIndex > 0) galleryCurrentIndex--;
    // console.log(galleryCurrentIndex);

    teamTouchSliderMain();
};

function galleryTouchMove(event){
    if(galleryIsPressed){ // for mousemove
        let moveX = galleryCountX(event);
        galleryCurrentTranslate = galleryPreviousTranslate + moveX - galleryStartX;
    };
};

function galleryCountX(event){
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
};

function galleryAni(){
    gallerySetX();
    if(galleryIsPressed) requestAnimationFrame(galleryAni);
};

function gallerySetX(){
    teamTouchSliderInner.style.transform = `translate(${galleryCurrentTranslate}px)`;
};

let teamDir = 1;
const teamTouchSliderResultFun = () => {
    const {carIdx, carDir} = toChCarIdx(galleryCurrentIndex, teamDir, teamTouchSliderItems.length);

    galleryCurrentIndex = carIdx;
    teamDir = carDir;

    teamTouchSliderMain();
}

let teamTouchSliderResult = setInterval(teamTouchSliderResultFun, 3000);
toStopRide(teamTouchSliderCon, teamTouchSliderResultFun, teamTouchSliderResult, 3000);

// End Team Section

// Start Galley Section 

const galleryNavItems = [...document.querySelectorAll("#gallery-section .gallery-nav-item")],
    galleryNavBgColors = document.querySelectorAll("#gallery-section .gallery-nav-bg-color"),
    galleryImgCon = document.querySelector("#gallery-section .gallery-img-con");

let filterGalleryArr, currentGalleryIndex, 
    newViewGalleryNumTag, newViewGalleryImgTag, // to change tags
    getGalleryImg; // to select tag

// for gallery navbar
let galleryActiveIndex, galleryResult;
function toToggleGalleryNavItem(index, xValue){
    if(galleryActiveIndex === index){ // 0 === 1
        galleryNavBgColors[galleryActiveIndex].style.transform = `translateX(0%)`;
    }else{
        galleryNavBgColors[galleryActiveIndex].style.transform = `translateX(${xValue}%)`;
    }

    const activeTags = document.querySelectorAll("#gallery-section .gallery-nav-item.clicked-active");
    const arr = [ galleryNavItems[galleryActiveIndex] ];
    classToggle(activeTags, arr);
}

function toSelectGalleryNavItem(index){
    clearInterval(galleryResult);
    
    const activeTag = document.querySelector("#gallery-section .gallery-nav-item.clicked-active");
    galleryActiveIndex = galleryNavItems.findIndex(value => value === activeTag);
    if(galleryActiveIndex === -1) galleryActiveIndex = 0;

    if(galleryActiveIndex < index){
        galleryResult = setInterval(()=>{
            toToggleGalleryNavItem(index, 100);
            galleryActiveIndex++;
            if(galleryActiveIndex > index) clearInterval(galleryResult)
        }, 100);
    }else if(galleryActiveIndex > index){
        galleryResult = setInterval(()=>{
            toToggleGalleryNavItem(index, -100);
            galleryActiveIndex--;
            if(galleryActiveIndex < index) clearInterval(galleryResult);
        }, 100);
    }else{
        toToggleGalleryNavItem(index, 100);
    }
    
    const getDataFilter = galleryNavItems[index].getAttribute('data-filter');
    const getDataGrid = galleryNavItems[index].getAttribute('data-grid');
    toAddGalleryImg(getDataFilter, getDataGrid);
};
toSelectGalleryNavItem(0);

galleryNavItems.forEach((value, index) => {
    value.addEventListener('click', () => toSelectGalleryNavItem(index));
});

// for gallery
function toAddGalleryImg(getDataFilter, getDataGrid){
    galleryImgCon.innerHTML = "";
    galleryImgCon.className = "gallery-img-con " + getDataGrid;

    if(getDataFilter === "all"){
        filterGalleryArr = galleryArr;
    }else{
        filterGalleryArr = galleryArr.filter(value => value.type === getDataFilter);
    }

    for(let x = 0; x < filterGalleryArr.length; x++){
        const galleryImgTag = document.createElement("div");
        
        galleryImgTag.className = "css-img img-hover-effect gallery-img reveal-tag";
        galleryImgTag.setAttribute('onclick', `toViewGalleryImg(${x})`);
        galleryImgTag.style.cssText = `
            background-image: url('${filterGalleryArr[x].src}');
            grid-area: gallery${x+1};`;

    
        galleryImgCon.appendChild(galleryImgTag);
    }
}

// for view gallery
function toViewGalleryImg(index){
    currentGalleryIndex = index;

    const newViewGalleryBGTag = document.createElement('div');
    newViewGalleryBGTag.className = 'view-gallery-background del-tag';
    newViewGalleryBGTag.setAttribute('onclick','delTagFun(event)');

    newViewGalleryNumTag = document.createElement('div');
    newViewGalleryNumTag.className = 'view-gallery-number';

    const newViewGalleryImgBtnConTag = document.createElement("div")
    newViewGalleryImgBtnConTag.className = "view-gallery-img-btn-con";
 
    newViewGalleryImgTag = document.createElement('img');
    newViewGalleryImgTag.className = 'view-gallery-img';
    
    const newViewGalleryBtnConTag = document.createElement('div');
    newViewGalleryBtnConTag.className = 'view-gallery-btn-con';

    const newGalleryPrevBtnTag = document.createElement("button");
    newGalleryPrevBtnTag.className = "btn btn2D btn2D-prev";
    newGalleryPrevBtnTag.setAttribute('onclick','toChangeGalleryIndex(-1)');

    const newGalleryNextBtnTag = document.createElement("button");
    newGalleryNextBtnTag.className = "btn btn2D btn2D-next";
    newGalleryNextBtnTag.setAttribute('onclick','toChangeGalleryIndex(1)');

    newViewGalleryBtnConTag.append(newGalleryPrevBtnTag, newGalleryNextBtnTag);
    newViewGalleryImgBtnConTag.append(newViewGalleryImgTag, newViewGalleryBtnConTag);
    newViewGalleryBGTag.append(newViewGalleryNumTag, newViewGalleryImgBtnConTag);

    document.body.appendChild(newViewGalleryBGTag);

    toChangeGalleryMain(index);
};

function toChangeGalleryMain(index){
    getGalleryImg = document.querySelectorAll('.gallery-img');

    const getElementProperty = window.getComputedStyle(getGalleryImg[index]);
    const getElementValue = getElementProperty.getPropertyValue('background-image');

    const splitValue = getElementValue.split("/img/");
    const replaceValue = splitValue[1].replace('")', '');

    newViewGalleryNumTag.innerText = index + 1;
    newViewGalleryImgTag.setAttribute('src', `./assets/img/${replaceValue}`);
}

function toChangeGalleryIndex(dir){
    if(dir == 1){
        currentGalleryIndex = (currentGalleryIndex + 1) % getGalleryImg.length;
    }else{
        currentGalleryIndex = (currentGalleryIndex - 1 + getGalleryImg.length) % getGalleryImg.length;
    }

    toChangeGalleryMain(currentGalleryIndex);
}

// End Gallery Section