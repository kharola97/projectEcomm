
const isValid= function(value){
    if(!value || value==null) return false
    if(value==Number) return false
    if(value==String && value.trim()=="") return false
    
    return true
}



module.exports={isValid}