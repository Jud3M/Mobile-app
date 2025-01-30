import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://mobile-app-7be13-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputEl = document.getElementById("input-field")
const addBtnEl = document.getElementById("add-btn")
const shoppingListEl = document.getElementById("shopping-list")

addBtnEl.addEventListener("click", function() {
    let inputValue = inputEl.value

    shoppingListEl.innerHTML += `<li>${inputValue}</li>`

    inputEl.value = ""

    push(shoppingListInDB, inputValue)
})

onValue(shoppingListInDB, function(snapshot){
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "no items here...yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputEl() {
    inputEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}