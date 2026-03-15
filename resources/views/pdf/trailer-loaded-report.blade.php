<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #1a1a1a;
            padding: 40px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e5e5;
        }
        .header-left h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .header-left .date-range {
            font-size: 14px;
            color: #666;
        }
        .header-right img {
            max-height: 60px;
            width: auto;
        }
        .summary {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            flex: 1;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.loaded {
            background-color: #dcfce7;
        }
        .summary-card.empty {
            background-color: #ffedd5;
        }
        .summary-card .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-card .count {
            font-size: 28px;
            font-weight: 700;
        }
        .summary-card.loaded .count {
            color: #16a34a;
        }
        .summary-card.empty .count {
            color: #ea580c;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #f5f5f5;
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e5e5;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #e5e5e5;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .status {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }
        .status.loaded {
            background-color: #dcfce7;
            color: #16a34a;
        }
        .status.empty {
            background-color: #ffedd5;
            color: #ea580c;
        }
        .status-icon {
            width: 14px;
            height: 14px;
        }
        .location {
            font-size: 10px;
            color: #999;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <img src="data:image/svg+xml;base64,{{ base64_encode(file_get_contents(public_path('images/Target-Cranes-Logo.svg'))) }}" alt="Target Cranes
            Logo" style="max-height: 160px; width: auto;" />
            <h1>{{ $title }}</h1>
            <div class="date-range">{{ $dateRange }}</div>
        </div>

    </div>

    <div class="summary">
        <div class="summary-card loaded">
            <div class="label">Loaded</div>
            <div class="count">{{ $loadedCount }}</div>
        </div>
        <div class="summary-card empty">
            <div class="label">Empty</div>
            <div class="count">{{ $emptyCount }}</div>
        </div>
    </div>

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
                <td><strong>{{ $trailer['fleet_number'] }}</strong></td>
                <td>{{ $trailer['registration_number'] }}</td>
                <td>
                    @if($trailer['loaded'] && $trailer['loaded'] !== 'Empty')
                    <span class="status loaded">
                        <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {{ $trailer['loaded'] }}
                    </span>
                    @else
                    <span class="status empty">Empty</span>
                    @endif
                </td>
                <td>
                    @if($trailer['location'])
                    <span class="location">{{ $trailer['location'] }}</span>
                    @else
                    <span class="location">-</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Generated on {{ now()->format('d M Y \a\t H:i') }}
    </div>
</body>
</html>
