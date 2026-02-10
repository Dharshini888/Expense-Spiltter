import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components & Pages
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import QuickActions from "./components/QuickActions";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import GroupDetailPage from "./pages/GroupDetailPage";
import AddExpensePage from "./pages/AddExpensePage";
import CreateGroupForm from "./components/CreateGroupForm";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// API
import { fetchGroups, createGroup, addExpense, addMember as apiAddMember } from "./utils/api";

function AnimatedRoutes({ mode, setMode, groups, fetchAllGroups, handleCreateGroup, handleAddExpense, handleAddMember }) {
      const location = useLocation();

      return (
            <AnimatePresence mode="wait">
                  <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: "100%" }}
                  >
                        <Routes location={location}>
                              <Route path="/" element={<Home />} />
                              <Route path="/login" element={<Login onLogin={fetchAllGroups} />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/dashboard" element={<Dashboard groups={groups} />} />
                              <Route
                                    path="/groups"
                                    element={
                                          <Groups
                                                groups={groups}
                                                refreshGroups={fetchAllGroups}
                                          />
                                    }
                              />
                              <Route
                                    path="/groups/:groupId"
                                    element={
                                          <GroupDetailPage
                                                groups={groups}
                                                onAddExpense={handleAddExpense}
                                                onAddMember={handleAddMember}
                                                refreshGroups={fetchAllGroups}
                                          />
                                    }
                              />
                              <Route
                                    path="/groups/:groupId/expenses"
                                    element={<AddExpensePage groups={groups} onAddExpense={handleAddExpense} />}
                              />
                              <Route
                                    path="/groups/create"
                                    element={<CreateGroupForm onCreateGroup={handleCreateGroup} />}
                              />
                              <Route path="/search" element={<Search />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                  </motion.div>
            </AnimatePresence>
      );
}

function AuthenticatedApp({ mode, onToggleMode }) {
      const { user, loading } = useAuth();
      const [groups, setGroups] = useState([]);

      const fetchAllGroups = async () => {
            if (!user?.id) return;
            try {
                  const res = await fetchGroups(user.id);
                  const formatted = res.map((g) => ({
                        ...g,
                        members: g.members?.map((m) => (typeof m === "string" ? { name: m } : m)) || [],
                  }));
                  setGroups(formatted || []);
            } catch (err) {
                  console.error("Error fetching groups:", err);
            }
      };

      const handleCreateGroup = async (groupData) => {
            try {
                  const res = await createGroup({
                        ...groupData,
                        ownerId: user.id
                  });
                  await fetchAllGroups();
                  return res;
            } catch (err) {
                  console.error("Error creating group:", err);
                  throw err;
            }
      };

      const handleAddMember = async (groupId, memberName) => {
            if (!memberName.trim()) return;
            try {
                  await apiAddMember(groupId, memberName);
                  await fetchAllGroups();
            } catch (err) {
                  console.error("Failed to add member:", err);
            }
      };

      const handleAddExpense = async (groupId, expenseData) => {
            try {
                  await addExpense(groupId, expenseData);
                  await fetchAllGroups();
            } catch (err) {
                  console.error("Error adding expense:", err);
            }
      };

      useEffect(() => {
            if (user) {
                  fetchAllGroups();
            } else {
                  setGroups([]);
            }
      }, [user]);

      if (loading) {
            return (
                  <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress />
                  </Box>
            );
      }

      return (
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                  <Navbar mode={mode} onToggleMode={onToggleMode} />
                  <Layout>
                        <AnimatedRoutes
                              mode={mode}
                              groups={groups}
                              fetchAllGroups={fetchAllGroups}
                              handleCreateGroup={handleCreateGroup}
                              handleAddExpense={handleAddExpense}
                              handleAddMember={handleAddMember}
                        />
                  </Layout>
                  {user && <QuickActions onCreateGroup={handleCreateGroup} onAddExpense={handleAddExpense} />}
            </Box>
      );
}

export default function App() {
      const [mode, setMode] = useState("light");

      useEffect(() => {
            document.documentElement.setAttribute('data-theme', mode);
      }, [mode]);

      const theme = useMemo(
            () =>
                  createTheme({
                        palette: {
                              mode,
                              primary: { main: "#6366f1" },
                              secondary: { main: "#a855f7" },
                              background: {
                                    default: mode === "light" ? "#f8fafc" : "#0f172a",
                                    paper: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 41, 59, 0.7)",
                              },
                              text: {
                                    primary: mode === "light" ? "#1e293b" : "#f8fafc",
                                    secondary: mode === "light" ? "#64748b" : "#94a3b8",
                              }
                        },
                        shape: { borderRadius: 8 }, // Boxy corners
                        typography: {
                              fontFamily: `"Outfit", system-ui, -apple-system, sans-serif`,
                              h1: { fontWeight: 800 },
                              h2: { fontWeight: 800 },
                              h3: { fontWeight: 800 },
                              h4: { fontWeight: 700 },
                              h5: { fontWeight: 700 },
                              h6: { fontWeight: 600 },
                        },
                        components: {
                              MuiButton: {
                                    styleOverrides: {
                                          root: {
                                                borderRadius: 4, // More boxy
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                padding: '10px 24px',
                                          },
                                          containedPrimary: {
                                                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                                          }
                                    }
                              },
                              MuiPaper: {
                                    styleOverrides: {
                                          root: {
                                                backdropFilter: "blur(12px)",
                                                border: mode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                                          }
                                    }
                              },
                              MuiCard: {
                                    styleOverrides: {
                                          root: {
                                                borderRadius: 8,
                                                backgroundImage: 'none',
                                          }
                                    }
                              }
                        }
                  }),
            [mode]
      );

      return (
            <AuthProvider>
                  <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Router>
                              <AuthenticatedApp
                                    mode={mode}
                                    onToggleMode={() => setMode((m) => (m === "light" ? "dark" : "light"))}
                              />
                        </Router>
                  </ThemeProvider>
            </AuthProvider>
      );
}