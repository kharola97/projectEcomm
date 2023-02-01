
const isValid= function(value){
    if(value==Number) return false
    if(value==String && value.trim()=="") return false
    if(!value || value==null) return false
    return true
}


module.exports={isValid}