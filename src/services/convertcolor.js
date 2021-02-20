/**THIS MODULE USED TO CONVERT COLORS BEFORE v0.1.5 TO CSS VARIABLES v0.1.5 AND AFTER*/

function convertColor(color){
    var res = "";
    switch(color){
        case "#FF5252":
            res = "var(--dc-red)"
            break;
        case "#ECA047":
            res = "var(--dc-orange)"
            break;
        case "#48F598":
            res = "var(--dc-green)"
            break;
        case "#FFB4E5":
            res = "var(--dc-pink)"
            break;
        default:
            res = "var(--pc)"
            break;
    }
}

84378B">Purple</option>
                <option value="#FF5252">Red</option>
                <option value="#ECA047">Orange</option>
                <option value="#48F598">Green</option>
                <option value="#FFB4E5">Pink</option>