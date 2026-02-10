import React from "react";

import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import GroupAddIcon from "@mui/icons-material/GroupAdd";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useNavigate } from "react-router-dom";



export default function QuickActions({ onCreateGroup, onAddExpense }) {

    const navigate = useNavigate();



    return (


        <SpeedDial

            ariaLabel="quick-actions"

            sx={{ position: "fixed", bottom: 24, right: 24 }}

            icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<AddIcon />} />}

        >

            <SpeedDialAction
                icon={<GroupAddIcon />}

                tooltipTitle="Create Group"

                onClick={() => navigate("/groups/create")}

            />

            {/* <SpeedDialAction
                icon={<ReceiptLongIcon />}

                tooltipTitle="Add Expense"

                onClick={() => navigate("/expenses/add")}

            />

            <SpeedDialAction

                icon={<ReceiptLongIcon />}

                tooltipTitle="Notifications"

                onClick={() => navigate("/notifications")}

            /> */}

        </SpeedDial>


    );

}
