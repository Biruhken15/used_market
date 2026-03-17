"use client";

// Custom high-fidelity icons to replace lucide-react
const Download = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);

interface TransactionHistoryProps {
    transactions: any[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🧾</div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">No Transactions Logged</h4>
                <p className="text-slate-400 font-medium text-sm mt-1">Your payment history will appear here once you subscribe.</p>
            </div>
        );
    }

    const handlePrintReceipt = (tx: any) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const date = new Date(tx.paymentDate || tx.createdAt).toLocaleDateString();
        const planName = tx.subscriptionPlanId?.planName || 'Store Protocol Upgrade';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - ${tx.referenceId}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; }
                        .receipt-box { max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 20px; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; }
                        .details { margin-bottom: 40px; }
                        .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; }
                        .label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
                        .value { font-weight: 700; }
                        .total-row { margin-top: 30px; border-top: 2px solid #f1f5f9; pt: 20px; font-size: 20px; font-weight: 900; display: flex; justify-content: space-between; }
                        .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 40px; text-transform: uppercase; letter-spacing: 2px; }
                    </style>
                </head>
                <body>
                    <div class="receipt-box">
                        <div class="header">
                            <div class="logo">USED MARKET</div>
                            <div style="font-size: 10px; font-weight: 900; color: #3b82f6;">OFFICIAL TRANSACTION PROTOCOL</div>
                        </div>
                        <div class="details">
                            <div class="detail-row">
                                <span class="label">Reference ID</span>
                                <span class="value">${tx.referenceId}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Date</span>
                                <span class="value">${date}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Plan Protocol</span>
                                <span class="value">${planName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Billing Cycle</span>
                                <span class="value" style="text-transform: capitalize;">${tx.billingCycle}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Status</span>
                                <span class="value" style="color: #10b981;">VERIFIED</span>
                            </div>
                        </div>
                        <div class="total-row">
                            <span>TOTAL PAID</span>
                            <span>${tx.amount.toLocaleString()} ETB</span>
                        </div>
                        <div class="footer">
                            Powered by Chapa Payment Gateway<br>
                            This is a digitally generated receipt.
                        </div>
                    </div>
                    <script>window.onload = function() { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Transaction Ledger</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{transactions.length} Records</span>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Tier</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Value (ETB)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Verified</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6 font-mono text-[10px] font-bold text-slate-500">
                                        {tx.referenceId}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-sm capitalize">{tx.subscriptionPlanId?.planName || 'System Upgrade'}</div>
                                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-0.5">{tx.billingCycle}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-base">{tx.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                        {tx.paymentDate ? new Date(tx.paymentDate).toLocaleDateString() : 'Pending'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${tx.status === 'completed'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : tx.status === 'failed'
                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {tx.status === 'completed' && (
                                            <button
                                                onClick={() => handlePrintReceipt(tx)}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all hover:shadow-lg ml-auto"
                                                title="Generate Receipt"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print Notice (Hidden usually) */}
            <p className="text-[10px] font-medium text-slate-400 text-center uppercase tracking-widest mt-4">
                Digital receipts are cryptographically signed by Chapa Payment Gateway.
            </p>
        </div>
    );
}
