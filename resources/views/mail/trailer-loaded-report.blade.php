<x-mail::message>
<x-slot:header>
<x-mail::header :url="config('app.url')">
<img src="{{ $message->embed(public_path('images/file-logo.png')) }}" class="logo" alt="Target Cranes Logo">
</x-mail::header>
</x-slot:header>

# Trailer Loaded Report

**Date:** {{ $report->date->format('d M Y') }}

Please find attached the trailer loaded report for {{ $report->date->format('d M Y') }}.

<x-mail::table>
| Fleet # | Registration | Status | Location |
| :------- | :----------- | :------ | :-------- |
@foreach($trailers as $trailer)
| {{ $trailer['fleet_number'] }} | {{ $trailer['registration_number'] }} | @if($trailer['status'] && $trailer['status'] !== 'Empty') ✓ {{ $trailer['status'] }} @else Empty @endif | {{ $trailer['location'] ?: '-' }} |
@endforeach
</x-mail::table>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
