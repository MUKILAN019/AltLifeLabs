import {useState, useEffect} from 'react';

interface TopBorrowedBook{
    book_name: string,
    borrow_time: number,
    member_borrow: number
}

const TopBorrowed: React.FC = () =>{
    const [books, setBooks] = useState<TopBorrowedBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchTopBorrowed = async ()=>{
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/query/top-borrow",{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    }
                })
                if(!res.ok){
                    throw new Error("Failed to fetch top borrowed books");
                }
                const data = await res.json();
                setBooks(data.topBorrow)
            } catch (error: any) {
                setError(error.message)
            }finally{
                setLoading(false);
            }  
        }
      fetchTopBorrowed();
    },[])
    return(
        <div className="p-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Top 10 Most Borrowed Books</h1>

        {loading && <p className="text-gray-500 text-center">Loading top borrowed books...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && books.length > 0 && (
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="border p-3 text-[#7747ff]">Book Name</th>
                        <th className="border p-3 text-[#7747ff]"># of Times Borrowed</th>
                        <th className="border p-3 text-[#7747ff]"># of Members</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={index} className="border">
                            <td className="border p-2 text-center text-white">{book.book_name}</td>
                            <td className="border p-2 text-center font-bold text-green-600">
                                {book.borrow_time}
                            </td>
                            <td className="border p-2 text-center font-bold text-blue-600">
                                {book.member_borrow}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        {!loading && !error && books.length === 0 && (
            <p className="text-gray-500 mt-4 text-center">No books found.</p>
        )}
    </div>

    )
}

export default TopBorrowed;