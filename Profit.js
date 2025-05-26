const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function solveMaxProfit(n) {
    const b = [
        { code: "T", time: 5, rate: 1500 },
        { code: "P", time: 4, rate: 1000 },
        { code: "C", time: 10, rate: 3000 }
    ];

    const dp = Array(n + 1).fill().map(() => ({ earnings: -1, paths: [] }));
    dp[0] = { earnings: 0, paths: [[]] };

    for (let t = 0; t <= n; t++) {
        if (dp[t].earnings === -1) continue;
        for (let a of b) {
            const f = t + a.time;
            if (f <= n) {
                const p = (n - f) * a.rate;
                const total = dp[t].earnings + p;
                if (total > dp[f].earnings) {
                    dp[f].earnings = total;
                    dp[f].paths = dp[t].paths.map(x => [...x, a.code]);
                } else if (total === dp[f].earnings) {
                    dp[f].paths.push(...dp[t].paths.map(x => [...x, a.code]));
                }
            }
        }
    }

    let max = -1;
    for (let t = 0; t <= n; t++) {
        if (dp[t].earnings > max) max = dp[t].earnings;
    }

    let finalPaths = [];
    let shorter = false;
    for (let t = 0; t < n; t++) {
        if (dp[t].earnings === max && dp[t].paths.length > 0) {
            shorter = true;
            finalPaths.push(...dp[t].paths);
        }
    }

    if (!shorter && dp[n].earnings === max && dp[n].paths.length > 0) {
        finalPaths.push(...dp[n].paths);
    }

    if (finalPaths.length === 0 && max === 0) {
        finalPaths.push([]);
    }

    const solutions = [...new Set(finalPaths.map(path => {
        const c = { T: 0, P: 0, C: 0 };
        path.forEach(k => c[k]++);
        return `T: ${c.T} P: ${c.P} C: ${c.C}`;
    }))];

    return { earnings: max, solutions };
}

(function ask() {
    rl.question('\nEnter the time unit (or type "exit" to quit): ', x => {
        if (x.toLowerCase() === 'exit') return rl.close();
        const n = parseInt(x);
        if (isNaN(n) || n < 0) {
            console.log('Invalid input. Please enter a non-negative number.');
            return ask();
        }
        const r = solveMaxProfit(n);
        console.log(`\nTime Unit: ${n}`);
        console.log(`Earnings: $${r.earnings}`);
        console.log('Solutions:');
        r.solutions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
        ask();
    });
})();
