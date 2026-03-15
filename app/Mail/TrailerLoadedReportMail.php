<?php

namespace App\Mail;

use App\Models\Trailer;
use App\Models\TrailerLoadedReport;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TrailerLoadedReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public TrailerLoadedReport $report,
        public string $pdfContent,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Trailer Loaded Report - '.$this->report->date->format('d M Y'),
        );
    }

    public function content(): Content
    {
        $trailers = Trailer::orderBy('fleet_number')->get();

        $loadsByFleet = [];
        foreach ($this->report->loads as $load) {
            $loadsByFleet[$load['fleet_number']] = $load;
        }

        $reportData = $trailers->map(function ($trailer) use ($loadsByFleet) {
            $load = $loadsByFleet[$trailer->fleet_number] ?? null;

            return [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'status' => $load['loaded'] ?: 'Empty',
                'location' => $load['location'] ?? '',
            ];
        });

        return new Content(
            view: 'mail.trailer-loaded-report',
            with: [
                'trailers' => $reportData,
            ],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdfContent, 'trailer-report-'.$this->report->date->format('Y-m-d').'.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
