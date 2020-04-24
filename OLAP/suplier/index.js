const suplierData = require("../rawdata/suplier.json");
const { writeToFile, groupBy } = require("../helpers");

class Suplier {
    constructor(data) {
        this.data = data;
        this.validate();
    }

    validate() {
        let tempData = [];
        this.data.forEach(item => {
            let tempItem = item;
            // SName NOT NULL
            // Отбрасывание записи
            if (!item.SName) return;

            // SCity NOT NULL
            // Замена пустого значения наиболее часто
            // встречающимся значением города
            // поставщика в рамках данного филиала
            if (!item.SCity) {
                tempItem.SCity = this.mostCommonCity(item.SName);
            }
            // UNIQUE (SName, Address, SCity)
            // Отбрасывание записей-дубликатов
            if (this.checkDuplicate(tempData, item)) return;

            // Risk in (1, 2, 3)
            // Замена ошибочного значения наиболее
            // часто встречающимся значением риска
            // сотрудничества в рамках данного города
            // данного филиала
            if (!item.Risk) {
                tempItem.Risk = this.mostCommonRisk(
                    tempItem.SName,
                    tempItem.SCity
                );
            }

            tempData.push(tempItem);
        });
        writeToFile("data.json", tempData);
        return tempData;
    }

    checkDuplicate(data, obj) {
        let result = data.find(
            item =>
                item.SName === obj.SName &&
                item.SCity === obj.SCity &&
                item.Address === obj.Address
        );
        return !!result;
    }

    getSuplierListByName(branchName) {
        let list = [];
        this.data.forEach(item => {
            if (item.SName === branchName) {
                list.push(item);
            }
        });
        return list;
    }

    /**
     *
     * @param {*} name SCity name
     * get list by SCity name
     * get most common value of the supplier city in this branch
     * return SCity name
     */
    mostCommonCity(name) {
        let result = groupBy(this.getSuplierListByName(name), "SCity");
        let commonValue = this.getCommonValue(result);
        console.log(commonValue);
        return commonValue;
    }

    mostCommonRisk(name, city) {
        // get list by name
        let listByBranch = this.getSuplierListByName(name);
        let list = [];

        // get list by city
        listByBranch.forEach(item => {
            if (item.SCity === city) {
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
     * @param {obj} obj object SCityName after group by branch
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
let suplier = new Suplier(suplierData);
