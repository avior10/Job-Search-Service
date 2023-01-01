/* loading from the local storage function */
const loadFromStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

let saved_jobs = loadFromStorage("saved_jobs") ? loadFromStorage("saved_jobs") : []; //array for the jobs that has been saved
let favorite_jobs_id = loadFromStorage("favorite_jobs_id") ? loadFromStorage("favorite_jobs_id") : []; //array for the Id of the favorite jobs

/* Catching the Needed Elements */
const container = document.querySelector(".container");
const fullstack = document.querySelector("#fullstack_btn");
const home_btn = document.querySelector("#home_btn");
const All_Jobs = document.querySelector("#all_job_btn");
const categories = document.querySelector("#navbarDropdown");
const Saved_Jobs = document.querySelector("#SavedJobs_btn");
const drop_menu = document.querySelector(".dropdown-menu");
const search_btn = document.querySelector("#button_search");

/* Default display for container */
function defaultDisplay() {
    const default_div = document.createElement("div");
    default_div.style.margin = "20px";
    const h1_ele = document.createElement("h1");
    h1_ele.innerHTML = `Wellcome to our job search service`;
    const p_ele = document.createElement("p");
    p_ele.innerHTML = `To use our service all what you need is a good heart, and a little mind 🤠`;
    const hr_ele = document.createElement("hr");
    const h2_ele = document.createElement("h2");
    h2_ele.innerHTML = `Enjoy!`;
    default_div.append(h1_ele, p_ele, hr_ele, h2_ele);
    container.append(default_div);
}
defaultDisplay();

/* Catching the url's */
const url_categories = "https://remotive.com/api/remote-jobs/categories";
const url_all_jobs = "https://remotive.com/api/remote-jobs?limit=50";
const job_by_categories = "https://remotive.com/api/remote-jobs?category=";
const search_url = "https://remotive.com/api/remote-jobs?search=java%20script";

/* Constructing the home page */
fullstack.addEventListener("click", (event) => {
    event.preventDefault();
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    defaultDisplay();
})

home_btn.addEventListener("click", (event) => {
    event.preventDefault();
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    defaultDisplay();
})

/* Bringing the categorises from the API */

const getData = async () => {
    const response = await fetch(url_categories);
    const data = await response.json();
    console.log(data.jobs);

    data.jobs.map(category => {
        const li_element = document.createElement("li");

        const a = document.createElement("a");
        a.setAttribute("class", "dropdown-item");
        a.setAttribute("href", "");
        a.append(category.name);

        li_element.append(a);
        drop_menu.append(li_element);

        a.addEventListener("click", async (event) => {
            event.preventDefault();
            container.innerHTML = "";
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.flexWrap = "wrap";

            container.innerHTML = `<div class="spinner-border" role="status">
                 <span class="visually-hidden">Loading...</span>
                 </div>
                `;
            const response = await fetch(`https://remotive.com/api/remote-jobs?category=${category.name}`);
            const data = await response.json();
            console.log(data.jobs);
            container.innerHTML = "";

            for (const cardData of data.jobs) {
                const card = new Card(cardData);
                container.appendChild(card.div_1);
            }

        })
    })
}
getData();

/* Creating Class for any card */

class Card {
    constructor(job) {
        this.div_1 = document.createElement("div");
        this.div_1.setAttribute("class", "col-md-4 col-sm-6 mt-3");

        this.div_2 = document.createElement("div");
        this.div_2.setAttribute("class", "card bg-light mb-3 border-primary");

        this.div_3 = document.createElement("div");
        this.div_3.setAttribute("class", "card-header text-center");
        this.div_3.append(`Company Name : ${job.company_name ?? ""}`);

        this.img = document.createElement("img");
        this.img.setAttribute("src", job.company_logo ?? "")
        this.img.style = "max-height: 150px; object-fit: contain; margin-top: 20px;"

        this.card_body = document.createElement("div");
        this.card_body.classList.add("card-body");

        this.h5 = document.createElement("h5");
        this.h5.setAttribute("class", "card-title text-center text-decoration-underline");
        this.h5.append(job.title ?? "");

        this.p2 = document.createElement("p");
        this.p2.classList.add("card-text");
        this.p2.innerHTML = `${job.description ?? ""}`;
        this.p2.style = "min-height: 280px; max-height: 280px; overflow: scroll;";

        this.p1 = document.createElement("p");
        this.p1.classList.add("card-text");
        this.p1.append(`Salary : ${job.salary ?? ""}`);

        this.a = document.createElement("a");
        this.a.setAttribute("class", "btn btn-success");
        this.a.setAttribute("href", job.url ?? "");
        this.a.setAttribute("target", "_blank");
        this.a.style.marginLeft = "12px"
        this.a.append("See this JOB");

        this.i = document.createElement("i");
        this.i.setAttribute("class", "bi bi-heart");

        this.button = document.createElement("button");
        this.button.setAttribute("class", "btn ml-2");
        this.button.id = "button";
        this.button.style.backgroundColor = "#FFC0CB" //#DE3163
        this.button.innerHTML = "Save this JOB ";
        this.button.addEventListener("click", this.handleClick.bind(this, job.id, job));
        if (favorite_jobs_id.includes(job.id)) {
            this.button.style.backgroundColor = "rgb(247, 111, 133)";
            this.button.innerHTML = "Remove ❤️";
        }

        this.card_footer = document.createElement("div");
        this.card_footer.setAttribute("class", "card-footer text-muted");
        this.card_footer.append(`Type : ${job.job_type ?? ""}`);

        this.card_body.append(this.h5, this.p1, this.p2, this.button, this.a);
        this.div_2.append(this.div_3, this.img, this.card_body, this.card_footer);
        this.div_1.append(this.div_2);


    }

    handleClick(id, job) {
        if (this.button.innerHTML == "Save this JOB ") {
            this.button.innerHTML = "Remove ❤️";
            this.button.style.backgroundColor = "rgb(247, 111, 133)";
            favorite_jobs_id.push(id);
            console.log("the job has saved");
            localStorage.setItem("favorite_jobs_id", JSON.stringify(favorite_jobs_id));
            saved_jobs.push(job);
            localStorage.setItem("saved_jobs", JSON.stringify(saved_jobs));
        }
        else {
            this.button.innerHTML = "Save this JOB ";
            this.button.style.backgroundColor = "#FFC0CB";
            favorite_jobs_id = favorite_jobs_id.filter(item => item != job.id);
            localStorage.setItem("favorite_jobs_id", JSON.stringify(favorite_jobs_id));
            saved_jobs = saved_jobs.filter(item => item.id != job.id);
            localStorage.setItem("saved_jobs", JSON.stringify(saved_jobs));
        }
    }
}

/* Creating Class for saved card only */

class Saved_Card {
    constructor(job) {
        this.div_1 = document.createElement("div");
        this.div_1.setAttribute("class", "col-md-4 col-sm-6 mt-3");

        this.div_2 = document.createElement("div");
        this.div_2.setAttribute("class", "card bg-light mb-3 border-primary");

        this.div_3 = document.createElement("div");
        this.div_3.setAttribute("class", "card-header text-center");
        this.div_3.append(`Company Name : ${job.company_name ?? ""}`);

        this.img = document.createElement("img");
        this.img.setAttribute("src", job.company_logo ?? "")
        this.img.style = "max-height: 150px; object-fit: contain; margin-top: 20px;"

        this.card_body = document.createElement("div");
        this.card_body.classList.add("card-body");

        this.h5 = document.createElement("h5");
        this.h5.setAttribute("class", "card-title text-center text-decoration-underline");
        this.h5.append(job.title ?? "");

        this.p2 = document.createElement("p");
        this.p2.classList.add("card-text");
        this.p2.innerHTML = `${job.description ?? ""}`;
        this.p2.style = "min-height: 280px; max-height: 280px; overflow: scroll;";

        this.p1 = document.createElement("p");
        this.p1.classList.add("card-text");
        this.p1.append(`Salary : ${job.salary ?? ""}`);

        this.a = document.createElement("a");
        this.a.setAttribute("class", "btn btn-success");
        this.a.setAttribute("href", job.url ?? "");
        this.a.setAttribute("target", "_blank");
        this.a.style.marginLeft = "12px"
        this.a.append("See this JOB");

        this.i = document.createElement("i");
        this.i.setAttribute("class", "bi bi-heart");

        this.saved_button = document.createElement("button");
        this.saved_button.setAttribute("class", "btn ml-2");
        this.saved_button.id = "button";
        this.saved_button.style.backgroundColor = "rgb(247, 111, 133)";
        this.saved_button.innerHTML = "Remove ❤️";
        this.saved_button.addEventListener("click", this.deleteCard.bind(this, job));

        this.card_footer = document.createElement("div");
        this.card_footer.setAttribute("class", "card-footer text-muted");
        this.card_footer.append(`Type : ${job.job_type ?? ""}`);

        this.card_body.append(this.h5, this.p1, this.p2, this.saved_button, this.a);
        this.div_2.append(this.div_3, this.img, this.card_body, this.card_footer);
        this.div_1.append(this.div_2);
    }

    deleteCard(job) {
        favorite_jobs_id = favorite_jobs_id.filter(item => item != job.id);
        localStorage.setItem("favorite_jobs_id", JSON.stringify(favorite_jobs_id));
        saved_jobs = saved_jobs.filter(item => item.id != job.id);
        localStorage.setItem("saved_jobs", JSON.stringify(saved_jobs));
        this.div_1.parentNode.removeChild(this.div_1);

        if (favorite_jobs_id == 0) {
            const highlite = document.createElement("h3");
            highlite.innerHTML = "There are no saved jobs yet. You're welcome to see our suggested jobs";
            highlite.style.margin = "50px";
            container.append(highlite);
        }
    }
}

/* Building the ALL-JOBS page */

All_Jobs.addEventListener("click", async (event) => {
    event.preventDefault();
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.flexWrap = "wrap";

    container.innerHTML = `
    <div class = "spinner-border" role = "status">
    <span class = "visually-hidden">Loading...</span>
    </div>`
    try {
        const response = await fetch(url_all_jobs);
        const data = await response.json();
        console.log(data.jobs);
        container.innerHTML = "";
        for (const cardData of data.jobs) {
            const card = new Card(cardData);
            container.appendChild(card.div_1);
        }
    }
    catch (error) {
        console.log(error);
        container.innerHTML = await error;
    }
})

/* Building the Saved-Jobs page */

Saved_Jobs.addEventListener("click", (event) => {
    event.preventDefault();
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.flexWrap = "wrap";

    try {
        for (const job of loadFromStorage("saved_jobs")) {
            const card = new Saved_Card(job);

            container.appendChild(card.div_1);

        }

        if (favorite_jobs_id == 0) {
            const highlite = document.createElement("h3");
            highlite.innerHTML = "There are no saved jobs yet. You're welcome to see our suggested jobs";
            highlite.style.margin = "50px";
            container.append(highlite);
        }
    }
    catch (error) {
        console.log(error);
    }
})

/* Enable the search method */

search_btn.addEventListener("click", async (event) => {
    event.preventDefault();
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.flexWrap = "wrap";

    container.innerHTML = `<div class="spinner-border" role="status">
     <span class="visually-hidden">Loading...</span>
     </div>
    `;

    const search_value = document.querySelector("#search_value");
    const value = search_value.value;

    const response = await fetch(`https://remotive.com/api/remote-jobs?search=${value}`);
    const data = await response.json();
    const user_search = data.jobs;

    if(value === "") {
        container.innerHTML = "";
        for (const cardData of user_search) {
            const card = new Card(cardData);
            container.appendChild(card.div_1);
        }
        search_value.value = "";
    }
    else if (user_search.length == 0) {
        container.innerHTML = "Not Found, try using in similar words";
    }
    else{
        container.innerHTML = "";
        for (const cardData of user_search) {
            const card = new Card(cardData);
            container.appendChild(card.div_1);
        }
        search_value.value = "";
    }
})
