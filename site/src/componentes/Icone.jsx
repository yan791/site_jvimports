// Ícones de linha desenhados à mão (24x24), herdam a cor do texto
const D = {
  whatsapp: (
    <path fill="currentColor" stroke="none" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.2 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
  ),
  seta: <path d="M5 12h14m-5-5 5 5-5 5" />,
  caixa: <><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>,
  bateria: <><rect x="2.5" y="7" width="17" height="10" rx="2.6" /><path d="M21.5 10.5v3" /><rect x="5" y="9.5" width="10" height="5" rx="1" fill="currentColor" stroke="none" /></>,
  moto: <><circle cx="5.5" cy="16.5" r="3" /><circle cx="18.5" cy="16.5" r="3" /><path d="M8.5 16.5h5l3-6h-4l-2 3H7.2M13 7h3l2.5 6.5" /></>,
  check: <path d="m5 12.5 4.2 4L19 7" />,
  play: <path fill="currentColor" stroke="none" d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.2 5a.8.8 0 0 0-1.2.8Z" />,
  pausa: <><rect x="7" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none" /><rect x="13.8" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none" /></>,
  conversa: <path d="M20 12.5a7.5 7.5 0 0 1-11 6.6L4 20l1.1-4.3A7.5 7.5 0 1 1 20 12.5Z" />,
  pedido: <><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M9 8.5h6M9 12h6M9 15.5h3.5" /></>,
  pino: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  escudoCheck: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z" /><path d="m8.6 12 2.4 2.4 4.4-4.6" /></>,
  nota: <><path d="M6 3.5h9l3.5 3.5v13.5H6z" /><path d="M14.5 3.5V7H18M9 11.5h6M9 15h6" /></>,
  camera: <><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" /><circle cx="12" cy="13" r="3.4" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.9" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></>,
  tela: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" /><path d="m9 8 2.5 2.2-1 2.5 3.5 2.3" /></>,
  raio: <path d="M13 2.5 5.5 13.5h5.5L10 21.5l8.5-11.5H13z" />,
  laser: <><path d="M12 2.5v6M8 4.5l2 3M16 4.5l-2 3" /><rect x="6" y="11" width="12" height="10.5" rx="2" /><path d="M6 15h12" /></>,
  android: <><path d="M6.5 10.5a5.5 5.5 0 0 1 11 0v7a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5z" /><path d="M6.5 11.5h11M8.5 5 7.3 3.2M15.5 5l1.2-1.8" /><circle cx="9.7" cy="8.4" r="0.7" fill="currentColor" stroke="none" /><circle cx="14.3" cy="8.4" r="0.7" fill="currentColor" stroke="none" /></>,
  cabo: <><path d="M8.5 3v4M15.5 3v4" /><path d="M6.5 7h11v3.5a5.5 5.5 0 0 1-11 0z" /><path d="M12 16v2.5a3 3 0 0 1-3 3H7" /></>,
  ipad: <><rect x="4" y="2.5" width="16" height="19" rx="2.4" /><path d="M11 18.5h2" /></>,
  macbook: <><rect x="4.5" y="5" width="15" height="10" rx="1.4" /><path d="M2.5 18.5h19l-1.2-2H3.7z" /></>,
  relogio: <><rect x="6" y="6" width="12" height="12" rx="3.4" /><path d="M8.5 6 9.3 2.5h5.4L15.5 6M8.5 18l.8 3.5h5.4l.8-3.5M18 10.5h1" /></>,
  airpods: <><path d="M8 4.5a3 3 0 0 0-3 3c0 1.7 1.3 3 3 3V19a1.5 1.5 0 0 0 3 0V7.5a3 3 0 0 0-3-3ZM16 4.5a3 3 0 0 1 3 3c0 1.7-1.3 3-3 3V19a1.5 1.5 0 0 1-3 0V7.5a3 3 0 0 1 3-3Z" /></>,
  iphone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" /><path d="M10.5 5h3" /></>,
  estrela: <path fill="currentColor" stroke="none" d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
  sinal: <><rect x="2" y="15" width="3" height="5" rx="0.8" fill="currentColor" stroke="none" /><rect x="7" y="11.5" width="3" height="8.5" rx="0.8" fill="currentColor" stroke="none" /><rect x="12" y="8" width="3" height="12" rx="0.8" fill="currentColor" stroke="none" /><rect x="17" y="4.5" width="3" height="15.5" rx="0.8" fill="currentColor" stroke="none" /></>,
  wifi: <><path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.5a9.2 9.2 0 0 1 12.4 0M9.2 16a4.5 4.5 0 0 1 5.6 0" /><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" /></>,
  voltar: <path d="m14.5 5-7 7 7 7" />,
  mais: <path d="M12 5v14M5 12h14" />,
  microfone: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
}

export function Icone({ nome, className, tamanho }) {
  const style = tamanho ? { width: tamanho, height: tamanho } : undefined
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {D[nome]}
    </svg>
  )
}
