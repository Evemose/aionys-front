"use client"

import {createTheme} from "@mui/material";
import {createBreakpoints} from "@mui/system";

export const breakpoints = createBreakpoints({
    values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
});

const theme = createTheme({
    palette: {
        primary: {
            main: '#000',
        },
        secondary: {
            main: '#fff',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    [breakpoints.down('md')]: {
                        fontSize: '0.75rem',
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                h3: {
                    [breakpoints.down('md')]: {
                        fontSize: '1.5rem',
                    }
                },
                h1: {
                    [breakpoints.down('md')]: {
                        fontSize: '4rem',
                    }
                }
            }
        },
    }
})


export default theme;