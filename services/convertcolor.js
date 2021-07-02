/**THIS MODULE USED TO CONVERT COLORS BEFORE v0.1.5 TO CSS VARIABLES v0.1.5 AND AFTER*/

function convertColor(color) {
    var res = "";
    if (!color) return "var(--pc)";
    switch (color) {
      case "#FF5252":
        res = "var(--dc-red)";
        break;
      case "#ECA047":
        res = "var(--dc-orange)";
        break;
      case "#48F598":
        res = "var(--dc-green)";
        break;
      case "#FFB4E5":
        res = "var(--dc-pink)";
        break;
      case "var(--pc)":
        res = "var(--dc-blue)";
        break;
      default:
        res = color;
        break;
    }
    return res;
}
  
export default convertColor;
  