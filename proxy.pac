function FindProxyForURL(url, host) {
    // Normalización para evitar errores de coincidencia de mayúsculas/minúsculas
    host = host.toLowerCase();

    // 1. Excluir tráfico local y de la propia red de Cloudflare para evitar bucles
    if (isPlainHostName(host) |

|
        shExpMatch(host, "*.local") |

|
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        dnsDomainIs(host, "pages.dev")) {
        return "DIRECT";
    }

    // 2. Condición de Prueba: "Kill Switch" para verificar la aplicación del PAC
    // Si navegamos a "test-pac.local" (o un dominio ficticio), enviamos a un proxy falso.
    if (host == "test-pac.lab") {
        return "PROXY 198.51.100.1:8080"; // IP de TEST-NET-2 (reservada, no enrutable)
    }

    // 3. Tráfico General
    // En un escenario real aquí irían los proxies corporativos.
    // Para el lab, usamos DIRECT para permitir navegación, o un proxy SOCKS si se tiene uno.
    return "DIRECT";
}