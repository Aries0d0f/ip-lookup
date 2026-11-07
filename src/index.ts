// ─── IP Lookup Worker ────────────────────────────────────────────────────────
// curl-able IP lookup; reached only through ingress's service binding.

import { handleIPLookup } from './helpers/ip-lookup.helpers';
import { checkEasterEggs, CLI_UA } from './helpers/user-agent.helpers';

export default {
	async fetch(request) {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS'
				}
			});
		}

		const url = new URL(request.url);
		const userAgent = request.headers.get('User-Agent') ?? 'Unknown';
		const clientIP = request.headers.get('CF-Connecting-IP');

		return handleIPLookup(
			request,
			url,
			clientIP,
			CLI_UA.test(userAgent),
			checkEasterEggs(userAgent)
		);
	}
} satisfies ExportedHandler<Env>;
