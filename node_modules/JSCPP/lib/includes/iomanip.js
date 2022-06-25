"use strict";
module.exports = {
    load(rt) {
        const type = rt.newClass("iomanipulator", []);
        const oType = rt.simpleType("ostream");
        const _setprecesion = (rt, _this, x) => ({
            t: type,
            v: {
                name: "setprecision",
                f(config) {
                    config.setprecision = x.v;
                }
            },
            left: false
        });
        rt.regFunc(_setprecesion, "global", "setprecision", [rt.intTypeLiteral], type);
        const _fixed = {
            t: type,
            v: {
                name: "fixed",
                f(config) {
                    config.fixed = true;
                }
            }
        };
        rt.scope[0].variables["fixed"] = _fixed;
        const _setw = (rt, _this, x) => ({
            t: type,
            v: {
                name: "setw",
                f(config) {
                    config.setw = x.v;
                }
            }
        });
        rt.regFunc(_setw, "global", "setw", [rt.intTypeLiteral], type);
        const _setfill = (rt, _this, x) => ({
            t: type,
            v: {
                name: "setfill",
                f(config) {
                    config.setfill = String.fromCharCode(x.v);
                }
            }
        });
        rt.regFunc(_setfill, "global", "setfill", [rt.charTypeLiteral], type);
        const _addManipulator = function (rt, _cout, m) {
            if (!_cout.manipulators) {
                _cout.manipulators = {
                    config: {},
                    active: {},
                    use(o) {
                        let tarStr;
                        if (rt.isNumericType(o) && rt.isFloatType(o)) {
                            if (this.active.fixed) {
                                const prec = (this.active.setprecision != null) ?
                                    this.config.setprecision
                                    :
                                        6;
                                tarStr = o.v.toFixed(prec);
                            }
                            else if (this.active.setprecision != null) {
                                tarStr = o.v.toPrecision(this.config.setprecision).replace(/0+$/, "");
                            }
                        }
                        if (this.active.setw != null) {
                            let fill;
                            if (this.active.setfill != null) {
                                fill = this.config.setfill;
                            }
                            else {
                                fill = " ";
                            }
                            if (!(rt.isTypeEqualTo(o.t, rt.charTypeLiteral) && ((o.v === 10) || (o.v === 13)))) {
                                if (!tarStr) {
                                    tarStr = rt.isPrimitiveType(o) ?
                                        o.t.name.indexOf("char") >= 0 ?
                                            String.fromCharCode(o.v)
                                            : o.t.name === "bool" ?
                                                o.v ? "1" : "0"
                                                :
                                                    o.v.toString()
                                        : rt.isStringType(o) ?
                                            rt.getStringFromCharArray(o)
                                            :
                                                rt.raiseException("<< operator in ostream cannot accept " + rt.makeTypeString(o.t));
                                }
                                for (let i = 0, end = this.config.setw - tarStr.length; i < end; i++) {
                                    tarStr = fill + tarStr;
                                }
                                delete this.active.setw;
                            }
                        }
                        if (tarStr != null) {
                            return rt.makeCharArrayFromString(tarStr);
                        }
                        else {
                            return o;
                        }
                    }
                };
            }
            m.v.f(_cout.manipulators.config);
            _cout.manipulators.active[m.v.name] = m.v.f;
            return _cout;
        };
        rt.regOperator(_addManipulator, oType, "<<", [type], oType);
    }
};
//# sourceMappingURL=iomanip.js.map