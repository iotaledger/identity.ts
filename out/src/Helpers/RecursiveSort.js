"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: No side effects
function RecursiveSort(data) {
    if (!Array.isArray(data) && typeof (data) == "object") {
        var ordered_1 = {};
        Object.keys(data).sort().forEach(function (key) {
            ordered_1[key] = RecursiveSort(data[key]);
        });
        data = ordered_1;
    }
    //Recursion Time
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            data[i] = RecursiveSort(data[i]);
        }
    }
    return data;
}
exports.RecursiveSort = RecursiveSort;
//# sourceMappingURL=RecursiveSort.js.map