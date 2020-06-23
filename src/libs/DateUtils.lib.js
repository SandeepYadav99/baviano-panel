/**
 * Created by charnjeetelectrovese@gmail.com on 4/27/2020.
 */
import moment from 'moment';
import Constants from '../config/constants';

class DateUtils {
    changeTimezoneFromUtc = function(date, timeZone =  Constants.TIME_ZONE, format = Constants.DEFAULT_TIME_FORMAT) {
        const temp = new Date(date);
        const newDate = new Date(temp.getTime() + (3600000 * timeZone));
        if (format) {
            let tempMoment = moment(newDate);
            tempMoment.utcOffset(0);
            return tempMoment.format(format)
        } return newDate;
    };
    changeTimeStamp = function(date, format = Constants.DEFAULT_TIME_FORMAT) {
        if (date) {
            return moment(new Date(date)).format(format);
        } return '';
    }
}

export default new DateUtils();
