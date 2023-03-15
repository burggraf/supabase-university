import adapter from '@sveltejs/adapter-static'
//import adapter from '@sveltejs/adapter-vercel'
import preprocess from 'svelte-preprocess';

const dev = "production" === "development";

const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
		alias: {
			'$ionic': 'src/lib/ionic',
			'$ionpage': 'src/lib/ionic/svelte/components/IonPage.svelte',
			'$interfaces': 'src/interfaces',
			'$services': 'src/services',
			'$stores': 'src/stores',
			'$components': 'src/components',
			'$localdata': 'src/localdata',
		}

	}
};

export default config;
