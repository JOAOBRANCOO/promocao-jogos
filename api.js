const URL_API = 'https://www.cheapshark.com/api/1.0/games';
const TEMPO_CACHE = 5 * 60 * 1000;

export async function buscarJogos(nomeJogo) {
    const chaveCache = `jogos-${nomeJogo}`;
    const agora = Date.now();
    const dadosCache = localStorage.getItem(chaveCache);

    if (dadosCache) {
        const { listaJogos, horarioSalvo } = JSON.parse(dadosCache);
        if (agora - horarioSalvo < TEMPO_CACHE && Array.isArray(listaJogos)) {
            console.log("Dados vindos do cache");
            return { origem: 'cache', dados: listaJogos };
        }
    }

    try {
        const resposta = await fetch(`${URL_API}?title=${encodeURIComponent(nomeJogo)}`);
        if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);

        const listaJogos = await resposta.json();
        if (!Array.isArray(listaJogos)) throw new Error("Resposta inválida da API");

        localStorage.setItem(chaveCache, JSON.stringify({ listaJogos, horarioSalvo: agora }));

        console.log("Dados vindos da API");
        return { origem: 'api', dados: listaJogos };

    } catch (erro) {
        console.error("Erro ao buscar jogos:", erro);
        return { origem: 'erro', dados: [] };
    }
}
