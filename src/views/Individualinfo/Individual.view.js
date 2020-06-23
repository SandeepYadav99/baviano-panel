import React, {Component} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Stepper, Step, StepLabel, Button, CircularProgress} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import PageBox from '../../components/PageBox/PageBox.component';
import Contact from './Contact/Contact.view'
import KYC from './KYC/KYC.view'
import Account from './Account/Account.view'
import TourType from './TourType/TourType.view'
import EventEmitter from '../../libs/Events.utils';
import {serviceUpdateProfile} from "../../services/Provider.service";
import DashboardSnackbar from "../../components/Snackbar.component";
import {WaitingComponent} from "../../components/index.component";
import ProfileComponent from './Profile/Profile.view';
import {serviceGetCustomList} from "../../services/Common.service";
import styles from './Individual.module.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const steps = ['Contact Details', 'Citizen Card/ Residency Permit', 'Banking Details', 'Tour Details'];


class Individual extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 0,
            snackbar: false,
            message: '',
            tour_types: [],
            categories: [],
            cities: [],
            show_success: false,
            is_submitting: false,
        };
        this._refArr = [];
        this.childData = [{}, {}, {}, {}];
        this.childEdit = [false, false, false, false];
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this._submitChild = this._submitChild.bind(this);
        this._showError = this._showError.bind(this);
        this.types = ['contact', 'kyc', 'account', 'tour'];
        this._updateProps = this._updateProps.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
    }

    _updateProps() {

        const {contact, account, kyc, tour, common} = this.props;
        if (contact) {
            this.childData[0] = contact;
            this.childEdit[0] = true;
        }
        if (kyc) {
            this.childData[1] = kyc;
            this.childEdit[1] = true;
        }

        if (account) {
            this.childData[2] = account;
            this.childEdit[2] = true;
        }

        if (tour) {
            this.childData[3] = tour;
            this.childEdit[3] = true;
        }
        if (common) {
            this.childData[4] = common;
            this.childEdit[4] = true;
        }
        this.setState({
            activeStep: 0
        });
    }

    componentWillMount() {
        this._updateProps();
    }

    componentDidMount() {
        serviceGetCustomList(['CITY', 'CATEGORY']).then((req) => {
            if (!req.error) {
                const data = req.data;
                this.setState({
                    categories: data.categories,
                    cities: data.cities,
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(prevProps.user_profile) != JSON.stringify(this.props.user_profile)) {
            if ((this.props.user_profile.status == 'REJECTED' || this.props.user_profile.status == 'SUSPENDED') && this.props.user_profile.note) {
                this.setState({
                    show_note: true
                });
            }
            this.setState({
                activeStep: -1
            }, () => {
                this._updateProps();
            })
        }
    }

    handleNext() {
        const {activeStep} = this.state;
        if (this._refArr[activeStep]) {
            const tempRef = this._refArr[activeStep];
            console.log(tempRef);
            console.log(tempRef.ref.current.wrapped.current);
            tempRef.ref.current.wrapped.current.childSubmit();
            // tempRef.ref.current.childSubmit();
            // this.setState({
            //     activeStep:this.state.activeStep + 1
            // })
        }
    };

    _submitChild(data) {
        const {activeStep} = this.state;
        this.childData[activeStep] = {...this.childData[activeStep], ...data};

        const fd = new FormData();
        fd.append('type', this.types[activeStep]);
        Object.keys(data).forEach((val) => {
            fd.append(val, data[val]);
        });
        this.setState({
            is_submitting: true,
        })
        serviceUpdateProfile(fd).then((data) => {

            if (!data.error) {
                const tempData = data.data;
                this.childData[activeStep] = {...this.childData[activeStep], ...data, ...tempData};
            }
            this.setState({
                is_submitting: false
            });
            if (activeStep + 1 < steps.length) {
                this.setState({
                    activeStep: activeStep + 1
                });
            } else {
                this.setState({
                    show_success: true
                    // activeStep: 0,
                });
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                    error: 'Thank you for submission of your KYC documents, please hold back while the admin reviews your profile.',
                    type: 'success'
                });
            }
        });


    }

    handleBack() {
        this.setState({
            activeStep: this.state.activeStep - 1
        })
    };

    handleReset() {
        this.setState({
            activeStep: 0
        })
    };

    _renderInfo() {
        const {contact, kyc, account, tour, common} = this.props;
        const {tour_types, cities, categories} = this.state;
        switch (this.state.activeStep) {
            case 0 : {
                return <Contact
                    submitCallback={this._submitChild}
                    ref={(ref) => {
                        this._refArr[0] = ref
                    }}
                    data={this.childData[0]}
                    common={common}
                    showError={this._showError}
                    is_edit={this.childEdit[0]}
                />
            }
            case 1: {
                return <KYC
                    submitCallback={this._submitChild}
                    ref={(ref) => {
                        this._refArr[1] = ref
                    }}
                    data={this.childData[1]}
                    is_edit={this.childEdit[1]}
                />
            }
            case 2: {
                return <Account
                    submitCallback={this._submitChild}
                    ref={(ref) => {
                        this._refArr[2] = ref
                    }}
                    data={this.childData[2]}
                    is_edit={this.childEdit[2]}
                />
            }
            case 3: {
                return <TourType
                    tour_types={tour_types}
                    categories={categories}
                    cities={cities}
                    submitCallback={this._submitChild}
                    ref={(ref) => {
                        this._refArr[3] = ref
                    }}
                    data={this.childData[3]}
                    is_edit={this.childEdit[3]}
                />
            }
            default: {
                return null;
            }
        }
    }

    _showError(error) {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error});
    }

    _handleDialogClose() {
        this.setState({
            show_note: false,
        })
    }

    _renderDialog() {
        const {note, status} = this.props;
        if (this.state.show_note) {
            return (<Dialog
                keepMounted
                TransitionComponent={Transition}
                open={this.state.show_note}
                onClose={this._handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Note From Admin"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <span style={{ textTransform: 'capitalize' }}>{note} - Please fill information accordingly and resubmit your application again.</span>
                        <br/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>)
        }
        return null;
    }

    render() {
        const {classes, is_fetching, is_verified, user_profile} = this.props;
        if (!is_fetching) {
            if (is_verified) {
                return (
                    <ProfileComponent data={user_profile}/>
                )
            }
            if (this.state.show_success) {
                return (
                    <div>
                        <PageBox>
                            <div className={styles.infoContainer}>
                                <h2>Thank You</h2>
                            <h3 style={{color:'grey'}}>Thanks for entering your information, our representative will get in touch with you.
                                Your request is processing. Hold back till your request is approved
                            </h3>
                            </div>
                        </PageBox>
                    </div>
                )
            }
            return (
                <div>
                    <PageBox>
                        <Stepper activeStep={this.state.activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {this._renderInfo()}
                        <div>
                            <div style={{float: 'right'}}>
                                {!this.state.is_submitting && (<>
                                    <Button
                                        disabled={this.state.activeStep === 0}
                                        onClick={this.handleBack}
                                    >
                                        Back
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={this.handleNext}>
                                        {this.state.activeStep === steps.length - 1 ? 'Submit The Application' : 'Next'}
                                    </Button>
                                </>)}

                                {this.state.is_submitting && (<>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={true}
                                    >
                                        Submitting
                                    </Button>
                                </>)}


                            </div>

                        </div>
                    </PageBox>
                    <DashboardSnackbar/>
                    {this._renderDialog()}
                </div>
            )
        } else {
            return (
                <WaitingComponent/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        user_profile: state.auth.user_profile,
        contact: state.auth.user_profile.contact,
        kyc: state.auth.user_profile.kyc,
        account: state.auth.user_profile.account,
        common: state.auth.user_profile.common,
        tour: state.auth.user_profile.tour,
        tours_data: state.auth.user_profile.tours_data,
        is_fetching: state.auth.user_profile.is_fetching,
        is_verified: state.auth.user_profile.is_verified,
        note: state.auth.user_profile.note,
        status: state.auth.user_profile.status
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Individual);
