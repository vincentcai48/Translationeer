export default function dateString(num:number):string{
    var res:string = "";
    var d:Date = new Date(num);
    res += (d.getMonth()+1) + "/"+d.getDate()+"/"+d.getFullYear();
    return res;
}