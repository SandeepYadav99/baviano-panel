/**
 * Created by charnjeetelectrovese@gmail.com on 1/20/2020.
 */
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PageBox from '../../../components/PageBox/PageBox.component';
import styles from './index.module.css';

class TotalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    _renderCommissions() {
        const {tour} = this.props;
        return tour.commissions.map((val) => {
            return (<tr>
                <td>{val.tour_type_name}</td>
                <td>{val.commission} %</td>
            </tr>);
        })
    }

    render() {
        const {data} = this.props;
        return (
            <PageBox>
                <div className={styles.totalInfo}>
                    <div className={styles.profileCard}>
                        <div className={styles.image}>
                            <img src={data.logo} alt=""/>
                        </div>
                        <div className={styles.nameInfo}>
                            <div className={styles.name}>{data.name}</div>
                            {/*<div className={styles.city}>{common.city.toLowerCase()}, {common.country.toLowerCase()}</div>*/}
                        </div>
                    </div>
                    <h3>Contact</h3>
                    <hr/>
                    <div className={styles.formFlex}>
                        <div className={styles.formGroup}>
                            <label>Contact</label>
                            <div>
                                {data.contact}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <div>
                                {data.address}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <div>
                                {data.email}
                            </div>
                        </div>
                    </div>
                    <div className={styles.formFlex}>
                        <div className={styles.formGroup}>
                            <label>Representative Name</label>
                            <div>
                                {data.representative_name}
                            </div>

                        </div>
                        <div className={styles.formGroup}>
                            <label>Representative Designation</label>
                            <div>
                                {data.representative_designation}
                            </div>
                        </div>
                    </div>

                    {/*<h3>KYC</h3>*/}
                    {/*<hr/>*/}
                    {/*<div className={styles.formFlex}>*/}
                    {/*    <div className={styles.formGroup}>*/}
                    {/*        <label>KYC Doc Type</label>*/}
                    {/*        <div>*/}
                    {/*            {kyc.document_type}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.formGroup}>*/}
                    {/*        <label>KYC Doc Number</label>*/}
                    {/*        <div>*/}
                    {/*            {kyc.document_no}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.formGroup}>*/}
                    {/*        <label>KYC ID Proof</label>*/}
                    {/*        <div>*/}
                    {/*            <a href={kyc.id_proof} target='_blank'>Link</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className={styles.formFlex}>*/}
                    {/*    <div className={styles.formGroup}>*/}
                    {/*        <label>KYC User Image</label>*/}
                    {/*        <div>*/}
                    {/*            <a href={kyc.user_image} target='_blank'>Link</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                </div>
            </PageBox>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalInfo);
