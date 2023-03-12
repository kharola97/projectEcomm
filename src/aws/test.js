let arr = [2,3,4]

let f = arr.map(num=>{
    let result = 1
    for(i=num;i>0;i--){
        result*=i
    }
    return result
})
console.log(f)