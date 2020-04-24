const detailData = require("../rawdata/detail.json");
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
            // PName NOT NULL
            // Отбрасывание записи
            if (!item.PName) return;

            // PCity NOT NULL
            // Замена пустого значения наиболее часто
            // встречающимся значением города
            // поставщика в рамках данного филиала
            if (!item.PCity) {
                tempItem.PCity = this.mostCommonPCity(item.PName);
            }
            // UNIQUE (PName, Address, Color)
            // Отбрасывание записей-дубликатов
            if (this.checkDuplicate(tempData, item)) return;

            //Замена ошибочного значения средним 
            // значением веса деталей в рамках данного 
            // города данного филиала

            if (item.Weight < 0) {
                tempItem.Weight = this.averageWeight();
            }

            tempData.push(tempItem);
        });
        writeToFile("data.json", tempData);
        return tempData;
    }

    averageWeight(){
        let sum = 0;
        this.data.forEach(item=>sum+=item.Weight)
        return sum/this.data.length
    }

    checkDuplicate(data, obj) {
        let result = data.find(
            item =>
                item.PName === obj.PName &&
                item.PCity === obj.PCity &&
                item.Color === obj.Color
        );
        return !!result;
    }

    getListByName(branchName) {
        let list = [];
        this.data.forEach(item => {
            if (item.PName === branchName) {
                list.push(item);
            }
        });
        return list;
    }

    /**
     *
     * @param {*} name PCity name
     * get list by PCity name
     * get most common value of the supplier city with in this branch
     * return PCity name
     */
    mostCommonPCity(name) {
        let result = groupBy(this.getListByName(name), "PCity");
        let commonValue = this.getCommonValue(result);
        return commonValue;
    }

    mostCommonRisk(name, city) {
        // get list by name
        let listByBranch = this.getListByName(name);
        let list = [];

        // get list by city
        listByBranch.forEach(item => {
            if (item.PCity === city) {
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
     * @param {obj} obj object PCityName after group by branch
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
let detail = new Detail(detailData);
