"use strict";
module.exports = {
    load(rt) {
        let m_w = 123456789;
        let m_z = 987654321;
        const mask = 0xffffffff;
        const seed = (i) => m_w = i;
        const random = function () {
            m_z = ((36969 * (m_z & 65535)) + (m_z >> 16)) & mask;
            m_w = ((18000 * (m_w & 65535)) + (m_w >> 16)) & mask;
            const result = ((m_z << 16) + m_w) & mask;
            return (result / 4294967296) + 0.5;
        };
        const pchar = rt.normalPointerType(rt.charTypeLiteral);
        const _atof = function (rt, _this, str) {
            if (rt.isStringType(str.t)) {
                const s = rt.getStringFromCharArray(str);
                const val = Number.parseFloat(s);
                return rt.val(rt.floatTypeLiteral, val);
            }
            else {
                return rt.raiseException("argument is not a string");
            }
        };
        rt.regFunc(_atof, "global", "atof", [pchar], rt.floatTypeLiteral);
        const _atoi = function (rt, _this, str) {
            if (rt.isStringType(str.t)) {
                const s = rt.getStringFromCharArray(str);
                const val = Number.parseInt(s, 10);
                return rt.val(rt.intTypeLiteral, val);
            }
            else {
                return rt.raiseException("argument is not a string");
            }
        };
        rt.regFunc(_atoi, "global", "atoi", [pchar], rt.intTypeLiteral);
        const _atol = function (rt, _this, str) {
            if (rt.isStringType(str.t)) {
                const s = rt.getStringFromCharArray(str);
                const val = Number.parseInt(s, 10);
                return rt.val(rt.longTypeLiteral, val);
            }
            else {
                return rt.raiseException("argument is not a string");
            }
        };
        rt.regFunc(_atol, "global", "atol", [pchar], rt.longTypeLiteral);
        if ((rt.scope[0].variables["RAND_MAX"] == null)) {
            rt.scope[0].variables["RAND_MAX"] = rt.val(rt.intTypeLiteral, 0x7fffffff);
        }
        const _rand = function (rt, _this) {
            const val = Math.floor(random() * (rt.scope[0].variables["RAND_MAX"].v + 1));
            return rt.val(rt.intTypeLiteral, val);
        };
        rt.regFunc(_rand, "global", "rand", [], rt.intTypeLiteral);
        const _srand = (rt, _this, i) => seed(i.v);
        rt.regFunc(_srand, "global", "srand", [rt.unsignedintTypeLiteral], rt.voidTypeLiteral);
        const _system = function (rt, _this, command) {
            if (command === rt.nullPointer) {
                return rt.val(rt.intTypeLiteral, 1);
            }
            else if (rt.isStringType(command)) {
                const s = rt.getStringFromCharArray(command);
                try {
                    const ret = eval(s);
                    if (ret != null) {
                        console.log(ret);
                    }
                    return rt.val(rt.intTypeLiteral, 1);
                }
                catch (e) {
                    return rt.val(rt.intTypeLiteral, 0);
                }
            }
            else {
                return rt.raiseException("command is not a string");
            }
        };
        rt.regFunc(_system, "global", "system", [pchar], rt.intTypeLiteral);
        rt.scope[0].variables["NULL"] = rt.nullPointer;
        function binary_search(val, L, cmp) {
            if (L.length === 0) {
                return false;
            }
            const mid = Math.floor(L.length / 2);
            const cmpResult = cmp(val, L[mid], mid);
            if (cmpResult === 0) {
                return mid;
            }
            else if (cmpResult > 0) {
                return binary_search(val, L.slice((mid + 1), +(L.length) + 1 || undefined), cmp);
            }
            else {
                return binary_search(val, L.slice(0, +(mid - 1) + 1 || undefined), cmp);
            }
        }
        ;
        const _bsearch = function (rt, _this, key, base, num, size, cmp) {
            if (rt.isArrayType(base)) {
                const L = base.v.target;
                const val = key;
                const wrapper = function (a, b, indexB) {
                    const pbType = base.t;
                    const pbVal = rt.makeArrayPointerValue(L, indexB);
                    const pointerB = rt.val(pbType, pbVal);
                    return cmp.v.target.v.target(rt, null, a, pointerB).v;
                };
                const bsRet = binary_search(val, L, wrapper);
                if (bsRet === false) {
                    return rt.nullPointer;
                }
                else {
                    return rt.val(base.t, rt.makeArrayPointerValue(L, bsRet));
                }
            }
            else {
                return rt.raiseException("base must be an array");
            }
        };
        const cmpType = rt.functionPointerType(rt.intTypeLiteral, [rt.voidPointerType, rt.voidPointerType]);
        rt.regFunc(_bsearch, "global", "bsearch", [rt.voidPointerType, rt.voidPointerType, rt.intTypeLiteral, rt.intTypeLiteral, cmpType], rt.voidPointerType);
        const _qsort = function (rt, _this, base, num, size, cmp) {
            if (rt.isArrayType(base)) {
                const L = base.v.target;
                for (let i = 0; i < L.length; i++) {
                    const ele = L[i];
                    ele.arrayIndex = i;
                }
                const wrapper = function (a, b) {
                    const pType = base.t;
                    const pbVal = rt.makeArrayPointerValue(L, b.arrayIndex);
                    const paVal = rt.makeArrayPointerValue(L, a.arrayIndex);
                    const pointerB = rt.val(pType, pbVal);
                    const pointerA = rt.val(pType, pbVal);
                    return cmp.v.target.v.target(rt, null, pointerA, pointerB).v;
                };
                L.sort(wrapper);
                return;
            }
            else {
                return rt.raiseException("base must be an array");
            }
        };
        rt.regFunc(_qsort, "global", "qsort", [rt.voidPointerType, rt.intTypeLiteral, rt.intTypeLiteral, cmpType], rt.voidTypeLiteral);
        const _abs = (rt, _this, n) => rt.val(rt.intTypeLiteral, Math.abs(n.v));
        rt.regFunc(_abs, "global", "abs", [rt.intTypeLiteral], rt.intTypeLiteral);
        const _div = function (rt, _this, numer, denom) {
            if (denom.v === 0) {
                rt.raiseException("divided by zero");
            }
            const quot = rt.val(rt.intTypeLiteral, Math.floor(numer.v / denom.v));
            const rem = rt.val(rt.intTypeLiteral, numer.v % denom.v);
            return {
                t: div_t_t,
                v: {
                    members: {
                        quot,
                        rem
                    }
                }
            };
        };
        const div_t_t = rt.newClass("div_t", [
            {
                type: rt.intTypeLiteral,
                name: "quot"
            }, {
                type: rt.intTypeLiteral,
                name: "rem"
            }
        ]);
        rt.regFunc(_div, "global", "div", [rt.intTypeLiteral, rt.intTypeLiteral], div_t_t);
        const _labs = (rt, _this, n) => rt.val(rt.longTypeLiteral, Math.abs(n.v));
        rt.regFunc(_labs, "global", "labs", [rt.longTypeLiteral], rt.longTypeLiteral);
        const _ldiv = function (rt, _this, numer, denom) {
            if (denom.v === 0) {
                rt.raiseException("divided by zero");
            }
            const quot = rt.val(rt.longTypeLiteral, Math.floor(numer.v / denom.v));
            const rem = rt.val(rt.longTypeLiteral, numer.v % denom.v);
            return {
                t: ldiv_t_t,
                v: {
                    members: {
                        quot,
                        rem
                    }
                }
            };
        };
        const ldiv_t_t = rt.newClass("ldiv_t", [
            {
                type: rt.longTypeLiteral,
                name: "quot"
            }, {
                type: rt.longTypeLiteral,
                name: "rem"
            }
        ]);
        return rt.regFunc(_ldiv, "global", "ldiv", [rt.longTypeLiteral, rt.longTypeLiteral], ldiv_t_t);
    }
};
//# sourceMappingURL=cstdlib.js.map