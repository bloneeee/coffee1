// start to make timetable

const ocTimetableBody = document.querySelector(".oc-timetable tbody");
function timeToAddOCTimetable(){
    ocTimetableBody.innerHTML = "";

    ocTimetableArr.forEach(value => {
        const newTrTag = document.createElement("tr");

        const newDayTag = document.createElement("td");
        newDayTag.className = "day";
        newDayTag.innerText = value.day + " :";

        const newOCTimeTag = document.createElement("td");
        newOCTimeTag.className = "oc-time"
        newOCTimeTag.innerText = value.octime;

        if(value.octime.toLowerCase() === "closed") newOCTimeTag.classList.add("closed");

        newTrTag.append(newDayTag, newOCTimeTag);
        ocTimetableBody.appendChild(newTrTag);
    });
};
timeToAddOCTimetable();

// end to make timetable

// start booking badge btn

const bookingBadgeBtn = document.querySelector(".breadcrumb-con #booking-badge-btn");

bookingBadgeBtn.addEventListener("click",()=> {
    const dataTarget = bookingBadgeBtn.getAttribute("data-target");
    document.querySelector("#" + dataTarget).style.display = "flex";
    toAutoDeleteBookingCard();
    toAddBookingCard();
});

// end booking badge btn

// start add booking to localStorage

const bkName = document.getElementById("bk-name");
    bkPho = document.getElementById("bk-pho"),
    bkDt = document.getElementById("bk-dt"),
    bkTable = document.getElementById("bk-table"),
    bkSubmit = document.getElementById("bk-submit");

bkSubmit.addEventListener("click",(e)=>{
    e.preventDefault();

    const bkNameVal = bkName.value,
        bkPhoVal = bkPho.value,
        bkDtVal = bkDt.value,
        bkTableVal = bkTable.value;

    if(bkNameVal && bkPhoVal && bkDtVal && bkTableVal){
        if(bkPhoVal.length >= 12){
            const bkDate = new Date(bkDtVal);
            const today = new Date(); 
            today.setHours(today.getHours() + 72); // for 3 days

            if(bkDate.getTime() > today.getTime()){
                let jsBookingArr = toGetLocalVal("booking");
                if(!jsBookingArr) jsBookingArr = [];
                jsBookingArr.push({name: bkNameVal, pho: bkPhoVal, dt: bkDtVal, table: bkTableVal});
                toAddLocalVal("booking",jsBookingArr);

                toAddBadgeNum();
                toAddBookingCard();
            }else{
                toMakeToastAlert(`To Booking At Least ${today.getDate()} - ${monthArr[today.getMonth()]} - ${today.getUTCFullYear()}`);
            }
        }else{
            toMakeToastAlert("Phone Number Must Have At Least 12")
        }
    }else{
        toMakeToastAlert("Fill Form Fully !!!");
    }
});

// end add booking to localStorage

// start booking card

const bookingCardCon = document.querySelector("#booking-card-section .card-con");

function toAddBookingCard(){
    bookingCardCon.innerHTML = "";

    const jsBookingArr = toGetLocalVal("booking");
    if(jsBookingArr){
        if(jsBookingArr.length > 0){
            for(let i = 0; i < jsBookingArr.length; i++){
                const value = jsBookingArr[i];
                if(!value) continue; // for null (delete arr[idx])

                const bookingDate = new Date(value.dt);
                const fixedHour = bookingDate.getHours() < 10 ? "0" + bookingDate.getHours() : bookingDate.getHours();
                const fixedMin = bookingDate.getMinutes() < 10 ? "0" + bookingDate.getMinutes() : bookingDate.getMinutes();
                const fixedDate = `
                    ${bookingDate.getDate()} - 
                    ${monthArr[bookingDate.getMonth()]} - 
                    ${bookingDate.getUTCFullYear()} / 
                    ${fixedHour} : 
                    ${fixedMin}`;

                bookingCardCon.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                            <div class="delete-con">
                                <div class="btn delete-btn normal-color-hover" data-id="${i}" onclick="toCheckDeleteBookingCard(event)">
                                    <i class="fa-regular fa-trash-can"></i>
                                </div>
                            </div>
                        </div>

                        <div class="card-body">
                            <span class="name">Name: ${value.name}</span>
                            <span class="pho">Pho: ${value.pho}</span>
                            <span class="dt">Date: ${fixedDate}</span>
                            <span class="table">Table: ${value.table}</span>
                        </div>
                    </div>`;

                bkName.value = bkPho.value = bkDt.value  = "";
                bkTable.value = "1";

                document.querySelectorAll(".form-floating").forEach(value => {
                    value.className = value.className.replace(" focused","");
                });
            }
        }else{
            bookingCardCon.innerHTML = "<a href='./booking.html' class='add-item'>To Make Booking</a>";
        };
    }else{
        bookingCardCon.innerHTML = "<a href='./booking.html' class='add-item'>To Make Booking</a>";
    };
};

function toDeleteBookingCard(arr,idx){
    arr.splice(idx,1);
    toAddLocalVal("booking",arr);
    toAddBadgeNum();
}

function toCheckDeleteBookingCard(e){
    const dataId = +e.currentTarget.getAttribute("data-id");
    const jsBookingArr = toGetLocalVal("booking");
    const bookingDate = new Date(jsBookingArr[dataId].dt);

    const today = new Date();
    today.setHours(today.getHours() + 24);

    if(today.getTime() >= bookingDate.getTime()){
        toMakeToastAlert("Booking has already started. You can't cancel.");
    }else{
        toDeleteBookingCard(jsBookingArr,dataId);
        toAddBookingCard();
    }
}

function toAutoDeleteBookingCard(){
    const jsBookingArr = toGetLocalVal("booking");
    if(jsBookingArr){
        for(let i = 0; i < jsBookingArr.length; i++){
            const value = jsBookingArr[i];
            if(!value) continue; // for null (delete arr[idx])

            const bookingDate = new Date(value.dt);
            const today = new Date();
            if(today.getTime() >= bookingDate.getTime()) {
                console.log("auto delete");
                toDeleteBookingCard(jsBookingArr,i);
            }
        };
    };
};

// end booking card