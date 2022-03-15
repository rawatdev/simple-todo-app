const formField = document.getElementById("form-field");
const createField = document.getElementById("create-field");
const itemList = document.getElementById("item-list");

function itemTemplate(item) {
  return `
    <li class="list-group-item d-flex align-items-center justify-content-between">
    <span>${item.text}</span>
      <div>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm">
          Edit
        </button>
        <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">
          Delete
        </button>
      </div>
    </li>
  `;
}

const ourHTML = items
  .map((item) => {
    return itemTemplate(item);
  })
  .join("");

// Initial Page Load
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// Create Feature

formField.addEventListener("submit", (e) => {
  e.preventDefault();
  // Create Request
  axios
    .post("/create-item", { text: createField.value })
    .then((response) => {
      itemList.insertAdjacentHTML(
        "beforeend",
        itemTemplate({ text: response.data.text, _id: response.data._id })
      );
      createField.value = "";
      createField.focus();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update/Delete Feature
document.addEventListener("click", (e) => {
  // Update Feature
  if (e.target.classList.contains("edit-me")) {
    const textEl = e.target.parentElement.parentElement.querySelector("span");
    const userInput = prompt("Enter the text", textEl.innerText);

    // Update Request
    axios
      .post("/update-item", {
        id: e.target.getAttribute("data-id"),
        text: userInput,
      })
      .then((response) => {
        textEl.innerText = response.data.text;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    // Delete Request
    axios
      .post("/delete-item", { id: e.target.getAttribute("data-id") })
      .then((response) => {
        e.target.parentElement.parentElement.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
