/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React from "react";
import classnames from "classnames";
import {
    Paper,
    withStyles,
    Typography,
    IconButton
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";

const Widget = ({
                    classes,
                    children,
                    title,
                    noBodyPadding,
                    bodyClass,
                    className,
                    disableWidgetMenu,
                    ...props
                }) => (
    <div className={classes.widgetWrapper}>
        <Paper className={classes.paper} classes={{ root: classes.widgetRoot }}>
            <div className={classes.widgetHeader}>
                {props.header}
            </div>
            <div
                className={classnames(classes.widgetBody, {
                    [classes.noPadding]: noBodyPadding,
                    [bodyClass]: bodyClass
                })}
            >
                {children}
            </div>
        </Paper>
    </div>
);

const styles = theme => ({
    widgetWrapper: {
        display: "flex",
        minHeight: "100%"
    },
    widgetHeader: {
        padding: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    widgetRoot: {
        boxShadow: theme.customShadows.widget
    },
    widgetBody: {
        paddingBottom: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 3
    },
    noPadding: {
        padding: 0
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden"
    },
    moreButton: {
        margin: -theme.spacing.unit,
        padding: 0,
        width: 40,
        height: 40,
        color: theme.palette.text.hint,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: "rgba(255, 255, 255, 0.35)"
        }
    }
});

export default withStyles(styles, { withTheme: true })(Widget);
