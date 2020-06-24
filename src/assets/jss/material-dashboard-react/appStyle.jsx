/* eslint-disable no-tabs */
// ##############################
// // // App styles
// #############################

import { drawerWidth, transition, container } from '../material-dashboard-react';

const appStyle = theme => ({
	wrapper: {
		position: 'relative',
		top: '0',
		height: '100vh',
		overflowX: 'hidden',
		backgroundColor: theme.palette.bgColor.main
	},
	mainPanel: {
		// [theme.breakpoints.up("md")]: {
		//   width: `calc(100% - ${drawerWidth}px)`
		// },
		overflow: 'auto',
		position: 'relative',
		float: 'right',
		...transition,
		maxHeight: '100%',
		width: '100%',
		overflowScrolling: 'touch',
	},
	appBar: {
		// transition: theme.transitions.create(['margin', 'width'], {
		//     easing: theme.transitions.easing.sharp,
		//     duration: theme.transitions.duration.leavingScreen,
		// }),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		// transition: theme.transitions.create(['margin', 'width'], {
		//     easing: theme.transitions.easing.easeOut,
		//     duration: theme.transitions.duration.enteringScreen,
		// }),
	},
	content: {
		// marginTop: '70px',
		padding: '30px 15px',
		minHeight: 'calc(100% - 123px)',
	},
	container,
	map: {
		// marginTop: '70px',
	},
});

export default appStyle;
