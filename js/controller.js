let controller = (function (budgetCtrl, uiCtrl) {
    let setupEventListeners = function () {

        let DOM = uiCtrl.getDomStrings();
        document.querySelector(DOM.form).addEventListener("submit", ctrlAddItem);
        
        // Клик по таблице с доходами и расходами
        document.querySelector(DOM.budgetTable).addEventListener("click", ctrlDeleteItem);
    };

    // Обновление % у каждой записи
    function updatePercentages() {

        // 1. Расчет % для каждой записи типа Expense
        budgetCtrl.calculatePercentages();
        budgetCtrl.test();

        // 2. Получение данных по % с модели
        let idsAndPercents = budgetCtrl.getAllIdsAndPercentages();

        // 3. Обновление UI с новыми %
        uiCtrl.updateItemsPercentages(idsAndPercents);
    }
    
    // Функция, срабатывающая при отправке формы
    function ctrlAddItem(event) {
        event.preventDefault();

        // 1. Получение данных из формы
        let input = uiCtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Добавление данных в модель
            let newItem = budgetCtrl.addItem(
                input.type,
                input.description,
                input.value
            );
            budgetCtrl.test();
            
            // 3. Добавление "запись" в UI
            uiCtrl.renderListItem(newItem, input.type);
            uiCtrl.clearFields();
            // generateTestData.init();
            
            // 4. Расчет бюджета
            updateBudget();

            // 5. Пересчет %
            updatePercentages();
        }
    }

    function ctrlDeleteItem(event) {
        let itemID, splitID, type, ID;

        if (event.target.closest(".item__remove")) {
            // Нахождение ID записи, которую надо удалить
            itemID = event.target.closest("li.budget-list__item").id;
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Удаление записи из модели и шаблона
            budgetCtrl.deleteItem(type, ID);
            uiCtrl.deleteListItem(itemID);

            // Расчет бюджета и пересчет %
            updateBudget();
            updatePercentages();
        }
    }

    function updateBudget() {
        // 1. Расчет бюджета в модели
        budgetCtrl.calculateBudget();

        // 2. Получение расчитанного бюджета из модели
        budgetObj = budgetCtrl.getBudget();

        // 3. Отображение бюджета в Шаблоне
        uiCtrl.updateBudget(budgetObj);
    }

    return {
        init: function () {
            console.log("App started!");
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
        },
    };
    
})(modelController, viewController);

controller.init();
