


import React, { useState } from 'react';



export default function AddMemberForm({ groupName, onAddMember, postAdd }) {

    const [name, setName] = useState('');

    const [error, setError] = useState('');



    const handleSubmit = async () => {

        setError('');

        if (!name.trim()) {

            setError('Member name required');

            return;

        }

        try {

            await onAddMember(groupName, name.trim());

            postAdd();

            setName('');

        } catch (err) {

            setError(err.message);

        }

    };



    return (

        <div data-testid="add-member-form" className="p-3 border rounded bg-light mt-3">

            <h5>Add Member</h5>

            {error && <div className="alert alert-danger">{error}</div>}



            <input

                data-testid="member-input"

                type="text"

                className="form-control mb-2"

                placeholder="Member Name"

                value={name}

                onChange={(e) => setName(e.target.value)}

            />



            <button

                data-testid="add-member-button"

                className="btn btn-secondary"

                onClick={handleSubmit}

            >

                Add Member

            </button>

        </div>

    );

}