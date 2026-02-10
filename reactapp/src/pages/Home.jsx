import React, { useState } from "react";

import Dashboard from "../components/Dashboard";

import GroupList from "../components/GroupList";



export default function Home() {

    const [groups, setGroups] = useState([]);   // ideally fetched with API

    const [selectedGroupId, setSelectedGroupId] = useState(null);



    return (

        <div className="py-2">

            <h2 className="mb-3">Welcome back 👋</h2>



            {/* Add GroupList */}

            <GroupList
                groups={groups}

                selectedGroupId={selectedGroupId}

                onSelect={(id) => setSelectedGroupId(id)}   // ✅ Fix here

            />



            {/* Pass groups down to Dashboard if needed */}

            <Dashboard groups={groups} />

        </div>
    );

}

// import React from "react";

// import Dashboard from "../components/Dashboard";



// export default function Home() {

//     return (

//         <div className="py-2">

//             <h2 className="mb-3">Welcome back 👋</h2>

//             <Dashboard />

//         </div>

//     );

// }