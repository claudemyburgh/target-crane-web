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
            font-size: 10px;
            line-height: 1.3;
            color: #1a1a1a;
        }
        .header {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e5e5;
        }
        .header h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 3px;
        }
        .header .date-range {
            font-size: 12px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #f5f5f5;
            padding: 6px 4px;
            text-align: center;
            font-weight: 600;
            border: 1px solid #e5e5e5;
            font-size: 9px;
        }
        th:first-child {
            text-align: left;
            background-color: #e5e5e5;
        }
        td {
            padding: 4px;
            border: 1px solid #e5e5e5;
            text-align: center;
        }
        td:first-child {
            text-align: left;
            font-weight: 600;
            background-color: #fafafa;
        }
        .status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }
        .status.loaded {
            background-color: #dcfce7;
            color: #16a34a;
        }
        .status.empty {
            background-color: #ffedd5;
            color: #ea580c;
        }
        .status.no-data {
            background-color: #f5f5f5;
            color: #ccc;
        }
        .status-icon {
            width: 12px;
            height: 12px;
        }
        .summary-row td {
            background-color: #f0f9ff;
            font-weight: 600;
        }
        .summary-row td:first-child {
            background-color: #e0f2fe;
        }
        .loaded-count {
            color: #16a34a;
        }
        .empty-count {
            color: #ea580c;
        }
        .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 9px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="date-range">{{ $dateRange }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fleet #</th>
                <th>Reg</th>
                @foreach($dateHeaders as $header)
                <th>
                    <div>{{ $header['day'] }}</div>
                    <div>{{ $header['dayNum'] }}</div>
                </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($trailers as $fleetNumber => $trailer)
            <tr>
                <td>{{ $fleetNumber }}</td>
                <td>{{ $trailer['registration_number'] }}</td>
                @foreach($dateHeaders as $header)
                @php
                $dateKey = $header['date'];
                $data = $trailer['dates'][$dateKey] ?? null;
                @endphp
                <td>
                    @if($data && $data['loaded'] && $data['loaded'] !== 'Empty')
                    <span class="status loaded">
                        <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                    @else
                    <span class="status no-data">-</span>
                    @endif
                </td>
                @endforeach
            </tr>
            @endforeach
            <tr class="summary-row">
                <td colspan="2"><strong>Total Loaded / Empty</strong></td>
                @foreach($dateHeaders as $header)
                @php
                $dateKey = $header['date'];
                $s = $summary[$dateKey] ?? ['loaded' => 0, 'empty' => 0];
                @endphp
                <td>
                    <span class="loaded-count">{{ $s['loaded'] }}</span>
                    /
                    <span class="empty-count">{{ $s['empty'] }}</span>
                </td>
                @endforeach
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <div>Generated on {{ now()->format('d M Y \a\t H:i') }}</div>
    </div>
</body>
</html>
