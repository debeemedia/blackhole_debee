const Validator = require('validatorjs')


function validateData(body, rules, messages){
    const result = new Validator(body, rules, messages)
    if(result.fails()){
        const error_object = result.errors.all()
        const first_key = Object.keys(result.errors.all())[0]

        const error_message = error_object[first_key][0]
        return {success: false, data: {[first_key]: error_message}}
    }
    return {success: true, data: null}
}


module.exports = validateData