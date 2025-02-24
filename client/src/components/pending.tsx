import {useState, useEffect} from 'react';


interface PendingReturn{
   issuance_id: number;
   book_id:number;
   issuance_member: number;
   target_return_date: string;
   members:{
      mem_name:string,
      mem_email:string
   }
}
const Pending: React.FC = () =>{
     const [pendingReturns, setPendingReturns] = useState<PendingReturn[]>([]);
     const [loading,setLoading] = useState<boolean>(true);
     const [error,setError] = useState<string | null>(null);

     useEffect(()=>{
       const fetchPendingReturns =  async ()=>{
         try {
            const token = localStorage.getItem('token');
            const res = await fetch("/lib/borrow/pending",
               {
                  method:"GET",
                  headers:{
                     "Content-Type":"application/json",
                      Authorization:`Bearer ${token}`
                  }
               }
            );
            if(!res.ok){
               throw new Error("Failed to fetch pending returns");
            }
            const data = await res.json();
            setPendingReturns(data.pendingReturns);
         } catch (error: unknown) {
            if (error instanceof Error) {
               setError(error.message);
           } else {
               setError("An unknown error occurred");
           }
         }
         finally{
            setLoading(false);
         }
       }
       fetchPendingReturns();
     },[])

     return(
      <div className="p-8 min-h-screen px-4 bg-[#1D232A]">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">
          Pending Book Returns
      </h1>

      {loading && <p className="text-gray-500 text-center">Loading pending returns...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && pendingReturns.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
              <thead>
                  <tr className="bg-gray-300">
                      <th className="border p-3 text-[#7747ff]">Issuance ID</th>
                      <th className="border p-3 text-[#7747ff]">Book ID</th>
                      <th className="border p-3 text-[#7747ff]">Member Name</th>
                      <th className="border p-3 text-[#7747ff]">Member Email</th>
                      <th className="border p-3 text-[#7747ff]">Return Date</th>
                  </tr>
              </thead>
              <tbody>
                  {pendingReturns.map((borrow) => (
                      <tr key={borrow.issuance_id} className="border">
                          <td className="border p-2 text-center">{borrow.issuance_id}</td>
                          <td className="border p-2 text-center">{borrow.book_id}</td>
                          <td className="border p-2 text-center">{borrow.members.mem_name}</td>
                          <td className="border p-2 text-center">{borrow.members.mem_email}</td>
                          <td className="border p-2 text-center text-red-500 font-bold border-amber-50">
                              {new Date(borrow.target_return_date).toLocaleDateString()}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      )}

      {!loading && !error && pendingReturns.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No pending book returns for today.</p>
      )}
  </div>
     )
} 
export default Pending;