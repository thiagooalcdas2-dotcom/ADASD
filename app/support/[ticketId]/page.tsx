export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  return <div className="py-6"><h1 className="text-2xl font-bold">Ticket {params.ticketId}</h1><p>Thread de mensagens cliente x equipe.</p></div>;
}
