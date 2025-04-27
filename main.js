import { esperarExecucao } from './utils.js';

import { buscarJogos } from './api.js';

const formularioBusca = document.getElementById('form-busca');
const campoBusca = document.getElementById('campo-busca');

const buscar = async () => {
    const nomeJogo = campoBusca.value.trim();

    if (nomeJogo.length < 3) {
        listaJogos.innerHTML = 'Digite pelo menos 3 letras.';
        mensagem.textContent = '';
        jogosCarregados = [];
        atualizarPaginacao();
        return;
    }

    console.log(`🔍 Buscando por: "${nomeJogo}"`);

    try {
        const { origem, dados } = await buscarJogos(nomeJogo);
        if (!dados || !Array.isArray(dados)) {
            throw new Error('Dados inválidos da API');
        }
        jogosCarregados = dados;
        paginaAtual = 1;
        exibirJogos(origem, jogosCarregados);
    } catch (erro) {
        listaJogos.innerHTML = 'Erro ao buscar jogos. Tente novamente mais tarde.';
        console.error(erro);
    }
};

formularioBusca.addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscar();
});

campoBusca.addEventListener('input', esperarExecucao(buscar, 500));


const listaJogos = document.getElementById('lista-jogos');
const mensagem = document.getElementById('mensagem');

let jogosCarregados = [];
let paginaAtual = 1;
const itensPorPagina = 5;

function exibirJogos(origem, jogos) {
    listaJogos.innerHTML = '';

    if (!jogos || !Array.isArray(jogos) || jogos.length === 0) {
        listaJogos.textContent = 'Nenhum jogo encontrado.';
        return;
    }

    mensagem.textContent = `Fonte dos dados: ${origem === 'cache' ? 'Cache' : 'API'}`;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    jogos.slice(inicio, fim).forEach(jogo => {
        const divJogo = document.createElement('div');
        divJogo.classList.add('jogo');

        const tituloJogo = document.createElement('h3');
        tituloJogo.textContent = jogo.external;

        const imagemJogo = document.createElement('img');
        imagemJogo.src = jogo.thumb;
        imagemJogo.alt = `Capa do jogo ${jogo.external}`;

        const precoJogo = document.createElement('p');
        precoJogo.textContent = `Preço mais barato: $${jogo.cheapest}`;

        const linkOferta = document.createElement('a');
        linkOferta.href = `https://www.cheapshark.com/redirect?dealID=${jogo.cheapestDealID}`;
        linkOferta.textContent = 'Ver oferta';
        linkOferta.target = '_blank';
        linkOferta.style.display = 'block';

        divJogo.appendChild(tituloJogo);
        divJogo.appendChild(imagemJogo);
        divJogo.appendChild(precoJogo);
        divJogo.appendChild(linkOferta);
        listaJogos.appendChild(divJogo);
    });

    atualizarPaginacao();
}

const botaoAnterior = document.getElementById('botao-anterior');
const botaoProximo = document.getElementById('botao-proximo');

function atualizarPaginacao() {
    botaoAnterior.disabled = paginaAtual === 1;
    botaoProximo.disabled = paginaAtual * itensPorPagina >= jogosCarregados.length;
}

botaoAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirJogos('cache', jogosCarregados);
    }
});

botaoProximo.addEventListener('click', () => {
    if (paginaAtual * itensPorPagina < jogosCarregados.length) {
        paginaAtual++;
        exibirJogos('cache', jogosCarregados);
    }
});
