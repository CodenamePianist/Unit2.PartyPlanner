const COHORT = "2408-Brandon";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

// === State ===

const state = {
    events: [],
};

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const responseObj = await response.json();

        if (!response.ok) {
            throw new Error(parsed.error.message);
        }
        state.events = responseObj.data;
    } catch (error) {
        console.error(error);
    }
}

async function addEvent(event) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event)
        });
        const json = await response.json();

        if (json.error) {
            throw new Error(json.error.message);
        }
    } catch (error) {
        console.error(error)
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch(API_URL + id, {
            method: "DELETE",
        });

        if (!response.ok) {
            const parsed = await response.json();
            throw new Error(parsed.error.message);
        };
    } catch (error) {
        console.error(error);
    }
}



function convertISOStringToDate() {
    for (let i = 0; i < state.events.length; i++) {
        const date = state.events[i].date;
        const dateArray = date.split("T");
        return dateArray[0];
    }
}

function convertISOStringToTime() {
    for (let i = 0; i < state.events.length; i++) {
        const date = state.events[i].date;
        const dateArray = date.split("T");
        const time = dateArray[1].slice(0, -8);
        return time;
    }

}

const eventDate = convertISOStringToDate();
const eventTime = convertISOStringToTime();

// === Render ===

function renderEvents() {
    const $events = document.querySelector("#events");

    const eventCards = state.events.map((event) => {
        const card = document.createElement("li");
        card.innerHTML = `
            <h2>${event.name}</h2>
            <p>${event.date}</p>
            <p>${event.location}</p>
            <p>${event.description}</p>
            <button>Delete</button>
        `;

        const $deleteButton = card.querySelector("button");
        $deleteButton.addEventListener("click", async () => {
            await deleteEvent(event.id);
            await getEvents();
            renderEvents();
        });

        return card;
    })
    $events.replaceChildren(...eventCards);
}

async function render() {
    await getEvents();
    renderEvents();
}

// === Script ===

render();

const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isoDate = new Date($form.eventDate.value).toISOString();

    const party = {
        name: $form.eventName.value,
        date: isoDate,
        location: $form.eventLocation.value,
        description: $form.description.value
    }

    await addEvent(party);

    await getEvents();
    render();
})

