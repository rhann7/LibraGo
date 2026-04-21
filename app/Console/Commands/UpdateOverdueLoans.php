<?php

namespace App\Console\Commands;

use App\Models\Transactions\Loan;
use Illuminate\Console\Command;

class UpdateOverdueLoans extends Command
{
    protected $signature = 'loans:update-overdue';
    protected $description = 'Mark active loans as overdue if due date has passed';

    public function handle()
    {
        $count = Loan::where('status', 'active')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue']);

        $this->info("Marked {$count} loans as overdue.");
    }
}