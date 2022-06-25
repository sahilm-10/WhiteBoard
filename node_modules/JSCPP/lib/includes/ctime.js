"use strict";
module.exports = {
    load(rt) {
        const _time = function (rt, _this, i) {
            const val = Math.floor(Date.now() / 1000);
            return rt.val(rt.intTypeLiteral, val);
        };
        return rt.regFunc(_time, "global", "time", [rt.longTypeLiteral], rt.longTypeLiteral);
    }
};
//# sourceMappingURL=ctime.js.map