import { useRef, useCallback, useState } from "react";
import axios from "axios";

const Modal: React.FC = () => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]); 


  const fetchUserMemberships = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/user/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const memberships = response.data.memberships.map((m: any) => m.status);
      setSelectedMemberships(memberships);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
    }
  };

  
  const openModal = useCallback(() => {
    modalRef.current?.showModal();
    fetchUserMemberships();
  }, []);


  const handleMembership = async (status: string) => {
    try {
      if (selectedMemberships.includes(status)) {
        alert(`You have already selected ${status} Membership.`);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to get a membership.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/user/membership",
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setSelectedMemberships((prev) => [...prev, status]); 
    } catch (error) {
      alert("Failed to create membership. Try again.");
    }
  };

  return (
    <div>
      <button className="btn btn-outline btn-secondary" onClick={openModal}>
        Get Membership
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-green-600">Membership</h3>
          <p className="py-4">
            Want a membership? Click{" "}
            <span className="text-green-600 font-bold cursor-pointer">Get button</span>.
          </p>

          <div className="lg:flex md:flex sm:grid sm:grid-cols-1 justify-between gap-4 w-full">
            <div className="grid gap-2">
              <p className="font-bold text-[#7747ff]">Free Membership</p>
              <button
                className="btn btn-primary w-36"
                onClick={() => handleMembership("Free")}
                disabled={selectedMemberships.includes("Free")}
              >
                {selectedMemberships.includes("Free") ? "Selected" : "GET"}
              </button>
            </div>
            <div className="grid gap-2">
              <p className="font-bold text-pink-500">
                Paid Membership <span className="font-bold text-white">free now !!!</span>
              </p>
              <button
                className="btn btn-secondary w-36"
                onClick={() => handleMembership("Paid")}
                disabled={selectedMemberships.includes("Paid")}
              >
                {selectedMemberships.includes("Paid") ? "Selected" : "GET"}
              </button>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
