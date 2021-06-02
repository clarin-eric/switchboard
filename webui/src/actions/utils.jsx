const URL_REGEX = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);

export function isUrl(x) {
    return x.match(URL_REGEX);
}

export function image(src) {
    return window.APP_CONTEXT_PATH + '/images/' + src;
}


export function humanSize(size) {
    const K = 1024;
    if (size < K) {
        return `${size} bytes`;
    } else if (size < K * K) {
        return `${(size/K).toFixed(2)} KiB`;
    } else if (size < K * K * K) {
        return `${(size/K/K).toFixed(2)} MiB`;
    } else {
        return `${(size/K/K/K).toFixed(2)} GiB`;
    }
}

export function processMediatype(mediatype) {
    if (mediatype) {
        return {
            label: mediatype,
            value: mediatype,
        }
    }
    return null;
}

export function isDictionaryResource(res) {
    if (res.selection && res.content && res.fileLength < 100 && res.profile.mediaType === 'text/plain') {
        const words = res.content.trim().split(/\s+/);
        return words.length <= 3;
    }
    return false;
}

export function isDictionaryTool(tool) {
    return tool && tool.task === "Lookup Tools";
}

export function isNotDictionaryTool(tool) {
    return !isDictionaryTool(tool);
}

const TEXT_TYPES = new Set([
    "model/prs.ply",
    "model/prs.obj",
]);

export function isTextProfile(mediatype) {
    return mediatype.startsWith("text") || TEXT_TYPES.has(mediatype);
}

const ARCHIVE_TYPES = new Set([
    "application/zip",
    "application/x-tar",
]);

const COMPRESSED_TYPES = new Set([
    "application/gzip",
]);

export function isArchiveProfile(mediatype) {
    return ARCHIVE_TYPES.has(mediatype);
}

export function isViewableProfile(mediatype) {
    return isTextProfile(mediatype) || isArchiveProfile(mediatype);
}

const LANG_MAP = {}; // will be initialized by addLanguageMapping

export function addLanguageMapping(codeAndName) {
    LANG_MAP[codeAndName[0]] = codeAndName[1];
}

export function processLanguage(languageCode) {
    const name = LANG_MAP[languageCode];
    if (name) {
        return {
            label: name,
            value: languageCode,
        }
    }
    return null;
}

export const iso_639_3_to_639_1 = function(lang3) {
    return ISO_639_3_TO_639_1_MAP[lang3];
}

// no ISO 639-1 code for Ancient Greek (grc), Coptic (cop), Gothic (got)
const ISO_639_3_TO_639_1_MAP = {
    "generic" : "generic",
    "afr": "af",
    "ara": "ar",
    "bel": "be",
    "bos": "bs",
    "bul": "bg",
    "cat": "ca",
    "ces": "cs",
    "chu": "cu",
    "cop": "xx",
    "cym": "cy",
    "dan": "da",
    "deu": "de",
    "ell": "el",
    "eng": "en",
    "epo": "eo",
    "est": "et",
    "eus": "eu",
    "fas": "fa",
    "fin": "fi",
    "fra": "fr",
    "fry": "fy",
    "gle": "ga",
    "glg": "gl",
    "got": "xx",
    "grc": "xx",
    "heb": "he",
    "hin": "hi",
    "hrv": "hr",
    "hun": "hu",
    "hye": "hy",
    "ind": "id",
    "isl": "is",
    "ita": "it",
    "jpn": "ja",
    "kan": "kn",
    "kat": "ka",
    "kaz": "kk",
    "kor": "ko",
    "kur": "ku",
    "lat": "la",
    "lav": "lv",
    "lit": "lt",
    "mkd": "mk",
    "mlg": "ml",
    "nld": "nl",
    "nno": "nn",
    "nob": "nb",
    "nor": "no",
    "pol": "pl",
    "por": "pt",
    "ron": "ro",
    "rus": "ru",
    "san": "sa",
    "slk": "sk",
    "slv": "sl",
    "spa": "es",
    "sqi": "sq",
    "srp": "sr",
    "swa": "sw",
    "swe": "sv",
    "tam": "ta",
    "tur": "tr",
    "uig": "ug",
    "ukr": "uk",
    "urd": "ur",
    "vie": "vi",
    "zho": "zh",
}
