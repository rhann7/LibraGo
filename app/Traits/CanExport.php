<?php
namespace App\Traits;

use App\Exports\GeneralExport;
use Maatwebsite\Excel\Facades\Excel;

trait CanExport
{
    public function exportData($collection, $filename, $headings, $mapFunc)
    {
        return Excel::download(
            new GeneralExport($collection, $headings, $mapFunc), 
            $filename . '-' . now()->format('Y-m-d') . '.xlsx'
        );
    }
}