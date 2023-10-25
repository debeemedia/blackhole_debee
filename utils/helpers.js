const empty = (data = null) => {
    return isEmpty(data);
}


const isEmpty = (data = null) => {
    let rtn = false;
    if (isString(data) && (data === "" || data.trim() === "")) rtn = true;
    else if (isNumber(data) && data === 0) rtn = true;
    else if (isBoolean(data) && data === false) rtn = true;
    else if (isObject(data) && Object.values(data).length === 0) rtn = true;
    else if (isArray(data) && data.length === 0) rtn = true;
    else if (isUndefined(data)) rtn = true;
    else if (isNull(data)) rtn = true;

    return rtn;
}

const isString = (data)=> typeof data === 'string'
const isBoolean = (data)=> typeof data === 'boolean'
const isNumber = (data)=> typeof data === 'number'
const isNull = (data)=>  data === null ? true : false
const isUndefined = (data)=> typeof data === 'undefined'
const isObject = (data)=> (typeof data === "object" && Object.prototype.toString.call(data) === "[object Object]") ? true : false;
const isArray = (data)=>  (typeof data === "object" && Object.prototype.toString.call(data) === "[object Array]") || Array.isArray(data) ? true : false;


module.exports = {
    empty
}