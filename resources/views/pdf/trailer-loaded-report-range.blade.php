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
            padding: 20px 40px;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e5e5;
        }

        .header-right {
            text-align: right;
        }

        .header-right h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 5px;
            color: #1a1a1a;
        }

        .header-right .date-range {
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table.data-table th {
            background-color: #f5f5f5;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e5e5;
        }

        table.data-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e5e5;
        }

        table.data-table tr:last-child td {
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

        .day-separator td {
            border-bottom: 2px dashed #cccccc !important;
            height: 20px;
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
        <table style="width: 100%; border: none; margin: 0; padding: 0;">
            <tr>
                <td style="border: none; padding: 0; text-align: left; vertical-align: middle;">
                    <div class="header-left">
                        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/file-logo.png'))) }}"
                            alt="Target Cranes Logo" style="max-height: 60px; width: auto;" />
                    </div>
                </td>
                <td style="border: none; padding: 0; text-align: right; vertical-align: middle;">
                    <div class="header-right">
                        <h1>{{ $title }}</h1>
                        <div class="date-range">{{ $dateRange }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Fleet #</th>
                <th>Status</th>
                <th>Location</th>
                <th>Comment</th>
            </tr>
        </thead>
        <tbody>
            @foreach($daysData as $index => $day)
                @foreach($day['trailers'] as $trailer)
                    <tr>
                        <td>{{ $day['dateString'] }}</td>
                        <td><strong>{{ $trailer['fleet_number'] }}</strong></td>
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
                        <td>
                            @if($trailer['comment'])
                                <span class="location">{{ $trailer['comment'] }}</span>
                            @else
                                <span class="location">-</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
                @if(!$loop->last)
                    <tr class="day-separator">
                        <td colspan="5"></td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Generated on {{ now()->format('d M Y \a\t H:i') }}
    </div>
</body>

</html>
