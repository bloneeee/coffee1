// start menu card 

const menuNavItems = document.querySelectorAll("#left-side-bar-section .nav-item"),
    menuCardCon = document.querySelector("#menu-section .card-con");

let filterMenuArr;

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
        filterMenu(value.getAttribute("data-filter"));
        classToggle(menuNavItems, [value]);
    });
});
menuNavItems[0].click();

function toAddMenuCard(filterMenuArr){
    menuCardCon.innerHTML = "";

    filterMenuArr.forEach((value,index) => {
        menuCardCon.innerHTML += `
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
    });
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

    jsMenuObj["menu" + dataId] = {clickedidx: dataId - 1, isclicked: true, quantity: 1};
    toAddLocalVal("menu", jsMenuObj);
    
    toAddBadgeNum();
}

// end menu card

// start basket shopping

const basketShoppingBadgeBtn = document.querySelector(".breadcrumb-con #basket-shopping-badge-btn");

basketShoppingBadgeBtn.addEventListener("click", () => {
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
                                <input type="number" name="qc" id="qc${menu.id}" class="qc" value="${jsMenuObj[key].quantity}" data-id="${menu.id}" onfocusin="toChangeBasketQC(event, 'in', 'qc${menu.id}')"
                                onfocusout="toChangeBasketQC(event, 'out', 'qc${menu.id}')"/>
                    
                                <div class="qc-btn-con">
                                    <span class="plus-btn" data-id="${menu.id}" onclick="toChangeBasketQC(event, 'plus', 'qc${menu.id}')">
                                        <i class="fa-solid fa-plus"></i>
                                    </span>
                    
                                    <span class="minus-btn" data-id="${menu.id}" onclick="toChangeBasketQC(event, 'minus', 'qc${menu.id}')">
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
                <a href="#" class="btn btn-100 btn-rainbow order-btn" data-text="Order Now">Order Now</a>`;
        }else{
            productShoppingCardCon.innerHTML = "<a href='./menu.html' class='add-item'>To Add Menu Item</a>";
        }
    }else{
        productShoppingCardCon.innerHTML = "<a href='./menu.html' class='add-item'>To Add Menu Item</a>";
    }
};

function toDeleteBaskeShoppingCard(e){
    const dataId = Number(e.currentTarget.getAttribute("data-id"));

    const jsMenuObj = toGetLocalVal("menu");
    delete jsMenuObj["menu" + dataId];
    toAddLocalVal("menu", jsMenuObj);

    toAddMenuCard(filterMenuArr);

    toAddBadgeNum();
    toAddBasketShoppingCard();
}

function toChangeBasketQC(e, sign, input){
    const qcVal = toChangeNormalQC(e, sign, input);

    if(sign !== "in"){
        const dataId = e.currentTarget.getAttribute("data-id");

        const jsMenuObj = toGetLocalVal("menu");
        jsMenuObj["menu" + dataId].quantity = qcVal;
        toAddLocalVal("menu", jsMenuObj);

        toAddBasketShoppingCard();
    }
}

// end basket shopping