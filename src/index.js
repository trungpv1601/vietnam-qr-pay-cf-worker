import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { QRPay, BanksObject } from 'vietnam-qr-pay';
const qr = require("qr-image");

const app = new Hono();

// MBBank
const BANK_NUMBER = '2700';
// https://github.com/xuannghia/vietnam-qr-pay/blob/b48ad59882acc4cb10aa548636f05f811d30533c/src/constants/bank-key.ts
const BANK_BIN = BanksObject.mbbank.bin;

app.use(cors({
    origin: '*',
}));

app.get('/', async (c) => {
    try {
        const amount = c.req.query('amount', '100000');
        const purpose = c.req.query('purpose', 'Ung Ho NCHCCCL');

        if (!amount || !purpose) {
            return c.json({
                success: false,
                message: 'Please provide both amount and purpose',
            }, 400);
        }

        const qrPay = QRPay.initVietQR({
            bankBin: BANK_BIN,
            bankNumber: BANK_NUMBER,
            amount: amount,
            purpose: purpose,
        });
        const content = qrPay.build();

        c.header('Content-Type', 'image/png');

        const qr_png = qr.imageSync(content);

        return c.body(qr_png);
    } catch (error) {
        return c.json({
            success: false,
            message: error?.message || 'Something went wrong! Please try again.'
        });
    }
});

export default app;
