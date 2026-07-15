export const WEIGHTCLASSES = ['43','47','52','57','63','69','76','84','84+',
    '53','59','66','74','83','93','105','120','120+'
] as const;
export const WEIGHTCLASSES_OPTIONS = WEIGHTCLASSES.map((wgtclss) => ({
    value: wgtclss,
    label: `${wgtclss} Kg`,
}))

export const AGECLASSES = ['SJR','JR', 'O',
    'M1','M2','M3','M4'
] as const;

export const AGECLASSES_OPTIONS = AGECLASSES.map((ageclss) => ({
    value: ageclss,
    label: ageclss,
}))

export const TIMEZONES = [
    // Canada
    { value: 'America/Vancouver',       label: 'PT — Pacific Time (Vancouver, BC)' },
    { value: 'America/Edmonton',        label: 'MT — Mountain Time (Edmonton, AB)' },
    { value: 'America/Regina',          label: 'CT — Central Time No DST (Regina, SK)' },
    { value: 'America/Winnipeg',        label: 'CT — Central Time (Winnipeg, MB)' },
    { value: 'America/Toronto',         label: 'ET — Eastern Time (Toronto, ON)' },
    { value: 'America/Halifax',         label: 'AT — Atlantic Time (Halifax, NS)' },
    { value: 'America/St_Johns',        label: 'NT — Newfoundland Time (St. Johns, NL)' },

    // USA
    { value: 'America/Los_Angeles',     label: 'PST/PDT — Pacific Time (Los Angeles, CA)' },
    { value: 'America/Denver',          label: 'MST/MDT — Mountain Time (Denver, CO)' },
    { value: 'America/Phoenix',         label: 'MST — Mountain Time No DST (Phoenix, AZ)' },
    { value: 'America/Chicago',         label: 'CST/CDT — Central Time (Chicago, IL)' },
    { value: 'America/New_York',        label: 'EST/EDT — Eastern Time (New York, NY)' },
    { value: 'America/Anchorage',       label: 'AKST/AKDT — Alaska Time (Anchorage, AK)' },
    { value: 'Pacific/Honolulu',        label: 'HST — Hawaii Time (Honolulu, HI)' },

    // UK & Ireland
    { value: 'Europe/London',           label: 'GMT/BST — London, UK' },
    { value: 'Europe/Dublin',           label: 'GMT/IST — Dublin, Ireland' },

    // Europe
    { value: 'Europe/Paris',            label: 'CET/CEST — Central European Time (Paris, FR)' },
    { value: 'Europe/Berlin',           label: 'CET/CEST — Central European Time (Berlin, DE)' },
    { value: 'Europe/Rome',             label: 'CET/CEST — Central European Time (Rome, IT)' },
    { value: 'Europe/Madrid',           label: 'CET/CEST — Central European Time (Madrid, ES)' },
    { value: 'Europe/Amsterdam',        label: 'CET/CEST — Central European Time (Amsterdam, NL)' },
    { value: 'Europe/Stockholm',        label: 'CET/CEST — Central European Time (Stockholm, SE)' },
    { value: 'Europe/Helsinki',         label: 'EET/EEST — Eastern European Time (Helsinki, FI)' },
    { value: 'Europe/Athens',           label: 'EET/EEST — Eastern European Time (Athens, GR)' },
    { value: 'Europe/Moscow',           label: 'MSK — Moscow Time (Moscow, RU)' },

    // Middle East
    { value: 'Asia/Dubai',              label: 'GST — Gulf Standard Time (Dubai, UAE)' },
    { value: 'Asia/Riyadh',             label: 'AST — Arabia Standard Time (Riyadh, SA)' },
    { value: 'Asia/Tehran',             label: 'IRST — Iran Time (Tehran, IR)' },

    // Asia
    { value: 'Asia/Karachi',            label: 'PKT — Pakistan Time (Karachi, PK)' },
    { value: 'Asia/Kolkata',            label: 'IST — India Standard Time (Mumbai, IN)' },
    { value: 'Asia/Dhaka',              label: 'BST — Bangladesh Time (Dhaka, BD)' },
    { value: 'Asia/Bangkok',            label: 'ICT — Indochina Time (Bangkok, TH)' },
    { value: 'Asia/Singapore',          label: 'SGT — Singapore Time (Singapore)' },
    { value: 'Asia/Shanghai',           label: 'CST — China Standard Time (Shanghai, CN)' },
    { value: 'Asia/Tokyo',              label: 'JST — Japan Standard Time (Tokyo, JP)' },
    { value: 'Asia/Seoul',              label: 'KST — Korea Standard Time (Seoul, KR)' },

    // Australia & Pacific
    { value: 'Australia/Perth',         label: 'AWST — Western Time (Perth, AU)' },
    { value: 'Australia/Adelaide',      label: 'ACST/ACDT — Central Time (Adelaide, AU)' },
    { value: 'Australia/Sydney',        label: 'AEST/AEDT — Eastern Time (Sydney, AU)' },
    { value: 'Australia/Melbourne',     label: 'AEST/AEDT — Eastern Time (Melbourne, AU)' },
    { value: 'Pacific/Auckland',        label: 'NZST/NZDT — New Zealand Time (Auckland, NZ)' },

    // Africa
    { value: 'Africa/Cairo',            label: 'EET — Eastern European Time (Cairo, EG)' },
    { value: 'Africa/Johannesburg',     label: 'SAST — South Africa Time (Johannesburg, ZA)' },
    { value: 'Africa/Lagos',            label: 'WAT — West Africa Time (Lagos, NG)' },

    // South America
    { value: 'America/Sao_Paulo',       label: 'BRT/BRST — Brazil Time (São Paulo, BR)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'ART — Argentina Time (Buenos Aires, AR)' },
    { value: 'America/Santiago',        label: 'CLT/CLST — Chile Time (Santiago, CL)' },
    { value: 'America/Bogota',          label: 'COT — Colombia Time (Bogotá, CO)' },
    { value: 'America/Lima',            label: 'PET — Peru Time (Lima, PE)' },
    { value: 'America/Mexico_City',     label: 'CST/CDT — Central Time (Mexico City, MX)' },
] as const;

export const TIMEZONE_OPTIONS = TIMEZONES.map(tz => ({
    value: tz.value,
    label: tz.label,
}));

export type Timezone = typeof TIMEZONES[number]['value'];