
const isValid= function(value){
    if(!value || value==null) return false
    if(value==Number) return false
    if(value==String && value.trim()=="") return false
    
    return true
}
const isValidAvailableSizes = (availablesizes) => {
    for( i=0 ;i<availablesizes.length; i++){
      if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availablesizes[i])) return false
    }
    return true
  }

module.exports={isValid}