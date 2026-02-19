export default function OrderTrackPage({ params }: { params: { id: string } }) {
  return <div className="py-6"><h1 className="text-2xl font-bold">Pedido #{params.id}</h1><p>Status atualizado via polling da API a cada 10 segundos.</p></div>;
}
