<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trailer Loaded Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .content {
            margin-bottom: 20px;
        }
        .table-container {
            margin: 20px 0;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .status-loaded {
            color: #16a34a;
            font-weight: 500;
        }
        .status-empty {
            color: #ea580c;
            font-weight: 500;
        }
        .footer {
            padding-top: 15px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Trailer Loaded Report</h1>
        <p>Date: {{ $report->date->format('d M Y') }}</p>
    </div>

    <div class="content">
        <p>Please find attached the trailer loaded report for {{ $report->date->format('d M Y') }}.</p>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Fleet #</th>
                    <th>Registration</th>
                    <th>Status</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                @foreach($trailers as $trailer)
                <tr>
                    <td>{{ $trailer['fleet_number'] }}</td>
                    <td>{{ $trailer['registration_number'] }}</td>
                    <td>
                        @if($trailer['status'] && $trailer['status'] !== 'Empty')
                        <span class="status-loaded">✓ {{ $trailer['status'] }}</span>
                        @else
                        <span class="status-empty">Empty</span>
                        @endif
                    </td>
                    <td>{{ $trailer['location'] ?: '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>
