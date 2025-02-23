import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import verifyToken from '../middlewares/authMiddleware.js';
import adminToken from '../middlewares/adminAuthMiddleware.js'
const router = express.Router();

router.get('/books',verifyToken, async(req,res)=>{
    try {
        const allBook = await prisma.book.findMany({
            select:{
                book_id:true,
                book_name:true,
                book_publisher:true
            }
        })
        res.status(200).json(allBook) 
    } catch (error) {
       res.status(500).json({error:"Internal server error"})
    }
})

router.post("/borrow", verifyToken, async (req, res) => {
    try {
        const { book_id } = req.body;
        const issuance_member = req.user.mem_id; 
        
        const newBorrow = await prisma.issuance.create({
            data: {
                book_id,
                issuance_member,
                issued_by: "admin", 
                issuance_status: "pending", 
            },
        });
        res.status(201).json({ message: "Successfully requested book", newBorrow });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/borrow/status", verifyToken, async (req, res) => {
    try {
        const mem_id = req.user.mem_id;

        const issuedBooks = await prisma.issuance.findMany({
            where: { issuance_member: mem_id },
            select: { book_id: true, issuance_status: true },
        });

        const statusMap = {};
        issuedBooks.forEach((book) => {
            statusMap[book.book_id] = book.issuance_status;
        });

        res.status(200).json(statusMap);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/borrow/details', verifyToken, async(req,res)=>{
    try {
        const mem_id = req.user.mem_id;
        const allRequests = await prisma.issuance.findMany({
            where:{issuance_member:mem_id},
            select:{
                issuance_id:true,
                book_id:true,
                issuance_date:true,
                issuance_member:true,
                issued_by:true,
                target_return_date:true,
                issuance_status:true
            }
        })
        res.status(200).json({allRequests})
    } catch (error) {
        res.status(500).json({error:"Internal server error"})
    }
})

router.get("/admin/borrow/all",adminToken, async(req,res)=>{
    try {
        const allRequests = await prisma.issuance.findMany({
            select:{
                issuance_id:true,
                book_id:true,
                issuance_member:true,
                issuance_status:true
            }
        })
        res.status(200).json({allRequests})
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
})

router.put("/admin/borrow/update/:issuance_id", adminToken, async (req, res) => {
    try {
        const { issuance_id } = req.params;
        const { issuance_status } = req.body;

        if (!["accepted", "rejected"].includes(issuance_status)) {
            return res.status(400).json({ error: "Invalid status update. Must be 'accepted' or 'rejected'." });
        }

        const updatedRequest = await prisma.issuance.update({
            where: { issuance_id: parseInt(issuance_id) },
            data: { issuance_status },
        });

        res.status(200).json({ message: `Request ${issuance_id} updated to ${issuance_status}`, updatedRequest });
    } catch (error) {
        console.error("Error updating issuance status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/borrow/pending", verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const pendingReturns = await prisma.issuance.findMany({
            where: {
                issuance_status: "pending",
                target_return_date: {
                    lte: new Date(today + "T23:59:59.999Z"),
                },
            },
            select: {
                issuance_id: true,
                issuance_date: true,
                book_id: true,
                issuance_member: true,
                target_return_date: true,
                members: {
                    select: {
                        mem_name: true,
                        mem_email: true,
                    },
                },
            },
        });

        res.status(200).json({ pendingReturns });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});



export default router;