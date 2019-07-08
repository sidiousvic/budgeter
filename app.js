// storage controller
const xxx = (function() {})();

// ITEM CONTROLLER
const ItemCtrl = (function() {
  const Item = function(id, name, amount) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  };

  // state
  const state = {
    items: [
      { id: 0, name: "Food", amount: "30000" },
      { id: 1, name: "Insurance", amount: "25000" },
      { id: 2, name: "Rent", amount: "50000" }
    ],
    currentItem: null,
    totalAmount: 0
  };

  // public methods
  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, calories) {
      console.log(name, calories);
    },
    logState: function() {
      return state;
    }
  };
})();

// UI CONTROLLER
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemAmountInput: "#item-amount"
  };

  // public methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item${item.id}">
              <strong>${item.name}: </strong> <em>¥${item.amount}</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
      });

      // insert list items
      document.querySelector(`${UISelectors.itemList}`).innerHTML = html;
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
    showInputAlert: function() {
      document
        .querySelector(`${UISelectors.itemNameInput}`)
        .classList.add("input-alert");
      document
        .querySelector(`${UISelectors.itemAmountInput}`)
        .classList.add("input-alert");
    }
  };
})();

// APP CONTROLLER
const App = (function(ItemCtrl, UICtrl, xxx) {
  // load event listeners
  function loadEventListeners() {
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();
    // define event listeners
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addItemToList);
  }

  // add item to list
  const addItemToList = function(e) {
    // get inputs
    const input = UICtrl.getItemAndAmountInput();
    // if input empty, add alert class
    if (!input.name || !input.amount) {
      UICtrl.showInputAlert();
      return;
    } else {
      const newItem = ItemCtrl.addItem(input.name, input.amount);
    }

    e.preventDefault();
  };

  // public methods
  return {
    init: function() {
      // fetch items from storage
      const items = ItemCtrl.getItems();
      // pupulate list with items
      UICtrl.populateItemList(items);
      // load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, xxx);

App.init();

// addItemToList: function() {
//     const item = document.querySelector(`${UISelectors.itemName}`);
//     const amount = document.querySelector(`${UISelectors.itemAmount}`);
//     // if input empty, add alert class
//     if (!item.value || !amount.value) {
//       item.classList.add("input-alert");
//       amount.classList.add("input-alert");
//       return;
//     }
//     //remove alert class
//     item.classList.remove("input-alert");
//     amount.classList.remove("input-alert");

//     let html = `<li class="collection-item" id="item${0}">
//     <strong>${item.value}: </strong> <em>¥${amount.value}</em>
//     <a href="#" class="secondary-content">
//       <i class="edit-item fa fa-pencil"></i>
//     </a>
//   </li>`;
//     // insert list items
//     document.querySelector(`${UISelectors.itemList}`).innerHTML += html;
//     // clear inputs
//     item.value = "";
//     amount.value = "";
//   },
