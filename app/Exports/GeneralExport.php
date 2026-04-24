<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class GeneralExport implements FromCollection, WithHeadings, WithMapping
{
    protected $collection, $headings, $mapFunc;

    public function __construct($collection, array $headings, callable $mapFunc)
    {
        $this->collection = $collection;
        $this->headings = $headings;
        $this->mapFunc = $mapFunc;
    }

    public function collection() { return $this->collection; }
    public function headings(): array { return $this->headings; }
    public function map($row): array { return ($this->mapFunc)($row); }
}