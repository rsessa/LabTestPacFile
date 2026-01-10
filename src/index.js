export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Solo respondemos si piden /proxy.pac
        if (url.pathname === "/proxy.pac") {

            // --- ZONA DE MONITORIZACIÓN ---
            const clientIP = request.headers.get("CF-Connecting-IP");
            const userAgent = request.headers.get("User-Agent");
            const country = request.cf ? request.cf.country : "Desconocido";

            // Esto aparecerá en los logs "Real-time" de Cloudflare
            console.log(`📡 DESCARGA PAC DETECTADA | IP: ${clientIP} | País: ${country} | UA: ${userAgent}`);

            // --- TU CONTENIDO PAC ---
            // Pega aquí el contenido de tu PAC tal cual.
            const pacContent = `
        function FindProxyForURL(url, host) {
            host = host.toLowerCase();
            
            // 1. Kill Switch de prueba
            if (host === "test-pac.lab") {
                return "PROXY 198.51.100.1:8080";
            }

            // 2. Excepciones
            if (isPlainHostName(host) || shExpMatch(host, "*.local") || dnsDomainIs(host, "pages.dev")) {
                return "DIRECT";
            }

            // 3. Por defecto
            return "DIRECT";
        }
      `;

            // --- RESPUESTA CON HEADERS ---
            return new Response(pacContent, {
                headers: {
                    "Content-Type": "application/x-ns-proxy-autoconfig",
                    "Cache-Control": "public, max-age=120, must-revalidate",
                    "Access-Control-Allow-Origin": "*",
                    "X-Content-Type-Options": "nosniff"
                }
            });
        }

        // Si piden otra cosa (ej: la raíz /) devolvemos 404 o un texto simple
        return new Response("Worker activo. Usa /proxy.pac", { status: 200 });
    }
};