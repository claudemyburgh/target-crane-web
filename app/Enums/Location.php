<?php

namespace App\Enums;

enum Location: string
{
    case BOLT = 'Bolt';
    case WOODSTOCK = 'Woodstock';
    case GRAPH = 'Graph';
    case FREEDOM_WAY = 'Freedom Way';
    case SERVICE = 'Service';
    case NEPTUNE = 'Neptune';
    case YACHT_CLUB = 'Yacht Club';
    case MPT = 'MPT';
    case MAINTENANCE = 'Maintenance';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
