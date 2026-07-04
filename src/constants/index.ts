export const WEIGHTCLASSES = ['43','47','52','57','63','69','76','84','84+',
    '53','59','66','74','83','93','105','120','120+'
] as const;
export const WEIGHTCLASSES_OPTIONS = WEIGHTCLASSES.map((wgtclss) => ({
    value: wgtclss,
    label: `${wgtclss} Kg`,
}))

export const AGECLASSES = ['Sub Junior','Junior', 'Open',
    'Masters 1','Masters 2','Masters 3','Masters 4'
] as const;

export const AGECLASSES_OPTIONS = AGECLASSES.map((ageclss) => ({
    value: ageclss,
    label: ageclss,
}))