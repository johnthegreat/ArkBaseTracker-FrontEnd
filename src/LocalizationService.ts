// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import enUS from "./data/lang/en-US.json";

export interface LocaleKeyValuePair {
	key: string;
	value: string;
}

export class LocalizationService {
	availableLocales = {};

	registerLocale(locale: string, data: LocaleKeyValuePair[]) {
		// @ts-ignore
		this.availableLocales[locale] = data;
	}

	getValue(locale: string, token: string, optionalDefault?: string) {
		// @ts-ignore
		const useLocale: LocaleKeyValuePair[] = this.availableLocales[locale];
		if (!useLocale) {
			return optionalDefault;
		}

		const entries = useLocale.filter(function(entry) {
			return entry.key === token;
		});
		if (entries.length === 0) {
			return optionalDefault;
		}
		return (entries[0] as LocaleKeyValuePair).value;
	}
}

const localizationService = new LocalizationService();
localizationService.registerLocale("en-US", enUS as LocaleKeyValuePair[]);
export default localizationService;