// start menu card 

const menuNavItems = document.querySelectorAll("#left-side-bar-section .nav-item"),
    menuCardMove = document.querySelector("#menu-section .card-move"),
    menuThirdCon = document.querySelector("#menu-section .third-con");;

let filterMenuArr, 
    menuCardLimit, menuCardLimitIdx = 0,
    menuCurrentIdx = 0,
    menuCardCon, newMenuPrevBtn, newMenuNextBtn, newMenuNumBtnCon;

function filterMenu(getDataFilter){
    if(getDataFilter === "all"){
        filterMenuArr = menuArr;
    }else{
        filterMenuArr = menuArr.filter(value => value.type.includes(getDataFilter));
    }

   toAddMenuCard(filterMenuArr);
}

[...menuNavItems].forEach(value => {
    value.addEventListener("click",()=>{
        menuCardMove.style.transform = "translateX(0px)";
        filterMenu(value.getAttribute("data-filter"));
    });
});

menuNavItems[0].click();

function toAddMenuCard(filterMenuArr){
    menuCardLimitIdx = menuCurrentIdx = 0;
    menuCardMove.innerHTML = "";

    let newCardConTag = document.createElement("div");
    newCardConTag.className = "card-con";

    filterMenuArr.forEach((value,index) => {
        if(menuCardLimitIdx === menuCardLimit){
            newCardConTag = document.createElement("div");
            newCardConTag.className = "card-con";
            menuCardLimitIdx = 0;
        }

        newCardConTag.innerHTML += `
            <div class="card">
                <img src="${value.img}" alt="menu${value.id}" class="card-img"/>
                <div class="card-body">
                    <h3 class="card-title">${value.name}</h3>
                    <span class="card-price">Ks ${value.price}</span>
                    <button class="btn card-btn add-btn" data-id="${value.id}" onclick="menuToAddBasketShopping(event)">
                        <span class="text">Add</span> <i class="fa-solid fa-basket-shopping"></i>
                    </button>
                </div>  
            </div>`;

        menuCardMove.appendChild(newCardConTag);

        const addBtn = document.querySelectorAll("#menu-section .card-btn.add-btn")[index];
        const jsMenuObj = toGetLocalVal("menu");
        if(jsMenuObj){
            if(Object.keys(jsMenuObj).length > 0){
                for(let key in jsMenuObj){
                    if(menuArr[jsMenuObj[key].clickedidx].id === value.id){
                        if(jsMenuObj[key].isclicked) toMakeMenuCardDisabled(addBtn);
                    }
                }
            }
        }

        const totalHeight = Math.floor(menuCardMove.getBoundingClientRect().height);
        const cardTag = document.querySelector("#menu-section .card");
        const cardHeight = Math.floor(cardTag.getBoundingClientRect().height) + 16; // for 1rem

        const WIH = window.innerWidth;
        let cardNum;
        if(WIH <= 576){
            cardNum = 1;
        }else if(WIH <= 768){
            cardNum = 3;
        }else if(WIH <= 992){
            cardNum = 4;
        }else if(WIH > 992){
            cardNum = 5;
        }

        menuCardLimit = Math.floor(totalHeight / cardHeight) * cardNum;
        menuCardLimitIdx++;
    });

    setMenuNeed();
};

function toMakeMenuCardDisabled(tag){
    tag.classList.add("disabled");
    tag.querySelector(".text").innerText = "Added";
    tag.removeAttribute("onclick");
}

function menuToAddBasketShopping(e){
    toMakeMenuCardDisabled(e.currentTarget)
    
    const dataId = Number(e.currentTarget.getAttribute("data-id"));

    let jsMenuObj = toGetLocalVal("menu");
    if(!jsMenuObj) jsMenuObj = {};
    jsMenuObj["menu"+dataId] = {clickedidx: dataId - 1, isclicked: true, quantity: 1};
    toAddLocalVal("menu",jsMenuObj);
    
    toAddBadgeNum();
}

function setMenuNeed(){
    menuCardCon = Array.from(document.querySelectorAll("#menu-section .card-con"));

    menuCardCon.forEach((value,index) => {
        value.style.left = (menuCardMove.getBoundingClientRect().width * index) + "px"
    });

    menuThirdCon.innerHTML = "";

    if(menuCardCon.length > 1){
        newMenuPrevBtn = document.createElement("div");
        newMenuPrevBtn.className = "btn btn-normal left-btn";
        newMenuPrevBtn.innerHTML = "<i class='fa-solid fa-arrow-left-long'></i>";
        newMenuPrevBtn.setAttribute("onclick","toMakeCardMove('prev')");
        newMenuPrevBtn.style.setProperty("visibility","hidden");

        newMenuNextBtn = document.createElement("div");
        newMenuNextBtn.className = "btn btn-normal right-btn";
        newMenuNextBtn.innerHTML = "<i class='fa-solid fa-arrow-right-long'></i>";
        newMenuNextBtn.setAttribute("onclick","toMakeCardMove('next')");

        newMenuNumBtnCon = document.createElement("div");
        newMenuNumBtnCon.className = "num-btn-con";

        for(let i = 0; i < menuCardCon.length; i++){
            const newNumBtn = document.createElement("div");
            newNumBtn.className = "btn btn-normal num-btn";
            if(i === 0) newNumBtn.classList.add("clicked-active");
            newNumBtn.innerText = i + 1;
            newNumBtn.setAttribute("onclick",`toMakeCardMove(${i})`);

            newMenuNumBtnCon.appendChild(newNumBtn);
        }

        menuThirdCon.append(newMenuPrevBtn,newMenuNumBtnCon,newMenuNextBtn);

        // start scroll
        newMenuNumBtnCon.addEventListener('touchstart',menuTouchStart);
        newMenuNumBtnCon.addEventListener('touchend',menuTouchEnd);
        newMenuNumBtnCon.addEventListener('touchmove',menuTouchMove);

        newMenuNumBtnCon.addEventListener('mousedown',menuTouchStart);
        newMenuNumBtnCon.addEventListener('mouseup',menuTouchEnd);
        newMenuNumBtnCon.addEventListener('mouseleave',menuTouchEnd);
        newMenuNumBtnCon.addEventListener('mousemove',menuTouchMove);
        // end scroll
    }
}

function toMakeCardMove(direction){
    // start carousel
    if(direction === 'next'){
        menuCurrentIdx++;
    }else if(direction === 'prev'){
        menuCurrentIdx--;
    }else{
        menuCurrentIdx = direction;
    }

    if(menuCurrentIdx >= menuCardCon.length - 1){
        newMenuNextBtn.style.setProperty("visibility", "hidden");
        newMenuPrevBtn.style.setProperty("visibility", "visible");
    }else if(menuCurrentIdx <= 0){ 
        newMenuPrevBtn.style.setProperty("visibility", "hidden");
        newMenuNextBtn.style.setProperty("visibility", "visible");
    }else{
        newMenuPrevBtn.style.setProperty("visibility", "visible");
        newMenuNextBtn.style.setProperty("visibility", "visible");
    }

    const numBtns = document.querySelectorAll("#menu-section .num-btn-con .num-btn");
    const arr = [numBtns[menuCurrentIdx]];
    classToggle(numBtns,arr);

    menuCardMove.style.transform = "translateX(-" + menuCardCon[menuCurrentIdx].style.left + ")";
    // end carousel
}

// end menu card

// start scrollbar

let menuIsPressed,
    menuStartX, menuMoveX;

function menuTouchStart(e){
    menuIsPressed = true;
    newMenuNumBtnCon.classList.add('grabbing');
    menuStartX = menuGetX(e);
};

function menuTouchEnd(e){
    menuIsPressed = false;
    newMenuNumBtnCon.classList.remove('grabbing');
    newMenuNumBtnCon.scrollLeft += menuStartX - menuMoveX;
};

function menuTouchMove(e){
    if(menuIsPressed) menuMoveX = menuGetX(e);
};

function menuGetX(e){
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
}

// end scrollbar

// start basket shopping

const basketShoppingBadgeBtn = document.querySelector(".breadcrumb-con #basket-shopping-badge-btn");

basketShoppingBadgeBtn.addEventListener("click",()=> {
    const dataTarget = basketShoppingBadgeBtn.getAttribute("data-target");
    document.querySelector("#" + dataTarget).style.display = "flex";
    toAddBasketShoppingCard();
});

const productShoppingCardCon = document.querySelector("#basket-shopping-card-section .card-con"),
    productShoppingFinalTotalCon = document.querySelector("#basket-shopping-card-section .final-total-con");

function toAddBasketShoppingCard(){
    let finalTotal = 0;
    productShoppingCardCon.innerHTML = productShoppingFinalTotalCon.innerHTML = "";

    const jsMenuObj = toGetLocalVal("menu");
    if(jsMenuObj){
        if(Object.keys(jsMenuObj).length > 0){
            for(let key in jsMenuObj){
                let menu = menuArr[jsMenuObj[key].clickedidx];
                let total = menu.price * jsMenuObj[key].quantity;
    
                productShoppingCardCon.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <img src="${menu.img}" alt="menu${menu.id}"/>
                                <h3 class="card-title">${menu.name}</h3>
                            </div>
                    
                            <div class="delete-con">
                                <div class="btn delete-btn normal-color-hover" data-id="${menu.id}" onclick="toDeleteBaskeShoppingCard(event)">
                                    <i class="fa-regular fa-trash-can"></i>
                                </div>
                            </div>
                        </div>
                    
                        <div class="card-body">
                            <div class="price each-price">Ks ${menu.price}</div>
                    
                            <div class="qc-control-con">
                                <input type="number" name="qc" id="qc${menu.id}" class="qc" value="${jsMenuObj[key].quantity}" data-id="${menu.id}" onfocusin="toChangeBasketQC(event,'in','qc${menu.id}')"
                                onfocusout="toChangeBasketQC(event,'out','qc${menu.id}')"/>
                    
                                <div class="qc-btn-con">
                                    <span class="plus-btn" data-id="${menu.id}" onclick="toChangeBasketQC(event,'plus','qc${menu.id}')">
                                        <i class="fa-solid fa-plus"></i>
                                    </span>
                    
                                    <span class="minus-btn" data-id="${menu.id}" onclick="toChangeBasketQC(event,'minus','qc${menu.id}')">
                                        <i class="fa-solid fa-minus"></i>
                                    </span>
                                </div>
                            </div>
                    
                            <div class="price total-price">Ks ${total}</div>
                        </div>
                    </div>`;
        
                finalTotal += total;
            }
        
            productShoppingFinalTotalCon.innerHTML = `
                <span class="price final-total to-read">Ks ${finalTotal}</span>
                <a href="#" class="btn btn-rainbow order-btn" data-text="Order Now">Order Now</a>`;
        }else{
            productShoppingCardCon.innerHTML = "<a href='./menu.html' class='add-item'>To Add Menu Item</a>";
        };
    }else{
        productShoppingCardCon.innerHTML = "<a href='./menu.html' class='add-item'>To Add Menu Item</a>";
    };
};

function toDeleteBaskeShoppingCard(e){
    const dataId = Number(e.currentTarget.getAttribute("data-id"));
    const jsMenuObj = toGetLocalVal("menu");
    delete jsMenuObj["menu" + dataId];
    toAddLocalVal("menu",jsMenuObj);

    toAddMenuCard(filterMenuArr);

    toAddBadgeNum();
    toAddBasketShoppingCard();
}

function toChangeBasketQC(e,sign,input){
    const qcVal = toChangeNormalQC(e,sign,input);

    if(sign !== "in"){
        const dataId = e.currentTarget.getAttribute("data-id");
        const jsMenuObj = toGetLocalVal("menu");
        jsMenuObj["menu"+dataId].quantity = qcVal;
        toAddLocalVal("menu",jsMenuObj);

        toAddBasketShoppingCard();
    }
}

// end basket shopping