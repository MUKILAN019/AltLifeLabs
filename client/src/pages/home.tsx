import { useState, useEffect } from "react";
import Modal from "../utilis/modal";
import { Link } from "react-router-dom";
// import Pending from "../components/pending";
import NeverBorrow from "../components/neverBorrow";
import OutstandingBooks from "../components/outstandingBook";
import TopBorrowed from "../components/topBorrow";

interface BookData {
    book_id: number;
    book_name: string;
    book_publisher: string;
}

interface IssuanceStatus {
    [book_id: number]: string; 
}

const Home: React.FC = () => {
    const [books, setBooks] = useState<BookData[]>([]);
    const [status, setStatus] = useState<IssuanceStatus>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token"); 

    
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:6003/lib/books", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch books");

                const data: BookData[] = await response.json();
                setBooks(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchStatus = async () => {
            try {
                const response = await fetch("http://localhost:6003/lib/borrow/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch status");

                const data = await response.json();
                setStatus(data);
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };
        
        if (token) {
            fetchBooks();
            fetchStatus();
        } else {
            setError("Unauthorized. Please log in.");
            setLoading(false);
        }
    }, [token]);
    

    const handleRequest = async (book_id: number) => {
        try {
            const response = await fetch("http://localhost:6003/lib/borrow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ book_id }),
            });

            if (!response.ok) {
                throw new Error("Request failed")
            };

            setStatus((prev) => ({ ...prev, [book_id]: "pending" }));
        } catch (error) {
            console.error("Error requesting book:", error);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-[#1D232A]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#7747ff]">Library Dashboard</h1>
                <div className="flex justify-between sm:w-full gap-3 md:w-1/2  lg:w-96">
                    <Link to='/pending'><button className="btn btn-outline btn-warning">Pending Books</button></Link>
                    <Link to='/status'><button className="btn btn-outline btn-success">Status</button></Link>
                    <Modal />
                </div>

            </div>

            {loading && <p className="text-gray-500">Loading books...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && books.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border p-3 text-[#7747ff]">ID</th>
                            <th className="border p-3 text-[#7747ff]">Book Name</th>
                            <th className="border p-3 text-[#7747ff]">Publisher</th>
                            <th className="border p-3 text-[#7747ff]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.book_id} className="border hover:bg-gray-100">
                                <td className="border p-2 text-center text-green-600">{book.book_id}</td>
                                <td className="border p-2 text-red-600">{book.book_name}</td>
                                <td className="border p-2 text-blue-500">{book.book_publisher}</td>
                                <td className="border p-2 flex justify-center">
                                    <button
                                        className={`px-4 py-2 rounded text-white font-bold ${
                                            status[book.book_id] === "pending"
                                                ? "bg-pink-500 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-700"
                                        }`}
                                        onClick={() => handleRequest(book.book_id)}
                                        disabled={status[book.book_id] === "pending"}
                                    >
                                        {status[book.book_id] === "pending" ? "Pending" : "Request"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <NeverBorrow />
                <OutstandingBooks />
            </div>

            <TopBorrowed/>
           
        </div>
    );
};

export default Home;
