import tinycolor from "tinycolor2";

const primary = "#536DFE";
const bgcolors = '#5850EC';
const secondary = "#9f43ff";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";
const button = "#2196F3";

const lightenRate = 7.5;
const darkenRate = 15;

export default {
    palette: {
        primary: {
            main: primary,
            light: tinycolor(primary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(primary)
                .darken(darkenRate)
                .toHexString()
        },
        bgcolor: {
            main: bgcolors,
            light: tinycolor(bgcolors)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(bgcolors)
                .darken(darkenRate)
                .toHexString()
        },
        secondary: {
            main: secondary,
            light: tinycolor(secondary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(secondary)
                .darken(darkenRate)
                .toHexString(),
            contrastText: "#FFFFFF"
        },
        warning: {
            main: warning,
            light: tinycolor(warning)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(warning)
                .darken(darkenRate)
                .toHexString()
        },
        success: {
            main: success,
            light: tinycolor(success)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(success)
                .darken(darkenRate)
                .toHexString()
        },
        info: {
            main: info,
            light: tinycolor(info)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(info)
                .darken(darkenRate)
                .toHexString()
        },
        button: {
            main: button,
            light: tinycolor(button)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(button)
                .darken(darkenRate)
                .toHexString()
        },
        text: {
            primary: "#4A4A4A",
            secondary: "#6E6E6E",
            hint: "#B9B9B9"
        },
        background: {
            default: "#F6F7FF",
            light: "#F3F5FF"
        }
    },
    customShadows: {
        widget:
            "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
        widgetDark:
            "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
        widgetWide:
            "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A"
    },
    overrides: {
        MuiBackdrop: {
            root: {
                backgroundColor: "#4A4A4A1A"
            }
        },
        MuiMenu: {
            paper: {
                boxShadow:
                    "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A"
            }
        },
        MuiSelect: {
            // select: {
            //   minWidth: '80px',
            // },
            icon: {
                color: "#B9B9B9",
            },
            label: {
                backgroundColor: 'white'
            }
        },
        MuiFormHelperText: {
            root: {
                margin: '0px',
                fontSize: '0.60rem'
            },
            contained: {
                margin: '0px',
                marginLeft: '5px',
                position: 'absolute',
                bottom: '-13px',
                right: '0px',
                marginRight: '2px'
            },
        },
        MuiFormLabel: {
            filled: {
                backgroundColor: 'white'
            }
        },
        MuiListItem: {
            button: {
                // '&:hover, &:focus': {
                //   backgroundColor: '#F3F5FF',
                // },
            },
            selected: {
                backgroundColor: '#F3F5FF !important',
                '&:focus': {
                    backgroundColor: '#F3F5FF',
                },
            }
        },
        MuiTouchRipple: {
            child: {
                backgroundColor: "white"
            }
        },
        MuiTableRow: {
            root: {
                height: 40,
            }
        },
        MuiTableCell: {
            root: {
                padding: '10px',
                // color: 'black !important'
                // borderBottom: '1px solid rgba(224, 224, 224, .5)',
            },
            head: {
                fontSize: '0.80rem',
            },
            body: {
                fontSize: '0.80rem',
            }
        }
    }
};
