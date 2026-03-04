const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

app.post('/api/generate', (req, res) => {
    const { prompt } = req.body;
    console.log(`\n[Request] New prompt received: "${prompt}"`);
    
    // Running the Claude command
    const claude = spawn('claude', ['-p', prompt]);
    
    // Closing the Input channel.
    // This lets Claude know that no more input is coming, so it should finish the process.
    claude.stdin.end();

    let outputData = '';

    claude.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    claude.stderr.on('data', (data) => {
        console.log(`[Claude Error Log]: ${data.toString()}`);
    });

    claude.on('close', (code) => {
        console.log(`[Success] Claude process closed (Code: ${code})`);
        
        // Sending the response back
        res.json({ output: outputData.trim() });
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Claude API Server is ready and listening on port 3000');
});