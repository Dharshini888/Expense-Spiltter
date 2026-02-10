import React from 'react';



const GroupDetail = ({ group, members, expenses, balances, onAddMember, onAddExpense }) => {

    const [memberName, setMemberName] = React.useState('');

    const [desc, setDesc] = React.useState('');

    const [amount, setAmount] = React.useState('');

    const [payer, setPayer] = React.useState('');

    const [date, setDate] = React.useState('');



    const handleAddMember = () => {

        if (memberName.trim()) {

            onAddMember(memberName.trim());

            setMemberName('');

        }

    };



    const handleAddExpense = () => {

        if (desc && amount && payer && date) {

            onAddExpense({ description: desc, amount: parseFloat(amount), payer, date });

            setDesc('');

            setAmount('');

            setPayer('');

            setDate('');

        }

    };



    return (

        <div className="p-3" data-testid="group-detail">

            {/* Fix 1: show group name */}

            <h4>{group?.groupName}</h4>



            <h5>Members</h5>

            <div data-testid="group-members">

                {members.length > 0 ? (

                    members.map((m) => (

                        <p key={m} data-testid={`member-item-${m}`}>{m}</p>

                    ))

                ) : (

                    <p>No members.</p>

                )}

            </div>



            <div className="p-3 border rounded bg-light" data-testid="add-member-form">

                <h5>Add Member</h5>

                {/* Fix 2: change to member-input */}

                <input

                    className="form-control mb-2"

                    data-testid="member-input"

                    placeholder="Member Name"

                    value={memberName}

                    onChange={(e) => setMemberName(e.target.value)}

                />

                <button

                    className="btn btn-primary"

                    data-testid="add-member-button"

                    onClick={handleAddMember}

                >

                    Add Member

                </button>

            </div>

            <h5 className="mt-3">Expenses</h5>

            <ul className="list-group" data-testid="expense-list">

                {expenses.length > 0 ? (

                    expenses.map((exp) => (

                        <li key={exp.expenseId} className="list-group-item">

                            <span>{exp.description}</span>{' '}

                            <span>₹{exp.amount.toFixed(2)}</span>

                        </li>

                    ))

                ) : (

                    <p>No expenses added yet.</p>

                )}

            </ul>





            <div className="p-3 border rounded bg-light" data-testid="add-expense-form">

                <h5>Add Expense</h5>

                <input

                    className="form-control mb-2"

                    data-testid="desc-input"

                    placeholder="Description"

                    value={desc}

                    onChange={(e) => setDesc(e.target.value)}

                />

                <input

                    className="form-control mb-2"

                    data-testid="amount-input"

                    placeholder="Amount"

                    type="number"

                    value={amount}

                    onChange={(e) => setAmount(e.target.value)}

                />

                <select

                    className="form-control mb-2"

                    data-testid="payer-select"

                    value={payer}

                    onChange={(e) => setPayer(e.target.value)}

                >

                    <option value="">Select Payer</option>

                    {members.map((m) => (

                        <option key={m} value={m}>{m}</option>

                    ))}

                </select>

                <input

                    className="form-control mb-2"

                    data-testid="date-input"

                    type="date"

                    value={date}

                    onChange={(e) => setDate(e.target.value)}

                />

                <button

                    className="btn btn-primary"

                    data-testid="add-expense-button"

                    onClick={handleAddExpense}

                >

                    Add Expense

                </button>

            </div>



            <div className="mt-3" data-testid="balances-section">

                <h5>Balances</h5>

                {balances.length > 0 ? (

                    balances.map((b) => (

                        <p key={b.member}>

                            {b.member}: ₹{b.balance.toFixed(2)}

                        </p>

                    ))

                ) : (

                    <p>No balances to show.</p>

                )}

            </div>

        </div>

    );

};



export default GroupDetail;