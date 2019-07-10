// storage controller
const xxx = (function() {})();

////////////////////////////////////////////////////////////////
// ITEM CONTROLLER
////////////////////////////////////////////////////////////////
const ItemCtrl = (function() {
  // constructor
  const Item = function(id, name, amount) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  };
  // state
  const state = {
    items: [
      { id: 0, name: "Food", amount: 25000 },
      { id: 1, name: "Insurance", amount: 25000 },
      { id: 2, name: "Rent", amount: 45000 },
      { id: 3, name: "Other", amount: 5000 }
    ],
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
      // console.log(state.items[id].name);
      // console.log(state.items[id].amount);
      state.items[id].name = input.name;
      state.items[id].amount = parseInt(input.amount);
      // console.log(state.items);
    },
    getTotalAmount: function() {
      let total = state.items.reduce((a, b) => {
        return a + b.amount;
      }, 0);

      state.totalAmount = total;

      return state.totalAmount;
    },
    logState: function() {
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
      console.log(id, input, "new values");
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
const App = (function(ItemCtrl, UICtrl, xxx) {
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
    const id = ItemCtrl.getEditingItem().id;
    const input = UICtrl.getItemAndAmountInput();
    // update item in state
    ItemCtrl.updateStateItem(id, input);
    // update item in UI list
    UICtrl.updateListItem(id, input);
    // get total amount
    const totalAmount = ItemCtrl.getTotalAmount();
    // update total amount in UI
    UICtrl.showTotalAmount(totalAmount);
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
      // get total amount
      const totalAmount = ItemCtrl.getTotalAmount();
      // show total amount in UI
      UICtrl.showTotalAmount(totalAmount);
      // load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, xxx);

App.init();
