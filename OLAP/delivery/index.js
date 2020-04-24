const deliveryData = require("../rawdata/delivery.json");
const { writeToFile, groupBy } = require("../helpers");

class Detail {
    constructor(data) {
        this.data = data;
        this.validate();
    }

    validate() {
        let tempData = [];
        this.data.forEach(item => {
            let tempItem = item;
            // ShipDate NOT NULL
            // Отбрасывание записи
            if (!item.ShipDate) return;
            
            // Замена ошибочного значения наиболее 
            // часто встречающимся значением риска 
            // сотрудничества в рамках данного города 
            // данного филиала
            if (item.Quantity < 0)
                tempItem.Quantity = 1;

            // Замена ошибочного значения средним
            // значением цены деталей в рамках данного
            // города данного филиала
            if (item.Price < 0) tempItem.Price = 50.0;
                // SP.Qty * P.Weight <= 1500;
                // Отбрасывание записи

                tempData.push(tempItem);
        });
        writeToFile("data.json", tempData);
        return tempData;
    }

    averageWeight() {
        let sum = 0;
        this.data.forEach(item => (sum += item.Weight));
        return sum / this.data.length;
    }

    checkDuplicate(data, obj) {
        let result = data.find(
            item =>
                item.SPName === obj.SPName &&
                item.SPCity === obj.SPCity &&
                item.Color === obj.Color
        );
        return !!result;
    }

    getListByName(branchName) {
        let list = [];
        this.data.forEach(item => {
            if (item.SPName === branchName) {
                list.push(item);
            }
        });
        return list;
    }

    /**
     *
     * @param {*} name SPCity name
     * get list by SPCity name
     * get most common value of the supplier city with in this branch
     * return SPCity name
     */
    mostCommonSPCity(name) {
        let result = groupBy(this.getListByName(name), "SPCity");
        let commonValue = this.getCommonValue(result);
        return commonValue;
    }

    mostCommonRisk(name, city) {
        // get list by name
        let listByBranch = this.getListByName(name);
        let list = [];

        // get list by city
        listByBranch.forEach(item => {
            if (item.SPCity === city) {
                list.push(item);
            }
        });

        // group by Risk
        let result = groupBy(list, "Risk");
        let commonValue = this.getCommonValue(result);
        console.log(commonValue);
        return commonValue;
    }

    /**
     *
     * @param {obj} obj object SPCityName after group by branch
     * get most common value
     * return most common value
     */
    getCommonValue(obj) {
        let commonValue = null;
        // get common Object keys from group by result
        Object.keys(obj).forEach((item, index) => {
            if (!commonValue) {
                commonValue = item;
            }
            if (obj[item] > obj[commonValue]) {
                commonValue = item;
            }
        });
        return commonValue;
    }
}

// run validata();
let delivery = new Detail(deliveryData);
