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
    itemName: "#item-name",
    itemAmount: "#item-amount"
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
    addItemToList: function() {
      const item = document.querySelector(`${UISelectors.itemName}`);
      const amount = document.querySelector(`${UISelectors.itemAmount}`);
      // if input empty, add alert class
      if (!item.value || !amount.value) {
        item.classList.add("input-alert");
        amount.classList.add("input-alert");
        return;
      }
      //remove alert class
      item.classList.remove("input-alert");
      amount.classList.remove("input-alert");

      let html = `<li class="collection-item" id="item${0}">
      <strong>${item.value}: </strong> <em>¥${amount.value}</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
    </li>`;
      // insert list items
      document.querySelector(`${UISelectors.itemList}`).innerHTML += html;
      // clear inputs
      item.value = "";
      amount.value = "";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// APP CONTROLLER
const App = (function(ItemCtrl, UICtrl, xxx) {
  // load event listeners
  function loadEventListeners() {
    //get UI selectors
    const UISelectors = UICtrl.getSelectors();
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", UICtrl.addItemToList);
  }

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
