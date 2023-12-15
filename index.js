const COHORT = "2311-fsa-et-web-ft-sf";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

let events = [];

const eventList = document.querySelector('#events');

const addParty = document.querySelector('#addform');
addParty.addEventListener('submit', createEvent);

//Async 
async function render(){
    await fetchEvents();
    renderEvents();
}

//fetch events Async
async function fetchEvents() {
    try{
        const response = await fetch (API_URL);
        const json = await response.json ();
        events = json.data;
        return events;
    } catch (error) {
        console.log(error);
    }
}

// create event
async function createEvent(ev) {
    ev.preventDefault();

    try {
        let dateTime = `${addParty.date.value}T${addParty.time.value}:00.000Z`
        const response = await fetch(API_URL, {
            method: "POST",
            
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                name: addParty.name.value,
                date: dateTime,
                location: addParty.location.value,
                description: addParty.description.value,
            }),
        });
        const createdEvent = await response.json();
        
        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        render();

    } catch (error) {
        console.log(error);
    }

}

//Render event  
function renderEvents() {
    if (!events.length) {
        eventList.textContent = "No upcoming parties";
        return;
    }

    const eventInfo = events.map((event) => {
        const element = document.createElement("li");
        element.innerHTML = `
            <h3>Event Name: ${event.name}</h3>
            <p>Date: ${date(event.date)}</p>
            <p>Time: ${time(event.date)}</p>
            <p>Event Location: ${event.location}</p>
            <p>Description:</br>${event.description}</p></br>`

//Delete button 
const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Event"
        element.append(deleteButton);

        // Calls function
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        return element;
    });
    eventList.replaceChildren(...eventInfo);
    console.log(events)
}

// Delete party from API
async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        render();
    } catch (error) {
        console.log(error)
    }
}
