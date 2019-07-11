// storage controller
const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items = [];
      // check if item is in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // push item
        items.push(item);
        // set in local storage parsed as string
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get items parsed as JSON
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        // set in local storage parsed as string
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      }
      return JSON.parse(localStorage.getItem("items"));
    },
    updateItemInStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(deletedItemId) {
      let items = JSON.parse(localStorage.getItem("items"));
      items = items.filter(item => deletedItemId !== item.id);
      localStorage.setItem("items", JSON.stringify(items));
    }
  };
})();

////////////////////////////////////////////////////////////////
// ITEM CONTROLLER
////////////////////////////////////////////////////////////////
const ItemCtrl = (function() {
  // item constructor
  const Item = function(id, name, amount) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  };
  // data state
  const state = {
    items: StorageCtrl.getItemsFromStorage() || [],
    editingItem: null,
    totalAmount: 0
  };

  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, amount) {
      let id;
      // create id
      if (state.items.length > 0) {
        id = state.items[state.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      // parse amount to number type
      amount = parseInt(amount);
      // create new Item
      newItem = new Item(id, name, amount);
      // add item to data array
      state.items.push(newItem);
      return newItem;
    },
    getItemById: function(id) {
      // filter items array by id
      let item = state.items.filter(a => a.id === id);
      // return item object
      return item[0];
    },
    setEditingItem: function(itemToEdit) {
      state.editingItem = itemToEdit;
    },
    getEditingItem: function() {
      return state.editingItem;
    },
    updateStateItem: function(id, input) {
      state.items[id].name = input.name;
      state.items[id].amount = parseInt(input.amount);
    },
    deleteStateItem: function(id) {
      state.items = state.items.filter(item => item.id !== id);
    },
    getTotalAmount: function() {
      let total = state.items.reduce((a, b) => {
        return a + b.amount;
      }, 0);

      state.totalAmount = total;

      return state.totalAmount;
    },
    logState: function() {
      console.log(state);
      return state;
    }
  };
})();

////////////////////////////////////////////////////////////////
// UI CONTROLLER
////////////////////////////////////////////////////////////////
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemAmountInput: "#item-amount",
    totalAmount: ".total-amount"
  };

  return {
    // populate list from state in storage
    populateItemList: function(items) {
      if (items.length > 0) {
        // show item list
        UICtrl.showList();
      }
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>¥${item.amount}</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
      });
      // insert list items
      document.querySelector(`${UISelectors.itemList}`).innerHTML = html;
    },
    // add an item to list
    addListItem: function(item) {
      // show item list
      UICtrl.showList();
      // insert list items
      document.querySelector(
        `${UISelectors.itemList}`
      ).innerHTML += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>¥${item.amount}</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
    },
    // update item on the list
    updateListItem: function(id, input) {
      document.querySelector(`#item-${id}`).innerHTML = `
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a><strong>${input.name}: </strong> <em>¥${input.amount}</em>
              `;
    },
    // get the item input values
    getItemAndAmountInput: function() {
      return {
        name: document.querySelector(`${UISelectors.itemNameInput}`).value,
        amount: document.querySelector(`${UISelectors.itemAmountInput}`).value
      };
    },
    // get the UI selectors
    getSelectors: function() {
      return UISelectors;
    },
    // alert by coloring the input red
    showInputAlert: function() {
      document
        .querySelector(`${UISelectors.itemNameInput}`)
        .classList.add("input-alert");
      document
        .querySelector(`${UISelectors.itemAmountInput}`)
        .classList.add("input-alert");
    },
    // show the item list
    showList: function() {
      document.querySelector(`${UISelectors.itemList}`).style.display = "block";
    },
    // show total amount
    showTotalAmount: function(totalAmount) {
      document.querySelector(
        `${UISelectors.totalAmount}`
      ).textContent = totalAmount;
    },
    // clear input alert
    clearInputAlert: function() {
      document
        .querySelector(`${UISelectors.itemNameInput}`)
        .classList.remove("input-alert");
      document
        .querySelector(`${UISelectors.itemAmountInput}`)
        .classList.remove("input-alert");
    },
    // clear the inputs
    clearInputs: function() {
      document.querySelector(`${UISelectors.itemNameInput}`).value = "";
      document.querySelector(`${UISelectors.itemAmountInput}`).value = "";
    },
    // reset edit item buttons on UI
    setEditState: function() {
      UICtrl.clearInputs();
      // clear edit state
      document.querySelector(`${UISelectors.updateBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.deleteBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.backBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.addBtn}`).style.display = "block";
    },
    // show edit item buttons on UI
    showEditState: function() {
      document.querySelector(`${UISelectors.updateBtn}`).style.display =
        "inline";
      document.querySelector(`${UISelectors.deleteBtn}`).style.display =
        "inline";
      document.querySelector(`${UISelectors.backBtn}`).style.display = "inline";
      document.querySelector(`${UISelectors.addBtn}`).style.display = "none";
    },
    // delete item from list on UI
    deleteListItem: function(id) {
      document.querySelector(`#item-${id}`).remove();
    },
    // add item values to the edit form
    addItemToForm: function() {
      document.querySelector(
        `${UISelectors.itemNameInput}`
      ).value = ItemCtrl.getEditingItem().name;
      document.querySelector(
        `${UISelectors.itemAmountInput}`
      ).value = ItemCtrl.getEditingItem().amount;
      UICtrl.showEditState();
    }
  };
})();

////////////////////////////////////////////////////////////////
// APP CONTROLLER
////////////////////////////////////////////////////////////////
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  // load event listeners
  const loadEventListeners = function() {
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();
    // add button, click event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addItemToList);
    // edit item, click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editItem);
    // update item, click event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", editItemSubmit);
    // back button, click event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.setEditState);
    // delete button, click event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteItemSubmit);
    // disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };
  // add item to list
  const addItemToList = function(e) {
    // get inputs
    const input = UICtrl.getItemAndAmountInput();
    // if input empty show alert from UI controller
    if (!input.name || !input.amount) {
      UICtrl.showInputAlert();
      e.preventDefault();
      return;
    }
    // add item to state
    const newItem = ItemCtrl.addItem(input.name, input.amount);
    // get total amount
    const totalAmount = ItemCtrl.getTotalAmount();
    // show total amount in UI
    UICtrl.showTotalAmount(totalAmount);
    // clear the inputs
    UICtrl.clearInputAlert();
    UICtrl.clearInputs();
    // add item to UI
    UICtrl.addListItem(newItem);
    // add item to local storage
    StorageCtrl.storeItem(newItem);
    e.preventDefault();
  };
  // edit item
  const editItem = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // get list item id (.item-#)
      const listId = e.target.parentNode.parentNode.id;
      // arrayize
      const listIdArr = listId.split("-");
      // get id
      const id = parseInt(listIdArr[1]);
      // get item data by id
      const itemToEdit = ItemCtrl.getItemById(id);
      // set as editing item
      ItemCtrl.setEditingItem(itemToEdit);
      // add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };
  // submit edited item
  const editItemSubmit = function(e) {
    // get editing item data
    const item = ItemCtrl.getEditingItem();
    const itemId = ItemCtrl.getEditingItem().id;
    const input = UICtrl.getItemAndAmountInput();
    // update item in state
    ItemCtrl.updateStateItem(itemId, input);
    // update item in UI list
    UICtrl.updateListItem(itemId, input);
    // get total amount
    const totalAmount = ItemCtrl.getTotalAmount();
    // update total amount in UI
    UICtrl.showTotalAmount(totalAmount);
    // set edit state
    UICtrl.setEditState();
    // update item in local storage
    StorageCtrl.updateItemInStorage(item);
    // log state in console
    ItemCtrl.logState();
    e.preventDefault();
  };
  // delete item
  const deleteItemSubmit = function(e) {
    // get editing item data
    const itemId = ItemCtrl.getEditingItem().id;
    // delete item in state
    ItemCtrl.deleteStateItem(itemId);
    // delete item in UI list
    UICtrl.deleteListItem(itemId);
    // get total amount
    const totalAmount = ItemCtrl.getTotalAmount();
    // update total amount in UI
    UICtrl.showTotalAmount(totalAmount);
    // set edit state
    UICtrl.setEditState();
    // delete item in local storage
    StorageCtrl.deleteItemFromStorage(itemId);
    // log state in console
    ItemCtrl.logState();
    e.preventDefault();
  };

  return {
    // initialize app
    init: function() {
      // clear edit state
      UICtrl.setEditState();
      // fetch items from storage
      const items = ItemCtrl.getItems();
      // populate list with items
      UICtrl.populateItemList(items);
      // log state in console
      ItemCtrl.logState();
      // get total amount
      const totalAmount = ItemCtrl.getTotalAmount();
      // show total amount in UI
      UICtrl.showTotalAmount(totalAmount);
      // load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
