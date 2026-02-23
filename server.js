const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// The Pi API Secret Key (Keep this secret in Render Environment Variables)
const PI_API_KEY = process.env.PI_API_KEY; 
const PI_API_URL = "https://api.minepi.com/v2";

// 1. APPROVAL ROUTE
app.post('/approve', async (req, res) => {
    const { paymentId } = req.body;
    try {
        await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        console.log(`Payment Approved: ${paymentId}`);
        res.status(200).json({ status: "approved" });
    } catch (err) {
        res.status(500).json({ error: "Approval failed" });
    }
});

// 2. COMPLETION ROUTE
app.post('/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    try {
        await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        
        /* SUCCESS LOGIC: 
           Here is where you record the transaction for the vendor.
           You take your maintenance fee % from the total here.
        */
        
        console.log(`Payment Completed: ${paymentId} | TXID: ${txid}`);
        res.status(200).json({ status: "completed" });
    } catch (err) {
        res.status(500).json({ error: "Completion failed" });
    }
});

// 3. INCOMPLETE PAYMENT HANDLER
app.post('/incomplete', async (req, res) => {
    const { payment } = req.body;
    // Logic to clear pending payments in your database
    res.status(200).json({ status: "checked" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Supermarket Backend running on port ${PORT}`));
