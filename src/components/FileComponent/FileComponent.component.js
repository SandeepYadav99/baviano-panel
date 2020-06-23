import React, {Component} from 'react';
import styles from './FileComponent.module.css'
import classnames from 'classnames'
import EventEmitter from "../../libs/Events.utils";

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this._handleFileChange = this._handleFileChange.bind(this);
        this._getImageUrl = this._getImageUrl.bind(this);
    }


    _handleFileChange(e) {
        const {multiple} = this.props;
        const allowedArr = this.props.type;
        const maxCount = ('max_count' in this.props ? this.props.max_count : 0);
        let isError = false;
        let tempTotal = 0;
        let totalValid = 0;
        e.preventDefault();
        if (e.target.files[0]) {
            console.log(e.target.files, 'FILECOMPONENT');
            const tempFiles = [];
            Object.keys(e.target.files).forEach((key) => {
                if (multiple && maxCount != 0 && maxCount <= tempTotal) {
                    return true;
                }
                const tempFile = e.target.files[key];
                const sFileName = tempFile.name;
                const sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
                const fileSize = tempFile.size;

                if (fileSize <= this.props.max_size && (allowedArr.length > 0 ? (allowedArr.indexOf(sFileExtension) > -1) : true)) {
                    console.log(this.props);
                    tempFiles.push(tempFile);
                    totalValid++;
                } else {
                    isError = true;
                    console.log('error')
                }
                tempTotal++;
            });
            if (isError && totalValid < 1) {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Invalid Upload', type: 'error'});
            }
            if (tempFiles.length > 0) {
                if (multiple) {
                    this.props.onChange(tempFiles);
                } else {
                    this.props.onChange(tempFiles[0]);
                }
            }

        }
    }

    _getImageUrl (value) {
        const {default_image} = this.props;
        console.log('_getImageUrl', value);
        if (value) {
            return URL.createObjectURL(value)
        } else if (default_image) {
            return default_image;
        } return require('../../assets/img/ic_image_default.png');
    }


    render() {
        const {value, children, multiple, accept, error, placeholder, show_image, default_image, link} = this.props;
        console.log('image', default_image);
        let tempPlaceHolder = this.props.placeholder;
        if (value != '') {
            if (value instanceof Object && !Array.isArray(value)) {
                tempPlaceHolder = value.name.length > 20 ? value.name.substr(0, 20) : value.name;
            } else {
                tempPlaceHolder = value.length + ' Selected';
            }
        }
        if (show_image && !multiple) {
            return (
                <div className={styles.imageBtnContainer}>
                    <div>
                        <div className={styles.image} style={{ backgroundImage: "url("+(this._getImageUrl(value))+")",
                        backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                    </div>
                    <div className={styles.imgLowerContainer}>
                        <label className={styles.imgFileLabel} style={error ? {backgroundColor: 'red' } : {}}>Upload</label>
                        <input multiple={multiple} id="upload" data-value={'JPG'} accept={accept ? accept : 'image/*'}
                               onChange={this._handleFileChange}
                               className={styles.fileInput}
                               type="file"/>
                    </div>
                    <label style={{fontSize:'14px',fontWeight:'500'}}>{this.props.placeholder}</label>
                </div>
            );
        }
        return (
            <div className={styles.positionR}>
                <div>

                </div>

                <div className={styles.fileUpload}>
                    <div className={styles.fileName}
                         style={error ? {border: '1px solid red', color: 'red'} : {color: 'grey'}}>
                        {/*<div style={this.props.value ? {marginLeft:'15px',color:'grey'} : {marginLeft:'15px', color: (this.props.error ? 'red': 'grey')}}></div>*/}
                        {tempPlaceHolder}

                    </div>

                    <div >
                        <label className={styles.fileLabel}>Upload</label>
                        <input multiple={multiple} id="upload" data-value={'JPG'} accept={accept ? accept : 'image/*'}
                               onChange={this._handleFileChange}
                               className={styles.fileInput}
                               type="file"/>
                    </div>
                </div>
                {link && (<a className={styles.anchorTag} href={link} target={'_blank'}>Preview</a>)}
            </div>
        )
    }
}

export default File
