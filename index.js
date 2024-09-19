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
        state.events = responseObj.data;
    } catch (error) {
        console.error(error);
    }
}

// === Render ===


async function render() {
    await getEvents();
}

// === Script ===

render();