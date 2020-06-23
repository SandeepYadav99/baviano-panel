/**
 * Created by charnjeetelectrovese@gmail.com on 9/19/2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import { RadioButton, RadioButtonGroup } from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import SelectField from '@material-ui/core/Select';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import {Chip, withStyles, FormHelperText, MenuItem} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useTheme} from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TimePicker from '../components/ReduxDatePicker/ReduxTimePicker.component';
import File from "../components/FileComponent/FileComponent.component";
import ReduxCountryContact from '../components/country/ReduxCountryContact.component';
import DatePicker from '../components/ReduxDatePicker/ReduxDatePicker.component';

export const renderTextField = ({input, label, meta: {touched, error}, ...custom}) => (
    <TextField
        error={(touched && error) ? true : false}
        {...input}
        {...custom}
        label={label}
        helperText={touched && error}
    />
    // <TextField
    //     {...input}
    //     {...custom}
    //     hintText={label}
    //     floatingLabelText={label}
    //     errorText={touched && error}
    // />
);

export const renderOutlinedTextField = ({input, label, meta: {touched, error}, ...custom}) => {
    return (
        <TextField
            error={(touched && error) ? true : false}
            helperText={((touched && error) ? true : false) ? (custom.errorText ? custom.errorText : error) : ''}
            {...input}
            {...custom}
            label={label}
            // helperText={touched && error}
            variant={'outlined'}
        />
    );
}

export const renderOutlinedTextFieldWithLimit = ({input, label, maxLimit, meta: {touched, error}, ...custom}) => {
    const valueLen = input.value.length;
    const tempLabel = valueLen ? `${label} (${valueLen}/${maxLimit})` : `${label} (Max ${maxLimit} Characters)`;
    return (
        <TextField
            error={(touched && error) ? true : false}
            helperText={((touched && error) ? true : false) ? custom.errorText : ''}
            {...input}
            {...custom}
            label={tempLabel}
            // helperText={touched && error}
            variant={'outlined'}
        />
    );
}


export const renderFileField = (props) => {

    const {input, label, type, max_size, multiple, meta: {touched, error}, ...custom} = props;
    return (
        <File
            error={(touched && error) ? true : false}
            multiple={multiple ? multiple : false}
            {...input}
            {...custom}
            // file={this.state.files['company_logo']}
            max_size={max_size ? max_size : 20000}
            name={label}
            type={type ? type : []}
            // handleChange={this._handleFileChange}
            placeholder={label}
        />
    );
}

export const renderTimePicker = (props) => {
    const {input, label, ampm, type, minDate, max_size, multiple, meta: {touched, error}, ...custom} = props;
    return (
        <TimePicker
            error={(touched && error) ? true : false}
            {...input}
            {...custom}
            // file={this.state.files['company_logo']}
            name={label}
            ampm={ampm}
            minDate={minDate}
            // handleChange={this._handleFileChange}
            label={label}
        />
    );
}

export const renderCheckbox = ({input, label, ...rest }) =>
    (<FormControlLabel
            control={<Checkbox
                {...input}
                {...rest}
                checked={input.value ? true : false}
                onChange={input.onChange}
            />}
            label={label}
        />);
// export const renderRadioGroup = ({ input, ...rest }) =>
//     (<RadioButtonGroup
//         {...input}
//         {...rest}
//         valueSelected={input.value}
//         onChange={(event, value) => input.onChange(value)}
//     />);

export const renderSelectField = ({input, label, meta: {touched, error}, children, ...custom}) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom}
    />
);

export const renderNewSelectField = ({input, label, meta: {touched, error}, children, ...custom}) => (
    <FormControl fullWidth error={touched && error}>
        <InputLabel htmlFor={custom.inputId}>{label}</InputLabel>
        <SelectField
            {...input}
            {...custom}
            inputProps={{
                id: custom.inputId,
            }}
        >
            {children}
        </SelectField>
    </FormControl>
)


export const renderDatePicker = (props) => {
    const {input, label, ampm, type, max_size, multiple, meta: {touched, error}, ...custom} = props;
    return (
        <DatePicker
            error={(touched && error) ? true : false}
            {...input}
            {...custom}
            // file={this.state.files['company_logo']}
            name={label}
            // handleChange={this._handleFileChange}
            label={label}
        />
    );
}


export class renderOutlinedSelectField extends React.Component {
    state = {
        labelWidth: 0,
    };

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }

    render() {
        const {input, label, margin, meta: {touched, error}, children, ...custom} = this.props;
        return (
            <FormControl fullWidth variant="outlined" margin={margin} error={touched && error}>
                <InputLabel
                    ref={ref => {
                        this.InputLabelRef = ref;
                    }}
                    htmlFor={custom.inputId}
                >
                    {label}
                </InputLabel>
                <SelectField
                    {...input}
                    {...custom}

                >
                    {children}
                </SelectField>
                <FormHelperText>{((touched && error) ? true : false) ? (custom.errorText ? custom.errorText : error) : ''}</FormHelperText>
            </FormControl>
        )
    }
}

const useStyles = {
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: '0px 2px',
        height: 20
    },
};

function getStyles(id, selectedValues) {
    return {
        fontWeight:
            selectedValues.indexOf(id) === -1
                ? 400
                : 600
    };
}

export  class renderAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this._extractData = this._extractData.bind(this);
        this._onChange = this._onChange.bind(this);
    }


    _onChange(event, value) {
        console.log(event, value);
    }


    _extractData(options) {

        const {data, extract, input} = this.props;
        return options[extract['title']];
        return data.map((val) => {
            const value = val[extract['value']];
            const title = val[extract['title']];
            return title;
        })
    }


    render() {
        const {input, label, margin, meta: {touched, error}, dataObj, data, children, ...custom} = this.props;
        console.log(input.value);
        return (
            <div>
                <Autocomplete
                    multiple
                    id="tags-standard"
                    {...input}
                    {...custom}
                    options={this.props.data}
                    getOptionLabel={this._extractData}
                    defaultValue={input.value != '' ? input.value : []}
                    onChange={this._onChange}
                    // defaultValue={[top100Films[13]]}
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Multiple values"
                            placeholder="Favorites"
                        />
                    )}
                />
            </div>
        )
    }
}


class renderOutlinedMultipleSelectFieldClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labelWidth: 0,
            selectedData: [],
        };
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }

    _renderTourTypes() {
        const {data, extract, input} = this.props;
        return data.map((val) => {
            const value = val[extract['value']];
            const title = val[extract['title']];
            return (<MenuItem style={getStyles(value, input.value)} value={value}>{title}</MenuItem>)
        })
    }


    render() {
        const {input, label, margin, meta: {touched, error}, dataObj, data, children, ...custom} = this.props;
        const {classes} = this.props;
        return (
            <FormControl fullWidth variant="outlined" margin={margin} error={touched && error}>
                <InputLabel
                    ref={ref => {
                        this.InputLabelRef = ref;
                    }}
                    htmlFor={custom.inputId}
                >
                    {label}
                </InputLabel>
                <SelectField
                    {...input}
                    value={input.value != '' ? input.value : []}
                    {...custom}
                    multiple
                    // input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => {
                                if (dataObj) {
                                    const temp = dataObj[value];
                                    return (<Chip key={value} label={temp} className={classes.chip}/>)
                                }
                                return (
                                    <Chip key={value} label={value} className={classes.chip}/>
                                )
                            })}
                        </div>
                    )}
                    // MenuProps={MenuProps}
                >
                    {this._renderTourTypes()}
                </SelectField>
                <FormHelperText>{((touched && error) ? true : false) ? (custom.errorText ? custom.errorText : error) : ''}</FormHelperText>
            </FormControl>
        );
    }
}

const renderOutlinedMultipleSelectField = withStyles(useStyles)(renderOutlinedMultipleSelectFieldClass);

export {
    renderOutlinedMultipleSelectField,
}


export const renderCountryContact = ({input, label, maxLimit, meta: {touched, error}, ...custom}) => {
    console.log('renderCountryContact', touched, error);
    return (
        <ReduxCountryContact
            error={(touched && error) ? true : false}
            helperText={((touched && error) ? true : false) ? (custom.errorText ? custom.errorText : error) : ''}
            input={input}
            {...input}
            {...custom}
            label={label}
            // helperText={touched && error}
            variant={'outlined'}
        />
    );
}
