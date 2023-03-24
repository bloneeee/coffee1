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
            // console.log(bkD);
            console.log(new Date("1 May 2024 23:36:40"));

            const minDay = new Date(); 
            minDay.setHours(minDay.getHours() + 72); // for 3 days

            const maxDay = new Date(); 
            maxDay.setHours(maxDay.getHours() + 168); // for 7 days

            const fullMinDay = `${minDay.getDate()}-${monthArr[minDay.getMonth()]}-${minDay.getUTCFullYear()} ${minDay.getHours()}:${minDay.getMinutes() + 1}`;

            const fullMaxDay = `${maxDay.getDate()}-${monthArr[maxDay.getMonth()]}-${maxDay.getUTCFullYear()} ${maxDay.getHours()}:${maxDay.getMinutes()}`;

            if(bkDate.getTime() >= minDay.getTime() && bkDate.getTime() <= maxDay.getTime()){
                let jsBookingArr = toGetLocalVal("booking");
                if(!jsBookingArr) jsBookingArr = [];

                jsBookingArr.push({name: bkNameVal, pho: bkPhoVal, dt: bkDtVal, table: bkTableVal});
                toAddLocalVal("booking", jsBookingArr);

                toAddBadgeNum();
                toAddBookingCard();
            }else{
                toMakeToastAlert(`To make booking from ${fullMinDay} to ${fullMaxDay}`);
            }
        }else{
            toMakeToastAlert("Phone number must contain country code and sure number")
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

                const bookingDate = new Date(value.dt);

                const fixedHour = bookingDate.getHours() < 10 
                    ? "0" + bookingDate.getHours() 
                    : bookingDate.getHours();

                const fixedMin = bookingDate.getMinutes() < 10 
                    ? "0" + bookingDate.getMinutes() 
                    : bookingDate.getMinutes();
                    
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

                document.querySelectorAll(".form-floating").forEach(tag => {
                    if(tag.querySelector(".form-control").value) return;
                    tag.className = tag.className.replace(" focused","");
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
                console.log("auto delete");
                toDeleteBookingCard(jsBookingArr, i);
            }
        };
    };
};

// end booking card