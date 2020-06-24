/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';
import {VerifiedUser} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 500,
        fontSize: '14px'
    },
    avatar: {
        backgroundColor: 'black',
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        color: theme.palette.error.dark,
        marginRight: theme.spacing(1)
    }
}));

const Budget = props => {
    const { className, title, value, icon, ...rest } = props;

    const classes = useStyles();
    const TempIcon = icon;
    return (
        <Card
            {...rest}
            className={classnames(classes.root, className)}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                >
                    <Grid item>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                        >
                            {title}
                        </Typography>
                        <Typography variant="h3">{value}</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <TempIcon className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
                {/*<div className={classes.difference}>*/}
                {/*    <ArrowDownwardIcon className={classes.differenceIcon} />*/}
                {/*    <Typography*/}
                {/*        className={classes.differenceValue}*/}
                {/*        variant="body2"*/}
                {/*    >*/}
                {/*        12%*/}
                {/*    </Typography>*/}
                {/*    <Typography*/}
                {/*        className={classes.caption}*/}
                {/*        variant="caption"*/}
                {/*    >*/}
                {/*        Since last month*/}
                {/*    </Typography>*/}
                {/*</div>*/}
            </CardContent>
        </Card>
    );
};

Budget.propTypes = {
    className: PropTypes.string
};

export default Budget;
