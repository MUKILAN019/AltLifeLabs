import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface BorrowDetails {
    issuance_id: number;
    book_id: number;
    issuance_member: number;
    issuance_date: string;
    issued_by: string;
    target_return_date: string;
    issuance_status: string;
}

const Status: React.FC = () => {
    const [borrowDetails, setBorrowDetails] = useState<BorrowDetails[]>([]);
    const [adminDetails, setAdminDetails] = useState<BorrowDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

    const token = localStorage.getItem("token");

  
    let role = "user";
    try {
        const decodedToken: any = jwtDecode(token || "");
        if (decodedToken.role === "admin") {
            role = "admin";
        }
    } catch (err) {
        console.error("Error decoding token:", err);
    }

    useEffect(() => {
        if (!token) {
            setError("Unauthorized. Please log in.");
            setLoading(false);
            return;
        }

        const fetchBorrowDetails = async () => {
            try {
                const response = await fetch("/lib/borrow/details", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch borrow details");

                const data = await response.json();
                setBorrowDetails(data.allRequests);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowDetails();
    }, [token]);

 
    const fetchAdminData = async () => {
        if (role !== "admin") {
            setError("Unauthorized. Admin access only.");
            return;
        }

        try {
            const response = await fetch("/lib/admin/borrow/all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch admin data");

            const data = await response.json();
            console.log(data)
            setAdminDetails(data.allRequests);
        } catch (error: any) {
            setError(error.message);
        }
    };

    
    const updateStatus = async (issuance_id: number, status: string) => {
        try {
            await fetch(`/lib/admin/borrow/update/${issuance_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ issuance_status: status }),
            });

            setAdminDetails((prev) =>
                prev.map((req) =>
                    req.issuance_id === issuance_id ? { ...req, issuance_status: status } : req
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    console.log(adminDetails)
    
    return (
        <div className="p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Borrow Status</h1>

            {loading && <p className="text-gray-500">Loading borrow details...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && borrowDetails.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border p-3 text-[#7747ff]">Issuance ID</th>
                            <th className="border p-3 text-[#7747ff]">Book ID</th>
                            <th className="border p-3 text-[#7747ff]">Issued By</th>
                            <th className="border p-3 text-[#7747ff]">Issuance Date</th>
                            <th className="border p-3 text-[#7747ff]">Return Date</th>
                            <th className="border p-3 text-[#7747ff]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {borrowDetails.map((borrow) => (
                    <tr key={borrow.issuance_id} className="border">
                        <td className="border p-2 text-center">{borrow.issuance_id}</td>
                        <td className="border p-2 text-center">{borrow.book_id}</td>
                        <td className="border p-2 text-center">{borrow.issued_by}</td>
                        <td className="border p-2 text-center">{new Date(borrow.issuance_date).toLocaleDateString()}</td>
                        <td className="border p-2 text-center">{new Date(borrow.target_return_date).toLocaleDateString()}</td>
                        <td
                            className={`border p-2 text-center font-bold border-amber-50 ${
                                borrow.issuance_status === "pending"
                                    ? "text-yellow-500"
                                    : borrow.issuance_status === "accepted"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {borrow.issuance_status}
                        </td>
                    </tr>
                ))}

                    </tbody>
                </table>
            )}

            {!loading && !error && borrowDetails.length === 0 && (
                <p className="text-gray-500 mt-4">No borrowed books found.</p>
            )}

            
            {role === "admin" && (
                <div className="mt-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={() => {
                            setShowAdminPanel(!showAdminPanel);
                            if (!showAdminPanel) fetchAdminData();
                        }}
                    >
                        {showAdminPanel ? "Close Admin Panel" : "Open Admin Panel"}
                    </button>
                </div>
            )}

            
            {showAdminPanel && role === "admin" && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

                    {!loading && !error && adminDetails.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-300">
                                    <th className="border p-3 text-[#7747ff]">Issuance ID</th>
                                    <th className="border p-3 text-[#7747ff]">Book ID</th>
                                    <th className="border p-3 text-[#7747ff]">Member ID</th>
                                    <th className="border p-3 text-[#7747ff]">Status</th>
                                    <th className="border p-3 text-[#7747ff]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminDetails.map((borrow) => (
                                    <tr key={borrow.issuance_id} className="border">
                                        <td className="border p-2 text-center">{borrow.issuance_id}</td>
                                        <td className="border p-2 text-center">{borrow.book_id}</td>
                                        <td className="border p-2 text-center">{borrow.issuance_member}</td>
                                        <td className="border p-2 text-center">{borrow.issuance_status}</td>
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() => updateStatus(borrow.issuance_id, "accepted")}
                                                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateStatus(borrow.issuance_id, "rejected")}
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No requests found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Status;
