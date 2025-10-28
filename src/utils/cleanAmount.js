export const cleanAmount = (value) => {

    if(!value) return "";
    
    return value.replace(/[^\d.]/g, "");

}