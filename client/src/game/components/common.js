/* ----- Gameplay Status ----- */

export const Status = Object.freeze({
    "InProgress" : 1,
    "Finished" : {
        "Won" : 2,
        "Lost" : 3,
    },
    "Surrender" : 4
});

/* ----- Function to Generate Unique Keys ----- */

export const generateKey = function(prefix, i, j = "") {
    let suffix = prefix + "-" + i.toString();
    if (j !== "") {
        suffix += "-" + j.toString();
    }
    return suffix;
}
