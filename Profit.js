const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function solveMaxProfit(n) {
    const b = [{ code: "T", time: 5, rate: 1500 }, { code: "P", time: 4, rate: 1000 }, { code: "C", time: 10, rate: 3000 }];
    const dp = Array(n + 1).fill().map(() => ({ earnings: 0, paths: [[]] }));

    for (let t = 0; t <= n; t++) {
        for (let a of b) {
            const f = t + a.time;
            if (f <= n) {
                const p = (n - f) * a.rate, total = dp[t].earnings + p;
                if (total > dp[f].earnings) {
                    dp[f].earnings = total;
                    dp[f].paths = dp[t].paths.map(x => [...x, a.code]);
                } else if (total === dp[f].earnings) {
                    dp[f].paths.push(...dp[t].paths.map(x => [...x, a.code]));
                }
            }
        }
    }

    let max = Math.max(...dp.map(x => x.earnings));
    let allPaths = dp.filter(x => x.earnings === max).flatMap(x => x.paths);

    const solutions = [...new Set(allPaths.map(path => {
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
        if (isNaN(n) || n < 0) return ask();
        const r = solveMaxProfit(n);
        console.log(`\nTime Unit: ${n}`);
        console.log(`Earnings: $${r.earnings}`);
        r.solutions.forEach((s, i) => console.log(`Solution ${i + 1}: ${s}`));
        ask();
    });
})();
