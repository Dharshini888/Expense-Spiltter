import React from "react";

import { AppBar, Toolbar, IconButton, Typography, Badge, Tooltip, Box, Switch, Button } from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";



export default function Navbar({ mode, onToggleMode }) {

    const nav = useNavigate();

    const { user, logout } = useAuth();



    return (

        <AppBar position="sticky" elevation={2}>

            <Toolbar>

                <Typography variant="h6" component={Link} to="/" style={{ color: "inherit", textDecoration: "none" }}>

                    Expense Splitter

                </Typography>
                <Box sx={{ flex: 1 }} />

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

                    <Typography component={Link} to="/dashboard" color="inherit" sx={{ textDecoration: "none" }}>

                        Dashboard

                    </Typography>

                    <Typography component={Link} to="/groups" color="inherit" sx={{ textDecoration: "none" }}>

                        Groups

                    </Typography>

                    <Typography component={Link} to="/search" color="inherit" sx={{ textDecoration: "none" }}>

                        Search

                    </Typography>

                    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>

                        <Switch checked={mode === "dark"} onChange={onToggleMode} />

                    </Tooltip>

                    {user ? (

                        <>

                            <Typography component={Link} to="/profile" color="inherit" sx={{ textDecoration: "none" }}>

                                {user.name || "Me"}

                            </Typography>

                            <Button color="inherit" onClick={logout}>Logout</Button>

                        </>

                    ) : (

                        <Button color="inherit" onClick={() => nav("/login")}>Login</Button>

                    )}

                </Box>

            </Toolbar>

        </AppBar>

    );

}