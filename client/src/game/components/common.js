/* ----- Function to Generate Unique Keys ----- */

export const generateKey = function(prefix, i, j = "") {
    let suffix = prefix + "-" + i.toString();
    if (j !== "") {
        suffix += "-" + j.toString();
    }
    return suffix;
}