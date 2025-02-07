import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, User, ShoppingBag, Printer, X } from 'lucide-react';

type ItemPedido = {
  tipo: 'ingresso' | 'produto';
  sessao?: {
    filme: {
      titulo: string;
    };
    dataHora: string;
    sala: {
      numero: number;
    };
  };
  lugar?: number;
  produto?: {
    nome: string;
  };
  quantidade: number;
  valor: number;
};

type ComprovantePedidoProps = {
  pedido: {
    id: string;
    cliente: {
      nome: string;
      cpf: string;
    };
    itens: ItemPedido[];
    valorTotal: number;
  };
  onClose: () => void;
};

export function ComprovantePedido({ pedido, onClose }: ComprovantePedidoProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative print:shadow-none print:max-w-none">
        {/* Cabeçalho */}
        <div className="p-4 border-b bg-white rounded-t-lg flex justify-between items-center print:border-b-black">
          <h2 className="text-2xl font-bold text-gray-800">Comprovante de Compra</h2>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Imprimir"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Fechar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6 print:max-h-none print:overflow-visible">
          <div className="text-center mb-6">
            <p className="text-gray-600">Pedido #{pedido.id}</p>
            <p className="text-sm text-gray-500 print:block hidden">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">{pedido.cliente.nome}</p>
                <p className="text-sm text-gray-600">{pedido.cliente.cpf}</p>
              </div>
            </div>

            <div className="divide-y">
              {pedido.itens.map((item, index) => (
                <div key={index} className="py-4">
                  {item.tipo === 'ingresso' ? (
                    <div className="bg-blue-50 p-4 rounded-lg print:bg-white print:border print:border-blue-300">
                      <h3 className="font-bold text-lg mb-2">{item.sessao?.filme.titulo}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.sessao?.dataHora || '').toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(item.sessao?.dataHora || '').toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Sala {item.sessao?.sala.numero}</p>
                          <p className="text-sm text-gray-600">Lugar {item.lugar}</p>
                        </div>
                      </div>
                      <p className="text-right font-medium mt-2">
                        R$ {item.valor.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg print:bg-white print:border print:border-green-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{item.produto?.nome}</p>
                            <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                          </div>
                        </div>
                        <p className="font-medium">R$ {item.valor.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center my-6">
              <QRCodeSVG
                value={`CINEMA-TICKET-${pedido.id}`}
                size={200}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-center text-sm text-gray-600 mb-6">
              <p>Apresente este QR Code no cinema</p>
              <p>Válido apenas para a data e sessão especificadas</p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t p-4 bg-white rounded-b-lg print:border-t-black">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold">
              R$ {pedido.valorTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }

          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .fixed {
            position: relative !important;
            height: auto !important;
            overflow: visible !important;
          }

          .max-h-\\[calc\\(100vh-16rem\\)\\] {
            max-height: none !important;
          }

          .overflow-y-auto {
            overflow: visible !important;
          }

          .bg-black {
            background: none !important;
          }

          .bg-blue-50,
          .bg-green-50,
          .bg-gray-50 {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print\\:border {
            border-width: 1px !important;
          }

          .shadow-xl {
            box-shadow: none !important;
          }

          .rounded-lg {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}