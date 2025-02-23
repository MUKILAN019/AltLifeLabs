import { useState, useEffect } from "react";

interface Book {
    book_id:number,
    book_name: string;
    book_publisher: string;
}

const NeverBorrow: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNeverBorrow = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/query/never-borrow", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch books that were never borrowed");
                }

                const data = await res.json();
                setBooks(data.neverborrow);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNeverBorrow();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-4">Books That Were Never Borrowed</h1>

            {loading && <p className="text-gray-500 text-center">Loading books...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && books.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border p-3 text-[#7747ff]">Book Name</th>
                            <th className="border p-3 text-[#7747ff]">Publisher</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.book_id}className="border">
                                <td className="border p-2 text-center">{book.book_name}</td>
                                <td className="border p-2 text-center">{book.book_publisher}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && !error && books.length === 0 && (
                <p className="text-gray-500 mt-4 text-center">No books found.</p>
            )}
        </div>
    );
};

export default NeverBorrow;
