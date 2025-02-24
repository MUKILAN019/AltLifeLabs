import { useState, useEffect } from "react";

interface OutstandingBook {
    mem_name: string;
    book_name: string;
    issuance_date: string;
    target_return_date: string;
    book_publisher: string;
}

const OutstandingBooks: React.FC = () => {
    const [books, setBooks] = useState<OutstandingBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOutstandingBooks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/query/outstanding-books", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch outstanding books");
                }

                const data = await res.json();
                setBooks(data.outstandingBooks);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOutstandingBooks();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-4">Outstanding Books</h1>

            {loading && <p className="text-gray-500 text-center">Loading outstanding books...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
             <div className="flex justify-center">
            {!loading && !error && books.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border p-3 text-[#7747ff]">Member Name</th>
                            <th className="border p-3 text-[#7747ff]">Book Name</th>
                            <th className="border p-3 text-[#7747ff]">Issued Date</th>
                            <th className="border p-3 text-[#7747ff]">Target Return Date</th>
                            <th className="border p-3 text-[#7747ff]">Publisher</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2 text-center text-white">{book.mem_name}</td>
                                <td className="border p-2 text-center text-white">{book.book_name}</td>
                                <td className="border p-2 text-center text-white">{new Date(book.issuance_date).toLocaleDateString()}</td>
                                <td className="border p-2 text-center font-bold text-white">
                                    {new Date(book.target_return_date).toLocaleDateString()}
                                </td>
                                <td className="border p-2 text-center text-white">{book.book_publisher}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
           </div>
            {!loading && !error && books.length === 0 && (
                <p className="text-gray-500 mt-4 text-center">No outstanding books.</p>
            )}
        </div>
    );
};

export default OutstandingBooks;
