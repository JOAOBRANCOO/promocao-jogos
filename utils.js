export function esperarExecucao(acao, atraso = 500) {
    let idAtraso;
    return (...params) => {
        clearTimeout(idAtraso);
        idAtraso = setTimeout(() => {
            acao(...params);
        }, atraso);
    };
}
