import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import verifyToken from '../middlewares/authMiddleware.js';
import adminToken from '../middlewares/adminAuthMiddleware.js';
import { logMessage, logError } from '../utils/logger.js';

const router = express.Router();

router.get('/books', verifyToken, async (req, res) => {
    try {
        logMessage("info", "/books Route", "Fetching all books");

        const allBook = await prisma.book.findMany({
            select: {
                book_id: true,
                book_name: true,
                book_publisher: true
            }
        });

        res.status(200).json(allBook);
    } catch (error) {
        logError("/books Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/borrow", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/borrow Route", "Book borrow request initiated");

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

        logMessage("info", "/borrow Route", `Book borrow request created (Book ID: ${book_id})`);
        res.status(201).json({ message: "Successfully requested book", newBorrow });
    } catch (error) {
        logError("/borrow Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/borrow/status", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/borrow/status Route", "Fetching borrow status");

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
        logError("/borrow/status Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/borrow/details', verifyToken, async (req, res) => {
    try {
        logMessage("info", "/borrow/details Route", "Fetching user borrow details");

        const mem_id = req.user.mem_id;
        const allRequests = await prisma.issuance.findMany({
            where: { issuance_member: mem_id },
            select: {
                issuance_id: true,
                book_id: true,
                issuance_date: true,
                issuance_member: true,
                issued_by: true,
                target_return_date: true,
                issuance_status: true
            }
        });

        res.status(200).json({ allRequests });
    } catch (error) {
        logError("/borrow/details Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/admin/borrow/all", adminToken, async (req, res) => {
    try {
        logMessage("info", "/admin/borrow/all Route", "Admin fetching all borrow requests");

        const allRequests = await prisma.issuance.findMany({
            select: {
                issuance_id: true,
                book_id: true,
                issuance_member: true,
                issuance_status: true
            }
        });

        res.status(200).json({ allRequests });
    } catch (error) {
        logError("/admin/borrow/all Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/admin/borrow/update/:issuance_id", adminToken, async (req, res) => {
    try {
        logMessage("info", "/admin/borrow/update Route", `Updating issuance request ID: ${req.params.issuance_id}`);

        const { issuance_id } = req.params;
        const { issuance_status } = req.body;

        if (!["accepted", "rejected"].includes(issuance_status)) {
            logMessage("warn", "/admin/borrow/update Route", "Invalid status update attempted");
            return res.status(400).json({ error: "Invalid status update. Must be 'accepted' or 'rejected'." });
        }

        const updatedRequest = await prisma.issuance.update({
            where: { issuance_id: parseInt(issuance_id) },
            data: { issuance_status },
        });

        logMessage("info", "/admin/borrow/update Route", `Issuance request ID: ${issuance_id} updated to ${issuance_status}`);
        res.status(200).json({ message: `Request ${issuance_id} updated to ${issuance_status}`, updatedRequest });
    } catch (error) {
        logError("/admin/borrow/update Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/borrow/pending", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/borrow/pending Route", "Fetching pending borrow requests");

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
        logError("/borrow/pending Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
