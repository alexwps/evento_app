'use client';
import Botao from "@/components/eventos/botao";
import Formulario from "@/components/eventos/formulario";
import Layout from "@/components/eventos/layout";
import Tabela from "@/components/eventos/tabela";
import Evento from "@/core/Evento";
import { atualizarEvento, cadastrarEvento, excluirEvento, fetchEventos } from "@/service/eventoService";
import { useEffect, useState } from "react";

export default function Eventos() {
    
    function eventoSelecionado(evento: Evento) {
        setEvento(evento)
        setVisivel('form')
    }

    function novoEvento() {
        setEvento(Evento.vazio())
        setVisivel("form")
    }

    const [evento, setEvento] = useState<Evento>(Evento.vazio())

    const [visivel, setVisivel] = useState<'tabela' | 'form'>('tabela')

    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        if (visivel === 'tabela') {
            const loadEventos = async () => {
                try { const dados = await fetchEventos();
                setEventos(dados);
            } catch (error) {
                console.error("Erro ao buscar eventos", error);
            }}
            loadEventos();
        } }, [visivel]);

    async function salvarEvento(evento: Evento) {
     try{
        const novoEvento = await cadastrarEvento(evento);
        setVisivel("tabela");
     } catch (error) {
        console.error("Erro ao salvar evento:", error);
     }   
    }

    async function alterarEvento(evento:Evento) {
        try {
            const eventoAtualizado = await atualizarEvento(evento);
            setVisivel("tabela");
        } catch (error) {
            console.error("Erro ao atualizar evento:", error);
        }
    }

    function salvarOuAlterarEvento(evento: Evento) {
        if (evento.id) {
        alterarEvento(evento)
        } else {
        salvarEvento(evento)
        }
       }

    async function eventoExcluido(evento: Evento) {
        const confirmacao =
         window.confirm("Tem Certeza de que deseja excluir este evento?");
     if (confirmacao) {
        try {
            if (evento.id !== null) {
                await excluirEvento(evento.id);
            } else {
                console.error("eventoId é null");
            }
            setEventos(prevEventos => prevEventos.filter(ev => ev.id !== evento.id));
        }   catch (error) {
            console.error("Erro ao excluir evento:", error);
        }}}
    return (
        <div className={`
            flex justify-center items-center h-screen
            bg-gradient-to-bl from-red-900 via-red-400 to-red-800
            text-white`}>
            <Layout titulo="Cadastro de eventos">
                {visivel === 'tabela' ? (
                    <> <div className="flex justify-end">
                        <Botao className="mb-4" cor="bg-gradient-to-r from-green-500 to-green-700"
                            onClick={() => novoEvento()}>
                            Novo evento </Botao>
                    </div>
                    <Tabela eventos={eventos}
                        eventoSelecionado={eventoSelecionado}
                        eventoExcluido={eventoExcluido}></Tabela>
                    </>
                ) : (<Formulario evento={evento}
                    eventoMudou={salvarOuAlterarEvento}
                    cancelado={() => setVisivel('tabela')} />)}
            </Layout>
        </div>
    )
} 
    
