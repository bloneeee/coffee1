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

        if(value.open){
            const fullOpenTime = `${toMakeLeading(value.open.hour, 2, "0")}:${toMakeLeading(value.open.min, 2, "0")}`;
            const fullCloseTime = `${toMakeLeading(value.close.hour, 2, "0")}:${toMakeLeading(value.close.min, 2, "0")}`;

            newOCTimeTag.innerText = `${fullOpenTime} ~ ${fullCloseTime}`;
        }else{
            newOCTimeTag.classList.add("closed");
            newOCTimeTag.innerText = "closed";
        }

        newTrTag.append(newDayTag, newOCTimeTag);
        ocTimetableBody.appendChild(newTrTag);
    });
};
timeToAddOCTimetable();

// end to make timetable

// start booking badge btn

const bookingBadgeBtn = document.querySelector(".breadcrumb-con #booking-badge-btn");
bookingBadgeBtn.addEventListener("click", () => {
    const dataTarget = bookingBadgeBtn.getAttribute("data-target");
    document.querySelector("#" + dataTarget).style.display = "flex";

    toAutoDeleteBookingCard();
    toAddBookingCard();
});

// end booking badge btn

// start add booking to localStorage

const bkForm = document.querySelector("#booking-form-section form"),
    bkName = document.getElementById("bk-name");
    bkPho = document.getElementById("bk-pho"),
    bkDt = document.getElementById("bk-dt"),
    bkTable = document.getElementById("bk-table"),
    bkSubmit = document.getElementById("bk-submit");

bkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const bkNameVal = bkName.value,
        bkPhoVal = bkPho.value,
        bkDtVal = bkDt.value,
        bkTableVal = bkTable.value;

    if(bkNameVal && bkPhoVal && bkDtVal && bkTableVal){
        if(bkPhoVal.length >= 12){
            const bkDate = new Date(bkDtVal);
            bkDate.setHours(0, 0, 0, 0);
            // console.log("bkDate", bkDate, bkDate.getTime());

            const closeLists = ocTimetableArr.filter(val => !val.open);
            const closeDays = closeLists.map(val => val.day.toLocaleLowerCase());
            
            const bkDay = dayArr[bkDate.getDay()].toLowerCase();
            if(closeDays.indexOf(bkDay) > -1){
                toMakeToastAlert(`${bkDay.toUpperCase()} is close.`);
                return;
            }

            const minDate = new Date(); 
            minDate.setDate(minDate.getDate() + 3); // for 3 days
            minDate.setHours(0, 0, 0, 0);
            // console.log("minDate", minDate, minDate.getTime());
            
            const maxDate = new Date(); 
            maxDate.setDate(maxDate.getDate() + 7); // for 7 days
            maxDate.setHours(0, 0, 0, 0);
            // console.log("maxDate", maxDate,  maxDate.getTime());

            const fullminDate = `${minDate.getDate()} ${monthArr[minDate.getMonth()]} ${minDate.getUTCFullYear()}`;

            const fullmaxDate = `${maxDate.getDate()} ${monthArr[maxDate.getMonth()]} ${maxDate.getUTCFullYear()}`;

            if(bkDate.getTime() >= minDate.getTime() && bkDate.getTime() <= maxDate.getTime()){
                const bkDate = new Date(bkDtVal);
                const bkM = toMakeHToM(bkDate.getHours(), bkDate.getMinutes());

                const ttDay = ocTimetableArr[bkDate.getDay()];

                const openM = toMakeHToM(ttDay.open.hour, ttDay.open.min);
                const closeM = toMakeHToM(ttDay.close.hour, ttDay.close.min);

                const fullOpenTime = toMakeMToHM(openM, "txt");
                const fullCloseTime = toMakeMToHM(closeM, "txt");
                const leastCloseTime = toMakeMToHM(closeM - 30, "txt");

                if(bkM >= openM && bkM <= closeM - 30){
                    let jsBookingArr = toGetLocalVal("booking");
                    if(!jsBookingArr) jsBookingArr = [];

                    jsBookingArr.push({name: bkNameVal, pho: bkPhoVal, dt: bkDtVal, table: bkTableVal});
                    toAddLocalVal("booking", jsBookingArr);

                    toAddBadgeNum();
                    toAddBookingCard();
                }else{
                    toMakeToastAlert(`According to the time table, ${ttDay.day} starts at ${fullOpenTime} and ends at ${fullCloseTime}. But to register at latest ${leastCloseTime}.`);
                }       
            }else{
                toMakeToastAlert(`To make booking from ${fullminDate} to ${fullmaxDate}.`);
            }
        }else{
            toMakeToastAlert("Phone number must contain country code and make sure your number.")
        }
    }else{
        toMakeToastAlert("Please fill the form fully !!!");
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
                            <span class="dt">Date: ${value.dt}</span>
                            <span class="table">Table: ${value.table}</span>
                        </div>
                    </div>`;

                bkName.value = bkPho.value = bkDt.value  = "";
                bkTable.value = "1";

                document.querySelectorAll(".form-floating").forEach(tag => {
                    if(tag.classList.contains("no-remove")) return;
                    tag.className = tag.className.replace(" focused", "");
                });
            }
        }else{
            bookingCardCon.innerHTML = "<a href='./booking.html' class='add-item'>To Make Booking</a>";
        };
    }else{
        bookingCardCon.innerHTML = "<a href='./booking.html' class='add-item'>To Make Booking</a>";
    };
};

function toDeleteBookingCard(arr, idx){
    arr.splice(idx, 1);

    toAddLocalVal("booking", arr);
    toAddBadgeNum();
    toAddBookingCard();
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
        toDeleteBookingCard(jsBookingArr, dataId);
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
                console.log("auto deleted");
                toDeleteBookingCard(jsBookingArr, i);
            }
        };
    };
};

// end booking card