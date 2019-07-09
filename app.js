// storage controller
const xxx = (function() {})();

////////////////////////////////////////////////////////////////
// ITEM CONTROLLER
////////////////////////////////////////////////////////////////
const ItemCtrl = (function() {
  const Item = function(id, name, amount) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  };

  // state
  const state = {
    items: [
      { id: 0, name: "Food", amount: 30000 },
      { id: 1, name: "Insurance", amount: 25000 },
      { id: 2, name: "Rent", amount: 50000 }
    ],
    editingItem: null,
    totalAmount: 0
  };

  // public methods
  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, amount) {
      let ID;
      // create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // parse amount to number type
      amount = parseInt(amount);
      // create new Item
      newItem = new Item(ID, name, amount);
      // add item to data array
      state.items.push(newItem);
      return newItem;
    },
    getItemByID: function(ID) {
      let item = state.items.filter(a => a.id === ID);
      console.log(item[0]);
      return item[0];
    },
    setEditingItem: function(itemToEdit) {
      state.editingItem = itemToEdit;
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

  // public methods
  return {
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
    getItemAndAmountInput: function() {
      return {
        name: document.querySelector(`${UISelectors.itemNameInput}`).value,
        amount: document.querySelector(`${UISelectors.itemAmountInput}`).value
      };
    },
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
    setEditState: function() {
      UICtrl.clearInputs();

      // clear edit statw
      document.querySelector(`${UISelectors.updateBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.deleteBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.backBtn}`).style.display = "none";
      document.querySelector(`${UISelectors.addBtn}`).style.display = "block";
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
      .addEventListener("click", updateItem);
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

  // update item
  const updateItem = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // get list item id (.item-#)
      const listID = e.target.parentNode.parentNode.id;
      // arrayize
      const listIDArr = listID.split("-");
      // get ID
      const ID = parseInt(listIDArr[1]);
      // get item data by ID
      const itemToEdit = ItemCtrl.getItemByID(ID);
      // set as editing item
      ItemCtrl.setEditingItem(itemToEdit);
    }
    e.preventDefault();
  };

  // public methods
  return {
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
