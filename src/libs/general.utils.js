/**
 * Created by charnjeetelectrovese@gmail.com on 9/28/2017.
 */
import Constants from '../config/constants';
export function roundUnit(unit) {
    if(unit >= 1000) {
        return `${unit / 1000} Kg`;
    } else {
        return `${unit} Gm`;
    }
}

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const updateTitle = (title) => {
    document.title = Constants.APP_NAME + ' - ' + title;
}
