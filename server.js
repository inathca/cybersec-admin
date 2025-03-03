const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // ใช้ middleware เพื่ออ่าน JSON

// 📌 1️⃣ CREATE: เพิ่ม User ใหม่
app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await prisma.user.create({
            data: { username, password }
        });

        res.json({ message: "User added successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// 📌 2️⃣ READ: ดึง User ทั้งหมด
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// 📌 3️⃣ READ: ดึง User ตาม ID
app.get('/user', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in request body" });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// 📌 4️⃣ UPDATE: แก้ไขข้อมูล User (ใช้ req.body)
app.put('/user', async (req, res) => {
    try {
        const { id, username, password } = req.body;

        if (!id || !username || !password) {
            return res.status(400).json({ message: "ID, username, and password are required in request body" });
        }

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { username, password }
        });

        res.json({ message: "User updated successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// 📌 5️⃣ DELETE: ลบ User (ใช้ req.body)
app.delete('/user', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in request body" });
        }

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// 📌 เปิดเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
