import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import prisma from '../prismaClient.js';
import { logMessage, logError } from '../utils/logger.js';

const router = express.Router();

router.get("/never-borrow", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/never-borrow Route", "Fetching books never borrowed");

        const neverborrow = await prisma.$queryRaw`
            SELECT b.book_id, b.book_name, b.book_publisher 
            FROM "Book" b 
            LEFT JOIN "Issuance" i ON b.book_id = i.book_id 
            WHERE i.book_id IS NULL;
        `;

        res.status(200).json({ neverborrow });
    } catch (error) {
        logError("/never-borrow Route", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

router.get("/outstanding-books", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/outstanding-books Route", "Fetching outstanding books");

        const outstandingBooks = await prisma.$queryRaw`
            SELECT 
                m.mem_name, 
                b.book_name, 
                i.issuance_date, 
                i.target_return_date, 
                b.book_publisher
            FROM "Issuance" i
            JOIN "Book" b ON i.book_id = b.book_id
            JOIN "Member" m ON i.issuance_member = m.mem_id
            WHERE i.issuance_status = 'accepted'
            AND i.target_return_date < NOW();  
        `;

        res.status(200).json({ outstandingBooks });
    } catch (error) {
        logError("/outstanding-books Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/top-borrow", verifyToken, async (req, res) => {
    try {
        logMessage("info", "/top-borrow Route", "Fetching top borrowed books");

        const topBorrowRaw = await prisma.$queryRaw`
            SELECT 
                b.book_name, 
                COUNT(i.book_id) AS borrow_time, 
                COUNT(DISTINCT i.issuance_member) AS member_borrow 
            FROM "Book" b 
            LEFT JOIN "Issuance" i ON b.book_id = i.book_id 
            GROUP BY b.book_name 
            ORDER BY borrow_time DESC 
            LIMIT 10;
        `;

        const topBorrow = topBorrowRaw.map((book) => ({
            book_name: book.book_name,
            borrow_time: Number(book.borrow_time),
            member_borrow: Number(book.member_borrow),
        }));

        res.status(200).json({ topBorrow });
    } catch (error) {
        logError("/top-borrow Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
