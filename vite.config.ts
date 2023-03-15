import type { UserConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js';


import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';

/*** get info from package.json ***/
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const config: UserConfig = {
	plugins: [
		VitePWA(pwaConfiguration),
		sveltekit()
	],
	define: {
		'__APP_VERSION__': JSON.stringify(pkg.version),
		'__APP_NAME__': JSON.stringify(pkg.name),
		'__APP_HOMEPAGE__': JSON.stringify(pkg.homepage),
		'__APP_DESCRIPTION__': JSON.stringify(pkg.description),
		'__APP_MENU_TITLE__': JSON.stringify(pkg.menu_title),
		'__APP_MENU_SUBTITLE__': JSON.stringify(pkg.menu_subtitle),
		'__APP_PROFILE_TABLE__': JSON.stringify(pkg.profileTable),
		'__APP_PROFILE_KEY__': JSON.stringify(pkg.profileKey),
		'__APP_THEME_COLOR__': JSON.stringify(pkg.theme_color),
		'__APP_BACKGROUND_COLOR__': JSON.stringify(pkg.background_color),	  
	}	
};

export default config;
