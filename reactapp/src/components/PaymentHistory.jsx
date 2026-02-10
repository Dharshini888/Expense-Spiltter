import React, { useEffect, useState } from "react";

import axios from "axios";



export default function PaymentHistory({ groupId }) {

    const [payments, setPayments] = useState([]);

    const [members, setMembers] = useState([]);

    const [payer, setPayer] = useState("");

    const [receiver, setReceiver] = useState("");

    const [amount, setAmount] = useState("");



    useEffect(() => {

        fetchPayments();

        fetchMembers();

    }, [groupId]);



    const fetchPayments = async () => {

        try {

            const res = await axios.get(`/payments/${groupId}`);

            setPayments(res.data);

        } catch (err) {

            console.error("Error fetching payment history", err);

        }

    };



    const fetchMembers = async () => {

        try {

            const res = await axios.get(`/groups/${groupId}`);

            setMembers(res.data.members || []);

        } catch (err) {

            console.error("Error fetching members", err);

        }

    };



    const addPayment = async (e) => {

        e.preventDefault();

        if (!payer || !receiver || !amount) {

            alert("Please fill all fields");

            return;

        }

        if (payer === receiver) {

            alert("Payer and Receiver cannot be the same");

            return;

        }

        try {

            await axios.post(`/payments/${groupId}`, {

                payer,

                receiver,

                amount: parseFloat(amount),

            });

            setPayer("");

            setReceiver("");

            setAmount("");

            fetchPayments(); // refresh after adding

        } catch (err) {

            console.error("Error adding payment", err);

        }

    };



    return (
        <div className="card mt-4">
            <h3 className="mb-4 text-secondary">Payment History</h3>

            {/* --- Payment Form --- */}
            <form onSubmit={addPayment} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <select className="form-select form-control" value={payer} onChange={(e) => setPayer(e.target.value)}>
                            <option value="">Select Payer</option>
                            {members.map((m, idx) => {
                                const name = m.name || m;
                                return (
                                    <option key={idx} value={name} disabled={receiver === name}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <select className="form-select form-control" value={receiver} onChange={(e) => setReceiver(e.target.value)}>
                            <option value="">Select Receiver</option>
                            {members.map((m, idx) => {
                                const name = m.name || m;
                                return (
                                    <option key={idx} value={name} disabled={payer === name}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Pay</button>
                    </div>
                </div>
            </form>

            {/* --- History List --- */}
            {payments.length === 0 ? (
                <p className="text-center text-muted">No payments recorded yet.</p>
            ) : (
                <ul className="list-group list-group-flush">
                    {payments.map((p) => (
                        <li key={p.paymentId} className="list-group-item d-flex justify-content-between">
                            <span>
                                <span className="fw-bold text-primary">{p.payer}</span> paid <span className="fw-bold text-success">{p.receiver}</span>
                            </span>
                            <span className="fw-bold">₹{p.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}