import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

router.get('/schema', async (req, res) => {
    try {
        const tables = await prisma.$queryRawUnsafe<any[]>(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

        const grouped = tables.reduce((acc, row) => {
            if (!acc[row.table_name]) acc[row.table_name] = [];
            acc[row.table_name].push({ column: row.column_name, type: row.data_type });
            return acc;
        }, {} as Record<string, { column: string; type: string }[]>);

        res.json(grouped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch schema' });
    }
});

export default router;
