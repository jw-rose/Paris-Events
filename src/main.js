// Select the main app element (not used later, but retrieved here)
const app = document.getElementById("app");

// Select the <template> for activity cards
const activityCardTemplate = document.querySelector("[data-activity-template]");

// Select the container where all activity cards will be appended
const activityCardContainer = document.querySelector("[data-activity-cards-container]");

// Select the input field used for searching
const searchInput = document.querySelector("[data-search]");

const noResultsMessage = document.getElementById("noResultsMessage");


// This array will store activity data + the DOM element for each card
let activities = [];


searchInput.addEventListener("input", (e) => {
  const value = e.target.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let anyVisible = false; // track visibility

  activities.forEach(activity => {
    const eventType = activity.eventType
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const addressStreet = activity.address_street
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const isVisible =
      (eventType?.includes(value) || addressStreet?.includes(value));

    activity.element.classList.toggle("hide", !isVisible);

    if (isVisible) anyVisible = true;
  });

  // Show/hide "cannot be found" message
  noResultsMessage.classList.toggle("hide", anyVisible);
});

// -------------------------------------------
// 📡 FETCH DATA FROM PARIS OPEN DATA API
// -------------------------------------------
fetch("https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20")
.then(res => res.json())   // Convert response to JSON
.then(data => {

  // Create a card for each result and store important searchable fields
  activities = data.results.map(result => {

    // Clone the template content to build an actual card element
    const card = activityCardTemplate.content.cloneNode(true).children[0];

    // Select specific elements inside the card
    const title = card.querySelector("[data-title]");
    const eventType = card.querySelector("[data-event-type]");
    const address = card.querySelector("[data-address]");
    const image = card.querySelector("[data-image]");
    const leadText = card.querySelector("[data-lead-text]");
    const description = card.querySelector("[data-description]");

  
    // Create a button to toggle description visibility
    let btn = document.createElement("button");
    btn.textContent = "Voir plus";
    btn.classList.add("btn-details");

    // Insert the button just before the description section
    card.insertBefore(btn, description);

    // Add event listener to show/hide the description
    btn.addEventListener("click", () => {
      if (description.style.display === "none" || description.style.display === "") {
        description.style.display = "block";     // Show description
        btn.textContent = "Voir moins...";       // Update button label
      } else {
        description.style.display = "none";      // Hide description
        btn.textContent = "Voir plus...";        // Update button label
      }
    });

    // -------------------------------------------
    // ❤️ FAVOURITE BUTTON
    // -------------------------------------------

    // Create the favourite button
    let favBtn = document.createElement("button");
    favBtn.classList.add("favourite");
    favBtn.innerHTML = '<span class="heart">&#9825;</span>';

    // Insert it after the lead text, before description
    card.insertBefore(favBtn, title);

    // Add click event to toggle favourite
    const heart = favBtn.querySelector(".heart");
    favBtn.addEventListener("click", () => {
      favBtn.classList.toggle("active");
      if (favBtn.classList.contains("active")) {
        heart.innerHTML = "&#9829;"; // filled heart
      } else {
        heart.innerHTML = "&#9825;"; // outline heart
      }
    });

    // -------------------------------------------
    // 📝 FILL CARD WITH API DATA
    // -------------------------------------------
    
    title.innerHTML = result.title;                         // Set activity title
    eventType.innerHTML = result.qfap_tags ?? " ";           // Display event type tags (if available)

    // Some tags contain semicolons, so they are replaced by spaces
    if (result.qfap_tags) {
      eventType.innerHTML = result.qfap_tags.replaceAll(";", " ");
    }

    address.innerHTML = result.address_street;              // Fill address
    image.src = result.cover_url;                            // Set cover image
    leadText.innerHTML = result.lead_text;                  // Short description
    leadText.style.color = "#d4af37";                       // Text color

    description.innerHTML = result.description;             // Full description
    description.style.display = "none";                     // Hidden by default
    description.style.color = "#d4af37";                    // Text color

    // Add the fully prepared card to the page
    activityCardContainer.append(card);

    // Return an object containing searchable values + the card element
    return { 
      eventType: result.qfap_tags,
      address_street: result.address_street,
      element: card
    };
  });
});
