import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import prisma from '../prismaClient.js';
import verifyToken from "../middlewares/authMiddleware.js";
import { logMessage, logError } from '../utils/logger.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        logMessage("info", "/register Route", "Registration attempted");

        const { mem_name, mem_phone, mem_email, mem_password } = req.body;

        if (!mem_name || !mem_phone || !mem_email || !mem_password) {
            logMessage("warn", "/register Route", "Missing fields in request");
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingMember = await prisma.member.findUnique({
            where: { mem_email }
        });

        if (existingMember) {
            logMessage("warn", "/register Route", "Member already exists");
            return res.status(400).json({ error: "Member already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(mem_password, saltRounds);

        const newMember = await prisma.member.create({
            data: {
                mem_name,
                mem_phone,
                mem_email,
                mem_password: hashedPassword 
            }
        });

        const token = jwt.sign(
            { mem_id: newMember.mem_id, mem_email: newMember.mem_email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        logMessage("info", "/register Route", "New member registered successfully");
        res.status(201).json({ message: "Member registered successfully", token });

    } catch (error) {
        logError("/register Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/check', async (req, res) => {
    logMessage("info", "/check Route", "Login attempt started");

    try {
        const { mem_email, mem_password } = req.body;

        const adminUser = await prisma.member.findUnique({
            where: { mem_email }
        });

        if (adminUser && adminUser.mem_email === process.env.SUPER_USER_EMAIL && mem_password === process.env.SU_PASSWORD) {
            const token = jwt.sign(
                { mem_id: adminUser.mem_id, mem_email: adminUser.mem_email, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            logMessage("info", "/check Route", "Admin logged in successfully");
            return res.status(200).json({ message: "Admin Logged in", token, role: "admin", mem_id: adminUser.mem_id });
        }

        const checkUser = await prisma.member.findUnique({
            where: { mem_email }
        });

        if (!checkUser) {
            logMessage("warn", "/check Route", "User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(mem_password, checkUser.mem_password);

        if (!isPasswordValid) {
            logMessage("warn", "/check Route", "Invalid credentials");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { mem_id: checkUser.mem_id, mem_email: checkUser.mem_email, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        logMessage("info", "/check Route", "User logged in successfully");
        return res.status(200).json({ message: "User Logged in", token, role: "user", mem_id: checkUser.mem_id });

    } catch (error) {
        logError("/check Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/membership', verifyToken, async (req, res) => {
    try {
        logMessage("info", "/membership Route", "Membership creation initiated");

        const member_id = req.user.mem_id;
        const { status } = req.body;

        const existingMember = await prisma.member.findUnique({
            where: { mem_id: member_id },
        });

        if (!existingMember) {
            logMessage("warn", "/membership Route", "Member not found");
            return res.status(404).json({ error: "Member not found" });
        }

        const newMembership = await prisma.membership.create({
            data: {
                member: { connect: { mem_id: member_id } }, 
                status,
            },
        });

        logMessage("info", "/membership Route", "Membership created successfully");
        res.status(201).json({ message: "Membership created", data: newMembership });
    } catch (error) {
        logError("/membership Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/status', verifyToken, async (req, res) => {
    try {
        logMessage("info", "/status Route", "Fetching membership status");

        const member_id = req.user.mem_id;
        const memberships = await prisma.membership.findMany({
            where: { member_id },
            select: { status: true }
        });

        res.status(200).json({ memberships });
    } catch (error) {
        logError("/status Route", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
