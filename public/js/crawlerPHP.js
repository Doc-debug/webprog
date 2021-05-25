import { flattenTree } from "./util/object.js";
const ApiUrl = "./api/index.php";

const MusicBaseUrl = "./music";
let tree = {};
/**
 * fetches the data from the phpcrawler api
 * @returns the filetree structure
 */
export async function crawler() {
    try {
        tree = await fetch(ApiUrl).then((data) => data.json());
    } catch (error) {
        alert(
            "The crawler did not respond properly. \nThis usually happens when PHP was not correctly configured. Please be sure that you are running this project on a PHP8 Server"
        );
        tree = {};
    }
    return tree;
}

/**
 * filters song list by given search string and tag
 * @param {string} title the search query
 * @param {string} tag the tag that is searched (artist, title, url...) "all" represents the whole object
 * @param {Array} [customList=tree] customList the list that is searched
 * @returns a list with matching songs
 */
export function find(title, tag = null, customList = tree) {
    let list = flattenTree(customList);
    // if tag is undefined search whole object
    if (tag == null || tag == "all") {
        return list.filter((ele) =>
            JSON.stringify(ele).toLowerCase().includes(title.toLowerCase())
        );
    } else {
        // if tag is specified search only tag
        return list.filter(
            (ele) =>
                tag in ele &&
                ele[tag] != null &&
                ele[tag].toLowerCase().includes(title.toLowerCase())
        );
    }
}
