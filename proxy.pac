function FindProxyForURL(url, host) {
    // Normalización
    host = host.toLowerCase();

    // ---------------------------------------------------------
    // 1. REGLA DE PRUEBA (KILL SWITCH) - PRIMERO QUE NADA
    // ---------------------------------------------------------
    // Al poner esto primero, evitamos que el script intente resolver DNS
    // para un dominio que sabemos que no existe.
    if (host === "test-pac.lab") {
        // Usamos una IP que sabemos que va a dar timeout o rechazar, 
        // pero validará que el proxy fue seleccionado.
        return "PROXY 198.51.100.1:8080";
    }

    // ---------------------------------------------------------
    // 2. Excepciones Simples (Sin DNS)
    // ---------------------------------------------------------
    if (isPlainHostName(host) ||
        shExpMatch(host, "*.local") ||
        dnsDomainIs(host, "pages.dev")) {
        return "DIRECT";
    }

    // ---------------------------------------------------------
    // 3. Excepciones Complejas (Con DNS)
    // ---------------------------------------------------------
    // Solo llegamos aquí si NO es test-pac.lab.
    // OJO: Si el host no existe en DNS, esta línea podría fallar y causar
    // que el tráfico vaya DIRECT por error en algunos navegadores.
    // Es recomendable envolver dnsResolve en un try-catch o usar isResolvable,
    // pero para este lab, simplemente moverlo debajo es suficiente.

    // Si quieres ser muy estricto:
    /* try {
        var resolvedIp = dnsResolve(host);
        if (isInNet(resolvedIp, "10.0.0.0", "255.0.0.0")) {
            return "DIRECT";
        }
    } catch(e) { 
        // Si falla el DNS, seguimos
    }
    */

    // ---------------------------------------------------------
    // 4. Tráfico General
    // ---------------------------------------------------------
    return "DIRECT";
}